import { Button, TableRow, TableHead, TableContainer, TableCell, TableBody, Table, Select, MenuItem } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import Input from "@mui/material/OutlinedInput";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";
import instance from "../../services/axiosInstance";
import { API } from "../../config/config";
import { toast } from "react-toastify";

interface Stage extends IAssetStage {
	id?: string;
	metric?: number | string | { metric: string};
}

interface SetProgressProps {
	id?: string;
	val?: number | string;
	stageValues?: Stage[];
	setStageValues?: Dispatch<SetStateAction<Stage[]>>;
	key?: string;
}

const updateAssetDetails = (assetId: string, data: { [key: string]: string | number | object; }) => {
	try {
		return instance.put(`${API.PROGRESS_2D_URL}/assets/${assetId}`, data);
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

export default function Metrics({
	stages = [],
	assetId = "",
	metrics = {},
	refetchAssets = ()=>{},
}: {
	stages: Stage[];
	assetId: string;
	metrics: { [key: string]: string | number };
	refetchAssets: () => void,
}) {
	const formatStageData = stages.map((stage) => ({
		...stage,
		metric: metrics[stage._id],
	}));

	const [stageValues, setStageValues] = useState<Stage[]>([
		...(formatStageData || []),
	]);

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
				<TableContainer style={{ maxHeight: 428 }}>
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
											onChange={(val) =>
												setProgress({
													id: row.id,
													val: val.target.value,
													stageValues,
													setStageValues,
													key: 'metric'
												})
											}
										/>
									</TableCell>
									<TableCell
										align="center"
										className="w-1/6 p-0"
									>
										<Select
											id="unit-select"
											labelId="unit-select"
											value={row.uom}
											size="small"
											onChange={(val) =>
												setProgress({
													id: row.id,
													val: val.target.value,
													stageValues,
													setStageValues,
													key: 'uom'
												})}
										>
											<MenuItem value={row.uom}>{row.uom}</MenuItem>
										</Select>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			<div className="mt-4 flex justify-end">
				{stageValues.length > 0 ? (
					<Button
						size="small"
						className="py-2 pl-[7px] pr-[8px] mr-2 rounded-[8px] font-semibold text-white bg-[#F1742E] hover:bg-[#F1742E] disabled:bg-gray-300"
						onClick={() =>
							onSave({
								assetId,
								stageValues,
								setLoading,
								refetchAssets,
							})
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
