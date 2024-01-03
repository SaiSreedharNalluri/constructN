import axios from "axios";
import instance from "./axiosInstance";
const refreshtoken={Authorization: "Bearer " + "eyJhbGciOiJFUzUxMiJ9.eyJhbXIiOltdLCJhaWQiOiI1MWNhN2RkY2UwYTA1NGY2Y2QxMzE3ZDI4OTBhMTkzNWJkYTBjMDdhYWYxMDg0N2EyMTZmYTkxM2Y3NzdmOGZhIiwiYW91aWQiOm51bGwsImFvdXVpZCI6bnVsbCwiZXhwIjoxNzAzODU5MTkzLCJzaWF0IjoxNzAzODMyNjcxLCJ1aWQiOjEyNTQ0OSwidXVpZCI6ImZjNGRmZTlkLWFmMTgtNGU4Ni1iMTE0LTIxOTFkMTgxNjRkMSIsImxhc3RfbWZhX2NoZWNrIjoxNzAzODUzNzkzfQ.AXmwoCJUbbQFiWUvaS0CElXzXpX80wvtFNJFSYmdOC1CrUGStWTcUQIGj6p6hKKMUixnB_HaNJ6a9BuKM1fBbxyfAWuTJY_j7vdeILcirAvz9qXtcVb-me6GfDlWrL-Dfyvb9Tvsh7TJQStqA1Tt-Jjk1_UMB0IYa7dUIyMLo9mly4tf"}
export const getRfiManager = () =>{
   return axios.get(
    `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_rfi_managers`,
    {
    headers: refreshtoken
    }
    
   )
   .then((response)=>{
    return response.data;
   })
   .catch((error)=>{
    throw error.response.data
   })
}

export const getReceivedFrom = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_received_froms`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}

export const getResponsibleContractor = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_responsible_contractors`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}

export const potentialDistributionMembers = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_distribution_members`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}
export const specSection = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.0/specification_sections?project_id=235946`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}

export const getLocation = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.0/projects/235946/locations`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}
export const getcoastCode = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.0/cost_codes?project_id=235946`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}
export const getRfiStage = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.0/companies/4272096/project_stages?project_id=235946`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}


export const costImpact = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_cost_impacts`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}

export const scheduleImpact = () =>{
    return axios.get(
        `https://sandbox.procore.com/rest/v1.1/projects/235946/rfis/potential_schedule_impacts`,
        {
        headers:refreshtoken
        }
    )
    .then((response)=>{
        return response.data;
       })
    .catch((error)=>{
    throw error.response.data
    })
}

export const createRfi = (formData:any) =>{
    return axios.post(`https://sandbox.procore.com/rest/v1.1/projects/235946/rfis`,formData,
    {
        headers:refreshtoken
     }
    )
    .then((response)=>{
        console.log("create response",response)
        return response;
        })
    .catch((error)=>{
        console.log("errror response",error)
    throw error.response;
    })
}
