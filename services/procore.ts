import authHeader from "./auth-header";
import instance from "./axiosInstance";
import { API, PROCORE } from "../config/config";
import procoreinstance from "./procoreInstance";
import { CustomToast } from "../components/divami_components/custom-toaster/CustomToast";


const accesstoken = (isMultipartFormData=false) => {
  try {
    const userObj: any = localStorage.getItem("userCredentials");
    let user = null;

    if (userObj) user = JSON.parse(userObj);
    const procoreToken = user.metadata.procore;

    if (user && procoreToken.accessToken) {
      if(isMultipartFormData){
        return { Authorization: "Bearer " + procoreToken.accessToken,"content-type": "multipart/form-data" }
      }
      return { Authorization: "Bearer " + procoreToken.accessToken };
    } else {
      return { Authorization: "" };
    }
  } catch (error) {
    throw error;
  }
};

export const procorerefreshToken = () => {
  return procoreinstance
    .get(`${API.BASE_URL}/users/profile?procore=true`, {
      headers: authHeader.authHeader(),
    })
    .then((response) => {
      const result = response.data.result;

      const userObj: any = localStorage.getItem("userCredentials");
      let user = null;
      if (userObj) {
        user = JSON.parse(userObj);

        const oldProcoreToken = user.metadata.procore;
        const procoreToken = result.metadata.procore;
        oldProcoreToken.refreshToken = procoreToken.refreshToken;
        oldProcoreToken.accessToken = procoreToken.accessToken;
        localStorage.setItem("userCredentials", JSON.stringify(user));
      }

      return response.data.result;
    })
    .catch((error) => {

      throw error.response.data;
    });
};
/**RFI API's */
export const getRfiManager = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis/potential_rfi_managers`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getReceivedFrom = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis/potential_received_froms`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getResponsibleContractor = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis/potential_responsible_contractors`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const potentialDistributionMembers = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis/potential_distribution_members`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const specSection = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/specification_sections?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const getLocation = (projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/projects/${projectId}/locations`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const getcoastCode = (projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/cost_codes?project_id=${projectId}`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};
export const getRfiStage = (projectId:number | undefined,companyId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/companies/${companyId}/project_stages?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const costImpact = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis/potential_cost_impacts`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const scheduleImpact = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis/potential_schedule_impacts`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const createRfi = (formData: any,projectId:number | undefined) => {
  return procoreinstance
    .post(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis`,
      formData,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};


export const ListRfi = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/rfis?filters[status][]=draft&filters[status][]=open`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};

export const linkIssueRfi = (
  projectId: string,
  issueId: string,
  number: number | null
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/issues/${issueId}/procore/rfi/link/${number}`,
      {
        headers: authHeader.authHeader,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      CustomToast("Failed to link rfi!","error")
    });
};

export const linkTaskRfi = (
  projectId: string,
  taskId: string,
  number: number | null
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/tasks/${taskId}/procore/rfi/link/${number}`,
      {
        headers: authHeader.authHeader,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      CustomToast("Failed to link rfi!","error")
    });
};

export const showRfiDetails = (id: number,projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/projects/${projectId}/rfis/${id}`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response?.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateAttachmentsExistRfi =(projectId:number| undefined,rfiId:number | null,formData:any)=>{
  return procoreinstance
  .put(`${PROCORE.SANDBOX_URL}/rest/v1.0/projects/${projectId}/rfis/${rfiId}`,formData,{
  headers: accesstoken(),
   })
   .then((response)=>{
    return response.data
   })
   .catch((error)=>{
    throw error.response.data
   })
}

/**Observation APIs */

export const tradeList = (companyId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/companies/${companyId}/trades`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const typesList = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/observations/types?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const contributingConditionsList = (companyId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/companies/${companyId}/contributing_conditions`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const contributingBehaviorList = (companyId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/companies/${companyId}/contributing_behaviors`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const hazardList = (companyId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/companies/${companyId}/hazards`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const createObservation = (formData: any) => {
  
  return procoreinstance
    .post(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/observations/items`,
      formData,
      {
        headers: accesstoken(true),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
      
    });
};

export const listObservation = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.0/observations/items?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error:any) => {
      throw error;
    });
};

export const linkIssueObservation = (
  projectId: string,
  issueId: string,
  number: number | null
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/issues/${issueId}/procore/observation/link/${number}`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      CustomToast("Failed to link Issue!","error")
    });
};

export const linkTaskObservation = (
  projectId: string,
  taskId: string,
  number: number | null
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/tasks/${taskId}/procore/observation/link/${number}`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      CustomToast("Failed to link task!","error")
    });
};

export const showObservationDetails = (id: number,projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/observations/items/${id}?project_id=${projectId}`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error;
    });
};

export const updateAttachmentsExistObservation =(observationId:number | null,formData:object)=>{
  return procoreinstance
  .put(`${PROCORE.SANDBOX_URL}/rest/v1.0/observations/items/${observationId}`,formData,{
  headers: accesstoken(),
   })
   .then((response)=>{
    return response.data
   })
   .catch((error)=>{
    throw error
   })
}



/**submittal APIs */
export const createSubmittal = (formData: object,projectId:number | undefined) => {
  return procoreinstance
    .post(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals`,
      formData,
      {
        headers: accesstoken(true),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error
    });
};

export const listSubmittal = (projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error
    });
};

export const linkIssueSubmittal = (
  projectId: string,
  issueId: string,
  number: number | null
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/issues/${issueId}/procore/submittal/link/${number}`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error
    });
};
export const linkTaskSubmittal = (
  projectId: string,
  taskId: string,
  number: number | null
) => {
  return instance
    .post(
      `${API.BASE_URL}/projects/${projectId}/tasks/${taskId}/procore/submittal/link/${number}`,
      {
        headers: authHeader.authHeader(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error
    });
};

export const showSubmittalDetails = (id: number|null,projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals/${id}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error
    });
};

export const updateAttachmentsExistSubmittal =(projectId:number | undefined, submittalId:number | null, formData:object)=>{
  return procoreinstance
  .put(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals/${submittalId}`,formData,{
  headers: accesstoken(),
   })
   .then((response)=>{
    return response.data
   })
   .catch((error)=>{
    throw error
   })
}

export const filesUpload =(projectId:number | undefined,formData:object)=>{
  return procoreinstance
  .post(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/uploads`,formData,{
    headers:accesstoken(),
  })
  .then((response)=>{
    return response.data
  })
  .catch((error)=>{
    throw error
  })
}


export const projectFile =(projectId:number|undefined,formData:object)=>{
  return procoreinstance
  .post(`${PROCORE.SANDBOX_URL}/rest/v1.0/files?project_id=${projectId}`,formData,{
        headers:accesstoken(),
  })
  .then((response)=>{
    return response.data
  })
  .catch((error)=>{
    throw error
  })
}


export const permissions =(projectId:number | undefined)=>{

  return procoreinstance .get(`${PROCORE.SANDBOX_URL}/rest/v1.0/settings/permissions?project_id=${projectId}`,
  {
    headers:accesstoken(),
  })
  .then((response)=>{
    return response.data
  })
  .catch((error)=>{
    throw error
  })
}


export const getSubmittalReceivedFrom =(projectId:number | undefined, responsibleContractorId:number|null)=>{
  if(responsibleContractorId !== null){
  return procoreinstance
  .get(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals/potential_received_froms?responsible_contractor_id=${responsibleContractorId}`,
  {
    headers:accesstoken(),
  })
  .then((response)=>{
    return response.data
  })
  .catch((error)=>{
    throw error
  })
}else{

    return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals/potential_received_froms`,
  {
    headers:accesstoken(),
  })
  .then((response)=>{
    return response.data
  })
  .catch((error)=>{
    throw error
  })
  }
}


export const getSubmittalResponsibleContractor =(projectId:number | undefined, receivedFromId: number | null)=>{
  
  if(receivedFromId !==null){
    return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals/potential_responsible_contractors?received_from_id=${receivedFromId}`,
    {
      headers:accesstoken()
    })
    .then((response)=>{
      return response.data
    })
    .catch((error)=>{
      throw error
    })
  }else{
    return procoreinstance
    .get(`${PROCORE.SANDBOX_URL}/rest/v1.1/projects/${projectId}/submittals/potential_responsible_contractors`,
    {
      headers:accesstoken()
    })
    .then((response)=>{
      return response.data
    })
    .catch((error)=>{
      throw error
    })
  }
}