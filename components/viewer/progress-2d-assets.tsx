import { OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import { publish } from "../../services/light-box-service";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";

interface Props {
	assets: IAsset[];
}

const Progress2dAssets = ({
	assets = [],
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
					publish('select-shape', row?._id)
				}}
			>
				<div className="text-[12px]"> {row.name || "-"}</div>
				<div className="text-[11px] mt-[4px] font-semibold text-[#999999]">
					{(row?.progress?.stage as IAssetStage)?.name || "-"}
				</div>
				<div className="flex justify-between">
					<div className="text-[11px] mt-[2px] text-[#ccc]">
						{moment(new Date(row.updatedAt)).format(
							"DD MMM, yyyy HH:mm"
						) || "-"}
					</div>
					<div className="text-[11px] mt-[2px] text-[#ccc] mr-2">
						{row.status}
					</div>
				</div>
			</div>
		);
	};

	return (
		<div className="m-2 mt-2 bg-white">
			<div className="sticky top-[0px] bg-white pt-4">
				<OutlinedInput
				className="mb-2"
				size="small"
				placeholder="Search"
				onChange={(e) => setSearch(e.target.value)}
				fullWidth
				/>
			</div>
			{(filteredAssets || []).map((row) => (
				<SingleCard row={row} key={row._id} />
			))}
		</div>
	);
};

export default Progress2dAssets;
