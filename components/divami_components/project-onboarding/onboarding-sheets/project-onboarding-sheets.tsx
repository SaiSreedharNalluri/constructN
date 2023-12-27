import React, { useEffect, useState } from 'react'

import StructureHierarchy from './structure-hierarchy'

import instance from '../../../../services/axiosInstance'

import { API } from '../../../../config/config'

import authHeader from '../../../../services/auth-header'

import { useComputed, useSignalEffect } from '@preact/signals-react'

import { IOnboardingProps } from '../projectOnboarding'

import { CustomToast } from '../../custom-toaster/CustomToast'

const headers = { headers: authHeader.authHeader() }

const fetchStructureHierarchy = (projectId: string) => {

  try { return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/hierarchy`, headers) } catch (error) { throw error }

}

const createStructure = (projectId: string, name: string, parent: string, type: string = 'Interior', isExterior: boolean = false) => {

  const body = { name, type, parent, isExterior }

  try { return instance.post(`${API.BASE_URL}/projects/${projectId}/structures`, body, headers) } catch (error) { throw error }

}

const deleteStructure = (projectId: string, structureId: string) => {

  try { return instance.delete(`${API.BASE_URL}/projects/${projectId}/structures/${structureId}`, headers) } catch (error) { throw error }

}

const ProjectOnboardingSheets = ({ step, action, projectId, hierarchy }: IOnboardingProps) => {

  useSignalEffect(() => {
    console.log('Action inside Sheets', 'Step:', step.peek(), 'Action:', action?.value, 'Project ID:', projectId.peek())
    switch (action!.value) {
      case 'Back-1':
        step.value = 0
        action!.value = ''
        break
      case 'Next-1':
        step.value = 2
        action!.value = ''
        break
      default:
        break
    }
  })

  const [mHierarchy, setHierarchy] = useState<any>()

  useEffect(() => {

    fetchStructureHierarchy(projectId.value).then(res => {

      if (res.data.result) {

        if(hierarchy !== undefined) hierarchy.value = res.data.result

        setHierarchy(res.data.result)

      }

    }).catch(err => console.log(err))

  }, [])

  const _onAdd = (name: string, parent: string) => {

    createStructure(projectId.peek(), name, parent, 'Interior', false)
      .then(res => {
        fetchStructureHierarchy(projectId.value).then(res => {
          if (res.data.result) {
            setHierarchy(res.data.result)
            CustomToast('Added level successfully.', 'success')
          }
        }).catch(err => console.log(err))
      })
      .catch(err => CustomToast('Failed to create level.', 'error'))

  }

  const _onDelete = (structure: string) => {

    deleteStructure(projectId.peek(), structure).then(res => {
      fetchStructureHierarchy(projectId.value).then(res => {
        if (res.data.result) {
          setHierarchy(res.data.result)
          CustomToast('Deleted level successfully.', 'success')
        }
      }).catch(err => console.log(err))
    })
    .catch(err => CustomToast('Failed to delete level.', 'error'))

  }

  const _reload = () => {
    fetchStructureHierarchy(projectId.value).then(res => {
      if (res.data.result) {
        setHierarchy(res.data.result)
      }
    }).catch(err => console.log(err))

  }


  return (

    <div>

      <div className='flex mb-2 p-1 ml-[1rem] bg-[#e2e3e5] border border-slate-50 rounded text-sm justify-between align-center group'>

        <div className={`flex flex-1 pl-4 items-center flex-wrap cursor-pointer rounded text-black text-[600]`} >
          Level Name
        </div>

        <div className='flex w-[25vw] items-center mr-4 justify-center'>
          Drawings
        </div>

        <div className='flex w-[14rem] group-hover:opacity-100 opacity-0 items-center'>
          
        </div>

      </div>

      {mHierarchy && <StructureHierarchy projectId={projectId.value} hierarchy={mHierarchy} 
        onAdd={_onAdd} onDelete={_onDelete} onSheetAdded={_reload} />}

    </div>

  )

}

export default ProjectOnboardingSheets