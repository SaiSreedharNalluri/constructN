import { Button, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Select, MenuItem, styled, Tooltip } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Input from "@mui/material/OutlinedInput";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";
import instance from "../../services/axiosInstance";
import { API } from "../../config/config";
import { toast } from "react-toastify";
import authHeader from "../../services/auth-header";

const headers = {headers: authHeader.authHeader()}
import { Checkbox } from "@mui/material";
import PopupComponent from "../popupComponent/PopupComponent";
import { CustomToast } from "../divami_components/custom-toaster/CustomToast";

interface Stage extends IAssetStage {
	id?: string;
	metric?: number | string | { metric: string | number};
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

const onSave = async ({
	assetId = "",
	stageValues = [],
	setLoading = () => {},
	refetchAssets = () => {}
}: {
	assetId: string;
	stageValues?: Stage[];
	setLoading: Dispatch<SetStateAction<boolean>>;
	refetchAssets: ()=> void;
}) => {
	const metricValues: { [key: string]: string | number | object } = {};
	stageValues.forEach((stage) => {
		const stageID = stage._id;

		if (stageID && (stage.metric as { metric: string; })?.metric) {
			metricValues[stageID] = { metric: (stage.metric as { metric: string; })?.metric, uom: stage.uom };
		}

		if(stageID && stage.metric && !(stage.metric as { metric: string; })?.metric){
			metricValues[stageID] = { metric: stage.metric, uom: stage.uom };
		}
	});

	try {
		setLoading(true);
		await updateAssetDetails(assetId, { metrics: metricValues });
		toast.success("Updated asset metrics successfully!", {
			autoClose: 5000,
		});
		refetchAssets()
	} catch {
		toast.error("Failed to update asset metrics!", { autoClose: 5000 });
	} finally {
		setLoading(false);
	}
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
}: {
	stages: Stage[];
	assetId: string;
	metrics: { [key: string]: string | number | { metric: string | number } };
	refetchAssets: () => void,
	asset: IAsset,
	onChange?: (asset: IAsset) => void,
}) {
	const formatStageData = stages.map((stage) => ({
		...stage,
		metric: metrics[stage._id],
	}));

	const [stageValues, setStageValues] = useState<Stage[]>([
		...(formatStageData || []),
	]);

	const [showConfirmation, setShowConfirmation] = useState('');

	const [loading, setLoading] = useState(false);

	let activeDisabled = false;

	formatStageData.forEach((stage)=>{
		if(!(stage.metric as { metric: string })?.metric && +(stage.metric as { metric: number })?.metric !== 0){
			activeDisabled = true;
			return;
		}
	})

	return (
		<div className="mt-4">
			{loading ? (
				[...Array(7)].map((it) => (
					<div className="animate-pulse rounded-md" key={it}>
						<div className="h-[2.25rem] mt-2 bg-slate-200 rounded"></div>
					</div>
				))
			) : (
				<TableContainer style={{ maxHeight: 324 }}>
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
										align="right"
										className="w-1/3 p-0"
									>
										{" "}
										<Input
											value={(row.metric as { metric: string; })?.metric || row.metric}
											size="small"
											type="number"
											disabled={loading}
											onChange={(val) =>{
												setProgress({
													id: row.id,
													val: +val.target.value < 0 ? +val.target.value * -1: val.target.value,
													stageValues,
													setStageValues,
													key: 'metric'
												});
											}
											}
										/>
									</TableCell>
									<TableCell
										align="center"
										className="w-1/6 p-0"
									>
										{row.uom}
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
				await onStatusToggle({ assetId, status: asset.status ==='Active'? 'InActive': 'Active', setLoading , refetchAssets });
				onChange && onChange(asset);
			}}
        	/>: null}
			<div className="mt-4 flex justify-between">
				{activeDisabled ?<Tooltip title='Fill all the metrics and save to enable this'>
				<div>
					<Checkbox sx={{
						'&.Mui-checked': {
						color: '#F1742E',
						},
					}} 
					disabled={activeDisabled}
					checked={asset.status === 'Active'}  onChange={() => setShowConfirmation(asset.status !== 'Active' ? 'Active': 'InActive')} />
						<span className="font-semibold pt-1" >Active</span>
				</div>
				</Tooltip>: <div>
					<Checkbox sx={{
						'&.Mui-checked': {
						color: '#F1742E',
						},
					}} 
					checked={asset.status === 'Active'}  onChange={() => setShowConfirmation(asset.status !== 'Active' ? 'Active': 'InActive')} />
						<span className="font-semibold pt-1" >Active</span>
				</div>}
				{stageValues.length > 0 ? (
					<Button
						size="small"
						className="py-2 pl-[7px] pr-[8px] mr-2 rounded-[8px] font-semibold text-white bg-[#F1742E] hover:bg-[#F1742E] disabled:bg-gray-300"
						onClick={async () =>{
							await onSave({
								assetId,
								stageValues,
								setLoading,
								refetchAssets,
							});
							onChange && onChange(asset);
						}
						}
						disabled={loading}
					>
						Save
					</Button>
				) : null}
			</div>
		</div>
	);
}
