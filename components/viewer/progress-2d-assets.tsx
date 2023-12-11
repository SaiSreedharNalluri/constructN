import { OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import { publish } from "../../services/light-box-service";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";

interface Props {
	assets: IAsset[];
	stages?: ({
		assets: Partial<IAsset>[];
		assetsCompare: Partial<IAsset>[];
	} & Partial<IAssetStage> & { visible: boolean })[];
	stageMap?:
		| {
				[key: string]: {
					assets: Partial<IAsset>[];
					assetsCompare: Partial<IAsset>[];
				} & Partial<IAssetStage> & { visible: boolean };
		  }
		| [];
}

const Progress2dAssets = ({
	assets = [],
	stages = [],
	stageMap = [],
}: Props) => {
	const [search, setSearch] = useState("");

	const filteredAssets = assets.filter(
		(asset) =>
			asset.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
			(asset?.progress?.stage as IAssetStage)?.name
				?.toLowerCase()
				?.includes(search?.toLowerCase())
	);

	const SingleCard = ({ row }: { row: IAsset }) => {
		return (
			<div
				className="p-[8px] border border-[#E2E3E5] rounded-[6px] mt-2 hover:bg-[#f2f2f2] cursor-pointer"
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
					publish("select-2d-shape", row._id);
					publish("visibility-change", {
						assets: assets,
						stageMap,
						assetId: row._id,
					});
				}}
			>
				<div className="text-[12px]"> {row.name || "-"}</div>
				<div className="text-[11px] mt-[4px] font-semibold text-[#999999]">
					{(row?.progress?.stage as IAssetStage)?.name || "-"}
				</div>
				<div className="text-[11px] mt-[2px] text-[#ccc]">
					{moment(new Date(row.updatedAt)).format(
						"DD MMM, yyyy HH:mm"
					) || "-"}
				</div>
			</div>
		);
	};

	return (
		<div className="mt-4 m-2">
			<OutlinedInput
				className="mb-2"
				size="small"
				placeholder="Search"
				onChange={(e) => setSearch(e.target.value)}
				fullWidth
			/>
			<div className="max-h-96 overflow-auto">
				{(filteredAssets || []).map((row) => (
					<SingleCard row={row} key={row._id} />
				))}
			</div>
		</div>
	);
};

export default Progress2dAssets;
