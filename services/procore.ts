import axios from "axios";
import instance from "./axiosInstance";
const refreshtoken = {
  Authorization:
    "Bearer " +
    "eyJhbGciOiJFUzUxMiJ9.eyJhbXIiOltdLCJhaWQiOiI1MWNhN2RkY2UwYTA1NGY2Y2QxMzE3ZDI4OTBhMTkzNWJkYTBjMDdhYWYxMDg0N2EyMTZmYTkxM2Y3NzdmOGZhIiwiYW91aWQiOm51bGwsImFvdXVpZCI6bnVsbCwiZXhwIjoxNzA0ODA4MDkwLCJzaWF0IjoxNzA0Njk5Nzk0LCJ1aWQiOjEyNTQ0OSwidXVpZCI6ImZjNGRmZTlkLWFmMTgtNGU4Ni1iMTE0LTIxOTFkMTgxNjRkMSIsImxhc3RfbWZhX2NoZWNrIjoxNzA0ODAyNjkwfQ.AJqWbWZE38cyyuCJLPU6mCJ-cZX3eLkviwfsJf7NMTqXcM1tUaV4Zfbq_iiktFAm3Ohx8YGQMpSIvduxxudtW3i3AMUI8olfDKUanGWts1rIx6W06usLW4dIdNDVqaOO7YtdCdx7ZdgF5iuVSwmdVUn2p_ZJKs525a6LNw9bTIFmoTfN",
};
export const getRfiManager = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_rfi_managers`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getReceivedFrom = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_received_froms`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getResponsibleContractor = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_responsible_contractors`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const potentialDistributionMembers = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_distribution_members`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const specSection = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.0/specification_sections?project_id=235946`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const getLocation = () => {
  return axios
    .get(`https://sandbox.procore.com/rest/v1.0/projects/235946/locations`, {
      headers: refreshtoken,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getcoastCode = () => {
  return axios
    .get(`https://sandbox.procore.com/rest/v1.0/cost_codes?project_id=235946`, {
      headers: refreshtoken,
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};
export const getRfiStage = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.0/companies/4272096/project_stages?project_id=235946`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const costImpact = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_cost_impacts`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const scheduleImpact = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_schedule_impacts`,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      throw error.response.data;
    });
};

export const createRfi = (formData: any) => {
  return axios
    .post(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis`,
      formData,
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      console.log("create response", response);
      return response;
    })
    .catch((error) => {
      console.log("errror response", error);
      throw error.response;
    });
};
export const ListRfi = () => {
  return axios
    .get(
      `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis`,
  
      {
        headers: refreshtoken,
      }
    )
    .then((response) => {
      console.log("res list response", response.data);
      return response;
    })
    .catch((error) => {
      console.log("errror response", error);
      throw error.response;
    });
};
/**Observation APIs */

export const tradeList = () =>{
  return axios .get(`https://sandbox.procore.com/rest/v1.0/companies/4272096/trades`,{
    headers: refreshtoken,
  })
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}

export const typesList =()=>{
  return axios .get(`https://sandbox.procore.com/rest/v1.0/observations/types?project_id=235946`,{
    headers:refreshtoken,
  })
   .then((response) => {
    console.log('api response for types',response.data)
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}

export const contributingConditionsList =() =>{
  return axios .get(`https://sandbox.procore.com/rest/v1.0/companies/4272096/contributing_conditions`,{
    headers:refreshtoken,
  })
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}

export const contributingBehaviorList = () => {
  return axios .get (`https://sandbox.procore.com/rest/v1.0/companies/4272096/contributing_behaviors`,{
    headers : refreshtoken,
  })
  .then((response) => {
    console.log('api response',response.data)
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}

export const hazardList =() =>{
  return axios .get (`https://sandbox.procore.com/rest/v1.0/companies/4272096/hazards`,{
    headers: refreshtoken,
  })
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}


export const createObservation =(formData:object)=>{
  return axios .post (`https://sandbox.procore.com/rest/v1.0/observations/items`,formData,{
    headers: refreshtoken,
  })
  .then((response) => {
    console.log('checking',response.data);
    
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}

export const listObservation =()=>{
  return axios .get (`https://sandbox.procore.com/rest/v1.0/observations/items?project_id=235946`,{
    headers: refreshtoken,
  })
  .then((response) => {
    console.log('checking',response.data);
    
    return response.data;
  })
  .catch((error) => {
    throw error.response.data;
  });
}



/**submittal APIs */
export const createSubmittal =(formData:object)=>{
  return axios .post(`https://sandbox.procore.com/rest/v1.1/projects/235946/submittals`,
  formData,{
    headers: refreshtoken,
  }
  )
  .then((response) => {
    console.log("create response", response);
    return response;
  })
  .catch((error) => {
    console.log("errror response", error);
    throw error.response;
  });

}
