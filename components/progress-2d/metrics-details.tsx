import { Button, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Select, MenuItem, styled, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Input from "@mui/material/OutlinedInput";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";
import instance from "../../services/axiosInstance";
import { API } from "../../config/config";
import authHeader from "../../services/auth-header";

const headers = {headers: authHeader.authHeader()}
import { Checkbox } from "@mui/material";
import PopupComponent from "../popupComponent/PopupComponent";
import { CustomToast } from "../divami_components/custom-toaster/CustomToast";

interface Stage extends IAssetStage {
	id?: string;
	measurementFactor?: number;
}

interface SetProgressProps {
	id?: string;
	val?: number | string;
	stageValues?: Stage[];
	setStageValues?: Dispatch<SetStateAction<Stage[]>>;
	key?: string;
}

const updateAssetDetails = (assetId: string, data: { [key: string]: string | number | object | undefined; }) => {
	try {
		return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}`, data, headers);
	} catch (error) {
		throw error;
	}
};

const setProgress = ({
	id = "",
	val = 0,
	stageValues = [],
	setStageValues = () => {},
	key = ''
}: SetProgressProps) => {
	const index = stageValues.findIndex((stage) => stage.id === id);

	setStageValues(() => {
		stageValues[index] = { ...(stageValues[index] || {}), [key]: val };
		return [...(stageValues || [])];
	});
};

const onStatusToggle = async ({assetId ='', status, setLoading, refetchAssets }: { assetId: string , status: string, setLoading: Dispatch<SetStateAction<boolean>>, refetchAssets: () => void }) =>{
	try {
		setLoading(true);
		await updateAssetDetails(assetId, {status: status });
		CustomToast('Status Updated successfully!', 'success');
		refetchAssets();
	}catch{
		CustomToast('Status Updated Failed!', 'error');
	}finally{
		setLoading(false);
	}
}

export default function Metrics({
	stages = [],
	assetId = "",
	metrics = {},
	refetchAssets = ()=>{},
	asset,
	onChange,
	assetWidth,
	assetHeight,
	conversionUnits,
	selectedData,
	setValues,
	values,
	onSave
}: {
	stages: Stage[];
	assetId: string;
	metrics?: { [key: string]: { measurementFactor: number; }; } | { [key: string]: string | number | { metric: string} | { metric: { metric: string }} };
	refetchAssets: () => void,
	asset: IAsset,
	onChange?: (asset: IAsset) => void,
	assetWidth?: number,
	assetHeight?: number,
	selectedData?: any,
	conversionUnits: number,
	values: {
        name: string;
        description: string;
        stage: string;
        height?: number;
        width?: number;
        metrics?: { [key: string]: { measurementFactor: number; }; } | { [key: string]: string | number | { metric: string} | { metric: { metric: string }} }
	},
	setValues: Dispatch<SetStateAction<{
        name: string;
        description: string;
        stage: string;
        height?: number;
        width?: number;
        metrics?: { [key: string]: { measurementFactor: number; }; } | { [key: string]: string | number | { metric: string} | { metric: { metric: string }} };
    }>>,
	onSave: ()=>void;
}) {
	const formatStageData = stages.map((stage) => ({
		...stage,
		measurementFactor: +(metrics[stage._id] as { measurementFactor: number })?.measurementFactor || 1
	}));

	const [stageValues, setStageValues] = useState<Stage[]>([
		...(formatStageData || []),
	]);

	useEffect(()=>{
		const metricValues: { [key: string]: { measurementFactor: number; }; } = {};
		stageValues.forEach((stage) => {
		const stageID = stage._id;
		if(stageID){
			metricValues[stageID] = { measurementFactor: +(stage.measurementFactor || 1) };
		}
		});
		setValues({...values, metrics: metricValues})
	},[stageValues])

	const length = (selectedData.getLength() * conversionUnits)?.toFixed(2)


	const getMetric =(type: string)=>{
		if(type === 'Count'){
			return(1)
		}
		if(type === 'L'){
			return(+length)
		}
		if(type === 'LxH'){
			return(+(+(+length * conversionUnits)?.toFixed(2)* ((asset?.height || assetHeight) ?? 1)).toFixed(2))
		}
		if(type === 'A'){
			return(+(selectedData.getArea ? selectedData.getArea(): 0 * conversionUnits)?.toFixed(2))
		}
		if(type === 'LxHxW'){
			return(+(+length* (assetHeight ?? 1) * (assetWidth ?? 1))?.toFixed(2))
		}
		if(type === 'AxH'){
			return(+(selectedData.getArea ? selectedData.getArea(): 0 * conversionUnits)?.toFixed(2)* (assetHeight ?? 1))
		}
		return 1;
	}

	const [showConfirmation, setShowConfirmation] = useState('');

	const [loading, setLoading] = useState(false);

	return (
		<div className="mt-4">
			{loading ? (
				[...Array(7)].map((it) => (
					<div className="animate-pulse rounded-md" key={it}>
						<div className="h-[2.25rem] mt-2 bg-slate-200 rounded"></div>
					</div>
				))
			) : (
				<TableContainer>
					<Table aria-label="table" stickyHeader>
						<TableHead>
							<TableRow>
								<TableCell className="w-1/2 pl-2">
									Stage
								</TableCell>
								<TableCell className="w-1/3 p-0">
									Value
								</TableCell>
								<TableCell className="w-1/6">Units</TableCell>
								<TableCell className=" w-1/4">Factor</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{(stageValues || []).map((row) => (
								<TableRow key={row._id}>
									<TableCell
										component="th"
										scope="row"
										className="w-1/2 pl-2"
									>
										{row.name}
									</TableCell>
									<TableCell
										align="left"
										className="w-1/3 p-0"
									>
										{getMetric(row.measurement)* (row.measurementFactor || 1)}
									</TableCell>
									<TableCell
										align="center"
										className="w-1/6 p-0"
									>
										{row.uom}
									</TableCell>
									<TableCell
										align="center"
										className="w-1/6 p-0"
									>
										<Input
											value={row.measurementFactor}
											size="small"
											type="number"
											sx={{ width:"60px", ".MuiInputBase-inputSizeSmall":{
												padding:'8px',
												fontSize:'12px'
											} }}
											disabled={loading}
											inputProps={{
												step: "1"
											}}
											onChange={(val) =>{
												setProgress({
													id: row.id,
													val: +val.target.value < 0 ? +val.target.value * -1: val.target.value,
													stageValues,
													setStageValues,
													key: 'measurementFactor'
												});
											}
											}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{showConfirmation ? <PopupComponent
			open={!!showConfirmation}
        	setShowPopUp={setShowConfirmation}
        	modalTitle={"Confirmation"}
			modalmessage={<div className="ml-2">Are you want to make this Asset <span className="font-semibold text-[#F1742E]">{asset.status ==='Active' ? 'InActive': 'Active'}</span> ?</div>}
        	primaryButtonLabel={"Confirm"}
        	SecondaryButtonlabel={"Cancel"}
        	callBackvalue={async ()=>{
				await onStatusToggle({ assetId, status: asset.status ==='Active'? 'Inactive': 'Active', setLoading , refetchAssets });
				onChange && onChange(asset);
			}}
        	/>: null}
			<div className="mt-4 flex justify-between">
				<div>
					<Checkbox sx={{
						'&.Mui-checked': {
						color: '#F1742E',
						},
					}} 
					checked={asset.status === 'Active'}  onChange={() => setShowConfirmation(asset.status !== 'Active' ? 'Active': 'InActive')} />
						<span className="font-semibold pt-1" >Active</span>
				</div>
				<Button 
                    size='small'  
                    className='py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white bg-[#F1742E] hover:bg-[#F1742E] disabled:bg-gray-300'
                    onClick={onSave}
                    >
                        Save
                    </Button>
			</div>
		</div>
	);
}
