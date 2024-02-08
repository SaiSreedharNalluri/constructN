import React, { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import { Button } from "@mui/material";
import { useRouter } from "next/router";
import instance from "../../services/axiosInstance";
import { API, PROCORE } from "../../config/config";
import authHeader from "../../services/auth-header";
import procoreinstance from "../../services/procoreInstance";
import { CustomToast } from "../divami_components/custom-toaster/CustomToast";
import { updateProjectInfo } from "../../services/project";
import { ProjectData } from "../../state/appState/state";
import { IProjects } from "../../models/IProjects";

const getProjects = ({
	setProjectsList,
	companyId,
	setProjectsLoading,
}: {
	setProjectsList: React.Dispatch<React.SetStateAction<[] | {
		id: string;
		name: string;
	}[]>>;
	companyId: string;
	setProjectsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	setProjectsLoading(true);
	instance
		.get(`${API.BASE_URL}/users/profile?procore=true`, {
			headers: authHeader.authHeader(),
		})
		.then((response) => {
			procoreinstance
				.get(
					`${PROCORE.SANDBOX_URL}//rest/v1.0/companies/${companyId}/projects`,
					{
						headers: {
							Authorization:
								"Bearer " +
								response?.data?.result?.metadata?.procore
									?.accessToken,
						},
					}
				)
				.then((response) => {
					setProjectsList(response?.data);
					if(!response?.data.length){
						CustomToast("No Projects Found!", "error");
					}
				})
				.catch(() => {
					CustomToast("Failed to fetch projects", "error");
				});
			return response.data;
		})
		.catch(() => {
			CustomToast("Failed to fetch user", "error");
		})
		.finally(() => setProjectsLoading(false));
};

const getCompanies = ({
	setCompanyList,
	setCompaniesLoading
}: {
	setCompanyList: React.Dispatch<React.SetStateAction<never[]>>;
	setCompaniesLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
	setCompaniesLoading(true);
	instance
		.get(`${API.BASE_URL}/users/profile?procore=true`, {
			headers: authHeader.authHeader(),
		})
		.then((response) => {
			procoreinstance
				.get(`${PROCORE.SANDBOX_URL}//rest/v1.0/companies`, {
					headers: {
						Authorization:
							"Bearer " +
							response?.data?.result?.metadata?.procore
								?.accessToken,
					},
				})
				.then((response) => {
					setCompanyList(response?.data);
					if(!response?.data.length){
						CustomToast("No Companies Found!", "error");
					}
				})
				.catch(() => {
					CustomToast("Failed to fetch companies", "error");
				});
			return response.data;
		})
		.catch(() => {
			CustomToast("Failed to fetch user", "error");
		}).finally(()=>{setCompaniesLoading(false)});
};

interface Props { 
	setShowLink?: React.Dispatch<React.SetStateAction<boolean>>; 
	refetchProject?: () => void 
}

const LinktoProcore = ({ setShowLink = () => {}, refetchProject = () => {} }: Props ) => {
	const [projectsList, setProjectsList] = useState<{ id: string; name: string }[] | []>([]);

	const [companyList, setCompanyList] = useState([]);

	const [company, setCompany] = useState("");

	const [project, setProject] = useState("");

	const [companiesLoading, setCompaniesLoading] = useState(false);

	const [projectsLoading, setProjectsLoading] = useState(false);
    
    const [providerType, setProviderType] = useState('');

	const router = useRouter();

	const projectDetail= projectsList?.find((proj: { id: string; name: string })=>(proj.id===project));

    useEffect(() => {
        const userCredentials = localStorage.getItem('userCredentials');
        const creds = JSON.parse(userCredentials || "{}");
        setProviderType(creds?.provider);
        if(creds?.provider === 'procore'){
            getCompanies({ setCompanyList, setCompaniesLoading });
        }
        }, []);

        useEffect(()=>{
            if(company && providerType === 'procore'){
                getProjects({ setProjectsList, companyId: company , setProjectsLoading});
        }
        },[company, providerType])

	return (
		<div className="absolute top-[0px] shadow-md right-0 z-10 bg-[#F3F3F3] border-b mx-0.5 border-[#F3F3F3] pb-4">
			<div className="flex px-4 py-2 text-lg w-[30vw] justify-between border-b-[0.5px] border-[#666]">
				Link Project to Procore{" "}
				<CloseIcon
					className="cursor-pointer"
					onClick={() => setShowLink(false)}
				/>
			</div>
			<div className="px-6 py-2 pt-6">
				<div className="text-[#4D5154] mb-1">Select Company</div>
				<div>
					<Box sx={{ minWidth: 120 }}>
						<FormControl fullWidth>
							<InputLabel>
								{companiesLoading ? "Loading..." : ""}
							</InputLabel>
							<Select
								labelId="select-company"
								id="select-company"
								value={company}
								placeholder={
									companiesLoading ? "Loading..." : ""
								}
								label={
									companiesLoading ? "Loading..." : ""
								}
								onChange={(e) => {
									setCompany(e.target.value);
									setProject("");
									setProjectsList([]);
								}}
							>
								{companyList.length ? companyList.map(
									(company: { id: string; name: string }) => (
										<MenuItem
											key={company.id}
											value={company.id}
										>
											{company.name}
										</MenuItem>
									)
								): <MenuItem
								disabled
							>
								{companiesLoading ? "Loading...": "No Companies Found!"}
							</MenuItem>}
							</Select>
						</FormControl>
					</Box>
				</div>
			</div>
			{company ? (
				<>
					<div className="px-6 py-2 pt-0">
						<div className="text-[#4D5154] mb-1">
							Select Project
						</div>
						<div>
							<Box sx={{ minWidth: 120 }}>
								<FormControl fullWidth>
									<InputLabel>
										{projectsLoading ? "Loading..." : ""}
									</InputLabel>
									<Select
										labelId="select-project"
										id="select-project"
										value={project}
										disabled={projectsLoading}
										placeholder={
											projectsLoading ? "Loading..." : ""
										}
										label={
											projectsLoading ? "Loading..." : ""
										}
										onChange={(e) =>
											setProject(e.target.value)
										}
									>
										{(projectsList.length) ? projectsList.map(
											(project: {
												id: string;
												name: string;
											}) => (
												<MenuItem
													key={project.id}
													value={project.id}
												>
													{project.name}
												</MenuItem>
											)
										): <MenuItem
										disabled
									>
										{projectsLoading ? "Loading...": "No Projects Found!"}
									</MenuItem>}
									</Select>
								</FormControl>
							</Box>
						</div>
						{project ? (
							<div className="flex justify-center py-10 pb-0">
								<Button
									className="bg-[#F1742E] cursor-pointer normal-case hover:bg-[#F1742E] text-[#fff] font-sans"
									onClick={async () => {
										const resp = await updateProjectInfo(
											{
												metaDetails: {
													procore: {
														projectId: project,
														companyId: company,
														name: projectDetail?.name
													},
												},
											},
											router.query.projectId as string
										);
										CustomToast("Project Linked Successfull!","success")
										refetchProject();
										setShowLink(false);
									}}
								>
									Link
								</Button>
							</div>
						) : null}
					</div>
				</>
			) : null}
		</div>
	);
};

export default LinktoProcore;
