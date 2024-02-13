'use client'

import instance from '../../../services/axiosInstance'

import { API, AWS } from '../../../config/config'

import authHeader from '../../../services/auth-header'

// self.onmessage = async (event: MessageEvent<{ projectId: string, structureId: string, type: string, file: File }>) => {

//   const { projectId, structureId, type, file } = event.data

//   console.log(projectId, structureId, type, file)

//   const uploader = new Uploader({file, projectId, structureId, type})

//   let mPercentage = 0

//   uploader.onProgress(({ percentage }: { percentage: number }) => {
//     // to avoid the same percentage to be logged twice
//     if (mPercentage !== percentage) {
//       mPercentage = percentage
//       console.log(`${mPercentage}%`)
//       self.postMessage({ structureId, type, percentage })
//     }
//   })
//     .onError((error: any) => {
//       console.error(error)
//     }).onComplete(() => {
//       self.postMessage({ structureId, type, mPercentage })
//     })

//   uploader.start()

// }

export class Uploader {

  private chunkSize: number
  private threadsQuantity: number
  private file: File
  private projectId: string
  private structureId: string
  private designId: string | null
  private designType: string
  private fileName: string
  private aborted: boolean
  private uploadedSize: number
  private progressCache: any
  private activeConnections: any
  private parts: any[]
  private uploadedParts: any[]
  private fileId: any | null
  private fileKey: any | null
  private onProgressFn: Function
  private onErrorFn: Function
  private onCompleteFn: Function
  private headers = { headers: authHeader.authHeader() }

  constructor(options: any) {
    // this must be bigger than or equal to 5MB,
    // otherwise AWS will respond with:
    // "Your proposed upload is smaller than the minimum allowed size"
    this.chunkSize = options.chunkSize || 1024 * 1024 * 5
    // number of parallel uploads
    this.threadsQuantity = Math.min(options.threadsQuantity || 5, 15)
    this.file = options.file
    this.fileName = options.file.name
    this.projectId = options.projectId
    this.structureId = options.structureId
    this.designId = null
    this.designType = options.type
    this.aborted = false
    this.uploadedSize = 0
    this.progressCache = {}
    this.activeConnections = {}
    this.parts = []
    this.uploadedParts = []
    this.fileId = null
    this.fileKey = null
    this.onProgressFn = () => {}
    this.onErrorFn = () => {}
    this.onCompleteFn = () => {}
  }

  // starting the multipart upload request
  start() {
    this.initialize()
  }

  async initialize() {
    try {
      // adding the the file extension (if present) to fileName
      let fileName = this.fileName
      const ext = this.file.name.split(".").pop()
      if (ext) {
        fileName += `.${ext}`
      }

      // initializing the multipart request
      const createDesignRequest = {
        "project": this.projectId,
        "structure": this.structureId,
        "type": this.designType,
        "name": this.fileName,
        "fileSize":this.file.size,
        "providerType": "internal"
      }

      const createDesignResponse = await instance.post(`${API.BASE_URL.replace('v1', 'v2')}/projects/${this.projectId}/designs`, createDesignRequest, this.headers)

      // const createDesignResponse = await api.request({
      //   url: "/uploads/getMultipartPreSignedUrls",
      //   method: "POST",
      //   data: AWSMultipartFileDataInput,
      // })
      this.fileId = createDesignResponse.data.result.fileId
      this.fileKey = createDesignResponse.data.result.fileKey

      this.designId = createDesignResponse.data.result._id
      const newParts = createDesignResponse.data.result.signedUrlList
      this.parts.push(...newParts)

      this.sendNext()
    } catch (error) {
      await this.complete(error)
    }
  }

  sendNext() {
    const activeConnections = Object.keys(this.activeConnections).length

    if (activeConnections >= this.threadsQuantity) {
      return
    }

    if (!this.parts.length) {
      if (!activeConnections) {
        this.complete()
      }

      return
    }

    const part = this.parts.pop()
    if (this.file && part) {
      const sentSize = (part.PartNumber - 1) * this.chunkSize
      const chunk = this.file.slice(sentSize, sentSize + this.chunkSize)

      const sendChunkStarted = () => {
        this.sendNext()
      }

      this.sendChunk(chunk, part, sendChunkStarted)
        .then(() => {
          this.sendNext()
        })
        .catch((error) => {
          this.parts.push(part)

          this.complete(error)
        })
    }
  }

  // terminating the multipart upload request on success or failure
  async complete(error?: any) {
    if (error && !this.aborted) {
      this.onErrorFn(error)
      return
    }

    if (error) {
      this.onErrorFn(error)
      return
    }

    try {
      await this.sendCompleteRequest()
    } catch (error) {
      this.onErrorFn(error)
    }
  }

  // finalizing the multipart upload request on success by calling
  // the finalization API
  async sendCompleteRequest() {
    if (this.fileId && this.fileKey) {
      const videoFinalizationMultiPartInput = {
        fileId: this.fileId,
        fileKey: this.fileKey,
        parts: this.uploadedParts,
        isUploaded: true
      }

      // await instance.post("/uploads/finalizeMultipartUpload", videoFinalizationMultiPartInput)
      try{
        const response = await instance.put(`${API.BASE_URL.replace('v1', 'v2')}/projects/${this.projectId}/designs/${this.designId}/file-uploaded?processNow=true`, videoFinalizationMultiPartInput, this.headers)
        if(response.data.success) this.onCompleteFn()
      } catch(error: any) {
        this.onError(error)
      }

      // await api.request({
      //   url: "/uploads/finalizeMultipartUpload",
      //   method: "POST",
      //   data: videoFinalizationMultiPartInput,
      // })
    }
  }

  sendChunk(chunk: Blob, part: any, sendChunkStarted: () => void) {
    return new Promise((resolve, reject) => {
      this.upload(chunk, part, sendChunkStarted)
        .then((status) => {
          if (status !== 200) {
            reject(new Error("Failed chunk upload"))
            return
          }

          resolve(status)
        })
        .catch((error) => {
          reject(error)
        })
    })
  }

  // calculating the current progress of the multipart upload request
  handleProgress(part: string | number, event: { type: string; loaded: any }) {
    if (this.file) {
      if (event.type === "progress" || event.type === "error" || event.type === "abort") {
        this.progressCache[part] = event.loaded
      }

      if (event.type === "uploaded") {
        this.uploadedSize += this.progressCache[part] || 0
        delete this.progressCache[part]
      }

      const inProgress = Object.keys(this.progressCache)
        .map(Number)
        .reduce((memo, id) => (memo += this.progressCache[id]), 0)

      const sent = Math.min(this.uploadedSize + inProgress, this.file.size)

      const total = this.file.size

      const percentage = Math.round((sent / total) * 100)

      this.onProgressFn({
        sent: sent,
        total: total,
        percentage: percentage,
      })
    }
  }

  // uploading a part through its pre-signed URL
  upload(file: Document | XMLHttpRequestBodyInit | null | undefined, part: { PartNumber: number; signedUrl: string | URL }, sendChunkStarted: () => void) {
    // uploading each part with its pre-signed URL
    return new Promise((resolve, reject) => {
      if (this.fileId && this.fileKey) {
        // - 1 because PartNumber is an index starting from 1 and not 0
        const xhr = (this.activeConnections[part.PartNumber - 1] = new XMLHttpRequest())

        sendChunkStarted()

        const progressListener = this.handleProgress.bind(this, part.PartNumber - 1)

        xhr.upload.addEventListener("progress", progressListener)

        xhr.addEventListener("error", progressListener)
        xhr.addEventListener("abort", progressListener)
        xhr.addEventListener("loadend", progressListener)

        xhr.open("PUT", part.signedUrl)

        xhr.onreadystatechange = () => {
          if (xhr.readyState === 4 && xhr.status === 200) {
            // retrieving the ETag parameter from the HTTP headers
            const ETag = xhr.getResponseHeader("ETag")

            if (ETag) {
              const uploadedPart = {
                PartNumber: part.PartNumber,
                // removing the " enclosing carachters from
                // the raw ETag
                ETag: ETag.replaceAll('"', ""),
              }

              this.uploadedParts.push(uploadedPart)

              resolve(xhr.status)
              delete this.activeConnections[part.PartNumber - 1]
            }
          }
        }

        xhr.onerror = (error) => {
          reject(error)
          delete this.activeConnections[part.PartNumber - 1]
        }

        xhr.onabort = () => {
          reject(new Error("Upload canceled by user"))
          delete this.activeConnections[part.PartNumber - 1]
        }

        xhr.send(file)
      }
    })
  }

  onProgress(onProgress: Function) {
    this.onProgressFn = onProgress
    return this
  }

  onError(onError: Function) {
    this.onErrorFn = onError
    return this
  }

  onComplete(onComplete: Function) {
    this.onCompleteFn = onComplete
    return this
  }

  abort() {
    Object.keys(this.activeConnections)
      .map(Number)
      .forEach((id) => {
        this.activeConnections[id].abort()
      })

    this.aborted = true
  }
}



