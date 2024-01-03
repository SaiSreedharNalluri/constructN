import {
    AddRfi,
    ArrowIcon,
    BodyContainer,
    CustomTaskProcoreLinks,
    HeaderContainer,
    LabelContainer,
    LeftTitleCont,
    SpanCont,
    SpanTile,
} from "../../divami_components/issue_detail/IssueDetailStyles";
import BackArrow from "../../../public/divami_icons/backArrow.svg";
import { TitleContainer } from "../../divami_components/issue_detail/IssueDetailStyles";
import { useEffect, useState } from "react";
import rfiAdd from "../../../public/divami_icons/addButton.svg";
import { HelpCenterOutlined } from "@mui/icons-material";
import LinkNewRFI from "./newRFI/linkNewRfi";
import {costImpact, getcoastCode, getLocation, getReceivedFrom, getResponsibleContractor, getRfiManager, getRfiStage, potentialDistributionMembers, scheduleImpact, specSection} from "../../../services/newRfi";
const ProcoreLink = (props: any) => {
    const {
        handleCloseProcore
    } = props
    const [selectedComponent, setSelectedComponent] = useState<any | null>(null)
    const [rfiManager,setRfiManager] = useState([
        {
            "id": 10,
            "locale": null,
            "login": "sandbox@procore.com",
            "name": "API Support (Procore (Test Companies))"
        },
        {
            "id": 99519,
            "locale": null,
            "login": "implementation+demo@procore.com",
            "name": "API Support (Procore (Test Companies))"
        },
        {
            "id": 125490,
            "locale": null,
            "login": "dagdargh.zobgogog+sandbox@procore.com",
            "name": "dagdargh zobgogog (Dagdargh Zobgogog - 6b89e862-5495-4feb-a431-0c50698caaf4)"
        },
        {
            "id": 100297,
            "locale": null,
            "login": "implementation+sandbox@procore.com",
            "name": "kraboozog nagzedul"
        },
        {
            "id": 100299,
            "locale": null,
            "login": "implementation+arch@procore.com",
            "name": "Test Architect (Architect TEST Company)"
        },
        {
            "id": 100298,
            "locale": null,
            "login": "implementation+sub@procore.com",
            "name": "Test Subcontractor (Subcontracting TEST Company)"
        }
    ])
    const [receivedFrom,setReceivedFrom]=useState([
        {
            "id": 10,
            "locale": null,
            "login": "sandbox@procore.com",
            "name": "API Support (Procore (Test Companies))"
        },
        {
            "id": 99519,
            "locale": null,
            "login": "implementation+demo@procore.com",
            "name": "API Support (Procore (Test Companies))"
        },
        {
            "id": 125490,
            "locale": null,
            "login": "dagdargh.zobgogog+sandbox@procore.com",
            "name": "dagdargh zobgogog (Dagdargh Zobgogog - 6b89e862-5495-4feb-a431-0c50698caaf4)"
        },
        {
            "id": 100297,
            "locale": null,
            "login": "implementation+sandbox@procore.com",
            "name": "kraboozog nagzedul"
        },
        {
            "id": 100299,
            "locale": null,
            "login": "implementation+arch@procore.com",
            "name": "Test Architect (Architect TEST Company)"
        },
        {
            "id": 100298,
            "locale": null,
            "login": "implementation+sub@procore.com",
            "name": "Test Subcontractor (Subcontracting TEST Company)"
        }
    ])
    const [responsibleContractor,setResponsibleContractor] = useState([
        {
            "id": 2821262,
            "name": "Architect TEST Company"
        },
        {
            "id": 2821235,
            "name": "Dagdargh Zobgogog - 6b89e862-5495-4feb-a431-0c50698caaf4"
        },
        {
            "id": 2821239,
            "name": "Procore (Test Companies)"
        },
        {
            "id": 2821261,
            "name": "Subcontracting TEST Company"
        }
    ])
    const[potentialDistMem,setPotentialDistMem] =useState([
        {
            "id": 10,
            "locale": null,
            "login": "sandbox@procore.com",
            "name": "API Support (Procore (Test Companies))"
        },
        {
            "id": 99519,
            "locale": null,
            "login": "implementation+demo@procore.com",
            "name": "API Support (Procore (Test Companies))"
        },
        {
            "id": 125490,
            "locale": null,
            "login": "dagdargh.zobgogog+sandbox@procore.com",
            "name": "dagdargh zobgogog (Dagdargh Zobgogog - 6b89e862-5495-4feb-a431-0c50698caaf4)"
        },
        {
            "id": 100297,
            "locale": null,
            "login": "implementation+sandbox@procore.com",
            "name": "kraboozog nagzedul"
        },
        {
            "id": 100299,
            "locale": null,
            "login": "implementation+arch@procore.com",
            "name": "Test Architect (Architect TEST Company)"
        },
        {
            "id": 100298,
            "locale": null,
            "login": "implementation+sub@procore.com",
            "name": "Test Subcontractor (Subcontracting TEST Company)"
        }
    ])

    const [specSectionn,setspecSection]=useState()
    const [coastCodee,setCoastCodee] =useState([
        {
            "id": 7810415,
            "name": "General Requirements",
            "full_code": "01",
            "origin_id": null,
            "origin_data": null,
            "standard_cost_code_id": null,
            "biller": "Sandbox Test Project",
            "biller_id": 235946,
            "biller_type": "Project",
            "biller_origin_id": null,
            "budgeted": false,
            "code": "01",
            "parent": {
                "id": null
            },
            "sortable_code": "01",
            "created_at": "2023-11-23T05:17:00Z",
            "deleted_at": null,
            "line_item_types": [],
            "position": null,
            "updated_at": "2023-11-23T05:17:00Z"
        },
        {
            "id": 7810432,
            "name": "Purpose",
            "full_code": "01-000",
            "origin_id": null,
            "origin_data": null,
            "standard_cost_code_id": null,
            "biller": "Sandbox Test Project",
            "biller_id": 235946,
            "biller_type": "Project",
            "biller_origin_id": null,
            "budgeted": false,
            "code": "000",
            "parent": {
                "id": 7810415
            },
            "sortable_code": "01-000",
            "created_at": "2023-11-23T05:17:01Z",
            "deleted_at": null,
            "line_item_types": [],
            "position": null,
            "updated_at": "2023-11-23T05:17:01Z"
        },])
    
    const [location,setLocation]=useState([])
    const [rfistage,setrfistage]=useState([
        {
            "id": 1,
            "category": null,
            "is_bidding_stage": true,
            "name": "Bidding",
            "readonly": false
        },
        {
            "id": 2,
            "category": null,
            "is_bidding_stage": false,
            "name": "Pre-Construction",
            "readonly": false
        },
        {
            "id": 3,
            "category": null,
            "is_bidding_stage": false,
            "name": "Course of Construction",
            "readonly": false
        },
        {
            "id": 4,
            "category": null,
            "is_bidding_stage": false,
            "name": "Warranty",
            "readonly": false
        },
        {
            "id": 5,
            "category": null,
            "is_bidding_stage": false,
            "name": "Post-Construction",
            "readonly": false
        }
    ])
    const [scheduleImpactt,setScheduleImpact]=useState([
        {
            "value": "yes_known",
            "name": "Yes"
        },
        {
            "value": "yes_unknown",
            "name": "Yes (Unknown)"
        },
        {
            "value": "no_impact",
            "name": "No"
        },
        {
            "value": "tbd",
            "name": "TBD"
        },
        {
            "value": "n_a",
            "name": "N/A"
        }
    ])
    const [costImpacts,setcostImpact]=useState([
        {
            "value": "yes_known",
            "name": "Yes"
        },
        {
            "value": "yes_unknown",
            "name": "Yes (Unknown)"
        },
        {
            "value": "no_impact",
            "name": "No"
        },
        {
            "value": "tbd",
            "name": "TBD"
        },
        {
            "value": "n_a",
            "name": "N/A"
        }
    ])
    useEffect(()=>{

        const fetchData = async () => {
        try{
        const apiCalls=[getRfiManager(),
            getReceivedFrom(),
            getResponsibleContractor(),
            potentialDistributionMembers(),
        specSection(),
        getLocation(),
        getcoastCode(),
        getRfiStage(),
        scheduleImpact(),
        costImpact(),
        scheduleImpact(),]

        const responses = await Promise.all(apiCalls);

        const dataFromApiCalls = responses.map(response => response.data);

        console.log("dataFrom",dataFromApiCalls)
        }
        
        catch(error){

        };
       
    }

    fetchData()
    },[])



    const handleInstanceClick = (componentType: any) => {
        switch (componentType) {
            case "RFI":
                setSelectedComponent(<LinkNewRFI handleInstance={handleInstanceClick} rfiManager={rfiManager} 
                receivedForm={receivedFrom}
                responsibleContractor={responsibleContractor}
                potentialDistMem={potentialDistMem}
                coastCodee={coastCodee}
                rfistage={rfistage}
                scheduleImpactt={scheduleImpactt}
                costImpacts={costImpacts}
                specSectionn={specSectionn}/>);
                break;
            case "closeNewRFI":
                setSelectedComponent(null)
                break;
            case "New_Observation":

                break;
            case "Summit":

                break;

            default:
                setSelectedComponent(null);
        }
    }

    const [footerState, SetFooterState] = useState(false);

    if (selectedComponent) {
        return selectedComponent
    }

    return (
        <div className="">
            <CustomTaskProcoreLinks>
                <HeaderContainer>
                    <TitleContainer>
                        <LeftTitleCont>
                            <div className="rounded-full p-[6px] hover:bg-[#E7E7E7] ">
                                <ArrowIcon
                                    onClick={() => {
                                        handleCloseProcore()
                                    }}
                                    src={BackArrow}
                                    alt={"close icon"}
                                    data-testid="back-arrow"
                                />
                            </div>
                            <SpanTile data-testid="issue-detail-header">
                                Link to Procore<br></br>
                            </SpanTile>
                        </LeftTitleCont>
                    </TitleContainer>
                </HeaderContainer>
                <BodyContainer footerState={footerState}>
                    <LabelContainer
                        className="cursor-pointer hover:bg-gray-100 "
                        onClick={() => { handleInstanceClick('RFI') }}
                    >
                        <AddRfi className="" src={rfiAdd} alt="Link new RFI"></AddRfi>
                        <SpanCont className="flex justify-center">LINK NEW RFI</SpanCont>
                    </LabelContainer>
                    <LabelContainer className="cursor-pointer hover:bg-gray-100">
                        <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

                        <SpanCont className="flex justify-center">
                            LINK EXISTING RFI
                        </SpanCont>
                    </LabelContainer>
                    <LabelContainer className="cursor-pointer hover:bg-gray-100" onClick={() => { handleInstanceClick('New_Observation') }} >
                        <AddRfi className="" src={rfiAdd} alt="Link new Observation"></AddRfi>
                        <SpanCont className="flex justify-center">
                            LINK NEW OBSERVATION
                        </SpanCont>
                    </LabelContainer>
                    <LabelContainer className="cursor-pointer hover:bg-gray-100">
                        <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

                        <SpanCont className="flex justify-center">
                            LINK EXISTING OBSERVATION
                        </SpanCont>
                    </LabelContainer>
                    <LabelContainer className="cursor-pointer hover:bg-gray-100">
                        <AddRfi className="" src={rfiAdd} alt="Link new RFI"></AddRfi>
                        <SpanCont className="flex justify-center">
                            LINK NEW SUBMITTAL
                        </SpanCont>
                    </LabelContainer>
                    <LabelContainer className="cursor-pointer hover:bg-gray-100">
                        <HelpCenterOutlined className="ml-45 mt-6"></HelpCenterOutlined>

                        <SpanCont className="flex justify-center">
                            LINK EXISTING SUBMITTAL
                        </SpanCont>
                    </LabelContainer>
                </BodyContainer>
            </CustomTaskProcoreLinks>
        </div>
    );
};

export default ProcoreLink;