import React, { useEffect, useState } from 'react'

import StructureHierarchy from './structure-hierarchy'

import instance from '../../../../services/axiosInstance'

import { API } from '../../../../config/config'

import authHeader from '../../../../services/auth-header'

const headers = { headers: authHeader.authHeader() }

const fetchStructureHierarchy = (projectId: string) => {

  try { return instance.get(`${API.BASE_URL}/projects/${projectId}/structures/hierarchy`, headers) } catch (error) { throw error }

}

const ProjectOnboardingSheets = () => {

  const [hierarchy, setHierarchy] = useState<any>()
  
  useEffect(() => {

    fetchStructureHierarchy('PRJ201897').then(res => {

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