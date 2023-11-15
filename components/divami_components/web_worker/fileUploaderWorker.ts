import axios from "axios";

self.onmessage = async (event) => {
  await axios.put(event.data.url,event.data.file).then((response)=>{
            if(response.status===200)
            {
              self.postMessage({ status: 'done',fileName:event.data.file.name});
            }
            else{
              self.postMessage({ status: 'failed',fileName:event.data.file.name});
            }
          }).catch((error)=>{
            self.postMessage({ status: 'error', fileName: event.data.file.name, errorMessage: error.message });
            return;
          })
  }






// self.onmessage = async (event) => {
//   const file = event.data.selectedFile;
//   const fileSize = file.size;
//   let uploadedSize = 0;
//   const uploadFile = async () => {
//     const chunkSize = 1024 * 1024; // 1MB
//     while (uploadedSize < fileSize) {
//       const progress = Math.min((uploadedSize / fileSize) * 100, 100);
//       self.postMessage({ type: 'progress', data: progress });

//       // Read a chunk of the file
//       const chunk = file.slice(uploadedSize, uploadedSize + chunkSize);
//       console.log('chunk',chunk)
//       console.log('file',file)
//       const formData = new FormData();
//       formData.append('file',file);
//       try {
//         // Make the PUT request to the signed S3 URL
//         const response:any = await instance.put(`${process.env.NEXT_PUBLIC_HOST}/users/profile/avatar`,formData, {
//           headers: {
//             Authorization:  `Bearer ${event.data.authToken}`,
//             'Content-Type': 'multipart/form-data',
//           }})

//         if (response?.sucess === false) {
//           throw new Error('Upload failed');
//         }

//       uploadedSize += chunkSize;
//       } catch (error) {
//         console.error('Upload error:', error);
//         // Handle error as needed
//         return;
//       }
//     }
//     self.postMessage({ type: 'done' });
//   };

//   await uploadFile();
// };



