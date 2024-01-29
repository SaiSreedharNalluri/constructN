import authHeader from "./auth-header";
import instance from "./axiosInstance";
import { API, PROCORE } from "../config/config";
import procoreinstance from "./procoreInstance";


const accesstoken = () => {
  try {
    const userObj: any = localStorage.getItem("userCredentials");
    let user = null;

    if (userObj) user = JSON.parse(userObj);
    const procoreToken = user.metadata.procore;

    if (user && procoreToken.accessToken) {
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
      console.log("refreshTokenerror", error);

      throw error.response.data;
    });
};
/**RFI API's */
export const getRfiManager = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis/potential_rfi_managers`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getReceivedFrom = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis/potential_received_froms`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.log("error msg procore", error.response.data);
      throw error.response.data;
    });
};

export const getResponsibleContractor = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis/potential_responsible_contractors`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const potentialDistributionMembers = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis/potential_distribution_members`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const specSection = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.0/specification_sections?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getLocation = (projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.0/projects/${projectId}/locations`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getcoastCode = (projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.0/cost_codes?project_id=${projectId}`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getRfiStage = (projectId:number | undefined,companyId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.0/companies/${companyId}/project_stages?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const costImpact = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis/potential_cost_impacts`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const scheduleImpact = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis/potential_schedule_impacts`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const createRfi = (formData: any,projectId:number | undefined) => {
  return procoreinstance
    .post(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis`,
      formData,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("errror response", error);
      throw error.response;
    });
};


export const ListRfi = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/rfis?filters[status]=open`,

      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("errror response", error);
      throw error.response;
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
      throw error.response.data;
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
      throw error.response.data;
    });
};

export const showRfiDetails = (id: number,projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.0/projects/${projectId}/rfis/${id}`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

/**Observation APIs */

export const tradeList = (companyId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.0/companies/${companyId}/trades`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const typesList = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.0/observations/types?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const contributingConditionsList = (companyId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.0/companies/${companyId}/contributing_conditions`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const contributingBehaviorList = (companyId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.0/companies/${companyId}/contributing_behaviors`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const hazardList = (companyId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.0/companies/${companyId}/hazards`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const createObservation = (formData: object) => {
  return procoreinstance
    .post(
      `${PROCORE.BASE_URL}/rest/v1.0/observations/items`,
      formData,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const listObservation = (projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.0/observations/items?project_id=${projectId}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error.response.data;
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
      throw error.response.data;
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
      throw error.response.data;
    });
};

export const showObservationDetails = (id: number,projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.0/observations/items/${id}?project_id=${projectId}`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

/**submittal APIs */
export const createSubmittal = (formData: object,projectId:number | undefined) => {
  return procoreinstance
    .post(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/submittals`,
      formData,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("errror response", error);
      throw error.response;
    });
};

export const listSubmittal = (projectId:number | undefined) => {
  return procoreinstance
    .get(`${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/submittals`, {
      headers: accesstoken(),
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log("errror response", error);
      throw error.response;
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
      throw error.response.data;
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
      throw error.response.data;
    });
};

export const showSubmittalDetails = (id: number,projectId:number | undefined) => {
  return procoreinstance
    .get(
      `${PROCORE.BASE_URL}/rest/v1.1/projects/${projectId}/submittals/${id}`,
      {
        headers: accesstoken(),
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
