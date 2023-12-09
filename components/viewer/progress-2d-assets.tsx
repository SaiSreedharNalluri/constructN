import {
	Table,
	TableContainer,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	OutlinedInput,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import moment from "moment";
import { publish } from "../../services/light-box-service";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";

interface Props{
	assets: IAsset[];
	stages?: ({ assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean })[];
	stageMap?: { [key: string]: { assets: Partial<IAsset>[]; assetsCompare: Partial<IAsset>[]; } & Partial<IAssetStage> & { visible: boolean; }; } | [];
}

const Progress2dAssets = ({
	assets = [],
	stages=[],
	stageMap=[],
}: Props) => {

	const [search, setSearch] = useState('')

	const filteredAssets = assets.filter((asset)=>(asset.name?.toLowerCase()?.includes(search?.toLowerCase()) || (asset?.progress?.stage as IAssetStage)?.name?.toLowerCase()?.includes(search?.toLowerCase())))

	return (
		<div className="mt-4 m-2">
			<div className="flex justify-end mr-4">
				<OutlinedInput className="mb-2" size="small" placeholder="Search" onChange={(e)=> setSearch(e.target.value)}/>
			</div>
			<TableContainer style={{ maxHeight: 400 }}>
				<Table aria-label="table" stickyHeader>
					<TableHead>
						<TableRow>
							<TableCell className="w-1/3 pl-2">Name</TableCell>
							<TableCell className="w-1/4 p-0">Stage</TableCell>
							<TableCell className="w-1/3">UpdatedAt</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{(filteredAssets || []).map((row) => (
							<TableRow
								key={row._id}
								onClick={() => {
									stages.forEach((stage) => {
										if (
											stage._id ===
											(row?.progress?.stage as IAssetStage)?._id
										) {
											stage.visible = true;
										} else {
											stage.visible = false;
										}
									});
									publish("visibility-change", {
										assets: assets,
										stageMap,
									});
									publish('select-2d-shape', row._id)
								}}
								className=" hover:bg-[#f2f2f2] cursor-pointer"
							>
								<TableCell
									component="th"
									scope="row"
									className="w-1/3 pl-2"
								>
									{row.name || "-"}
								</TableCell>
								<TableCell className="w-1/4 p-0">
									{(row?.progress?.stage as IAssetStage)?.name || "-"}
								</TableCell>
								<TableCell className="w-1/3">
									{moment(new Date(row.updatedAt)).format(
										"DD MMM, yyyy HH:mm"
									) || "-"}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
		</div>
	);
};

export default Progress2dAssets;
