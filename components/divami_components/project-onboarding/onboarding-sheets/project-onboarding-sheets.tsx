import React, { useEffect, useState } from 'react'

import StructureHierarchy from './structure-hierarchy'

import instance from '../../../../services/axiosInstance'

import { API } from '../../../../config/config'

import authHeader from '../../../../services/auth-header'

import { useSignalEffect } from '@preact/signals-react'

import { IOnboardingProps } from '../projectOnboarding'

const headers = { headers: authHeader.authHeader() }

const fetchStructureHierarchy = (projectId: string) => {

  try { return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/hierarchy`, headers) } catch (error) { throw error }

}

const ProjectOnboardingSheets = ({ step, action, projectId, structureId }: IOnboardingProps) => {

  useSignalEffect(() => {
    console.log('Action inside Sheets', 'Step:', step.peek(), 'Action:', action?.value, 'Project ID:', projectId.peek())
    switch(action!.value) {
      case 'Back-1':
        step.value = 0
        action!.value = ''
        break
      case 'Next-1':
        if(structureId) structureId.value = 'STR123456'
        step.value = 2
        action!.value = ''
        break
      default:
        break
    }
  })

  const [hierarchy, setHierarchy] = useState<any>()
  
  useEffect(() => {

    fetchStructureHierarchy(projectId.value).then(res => {

      if (res.data.result) {

        setHierarchy(res.data.result)

      }

    }).catch(err => console.log(err))

  }, [])

  const _onAdd = (name: string, parent: string | undefined) => {

    console.log(name, parent)

  }

  const _onDelete = (structure: string) => {

    console.log(structure)

  }

  return (
  
    <div> { hierarchy &&  <StructureHierarchy hierarchy={hierarchy} onAdd={_onAdd} onDelete={_onDelete} /> }</div>
  
  )

}

export default ProjectOnboardingSheets