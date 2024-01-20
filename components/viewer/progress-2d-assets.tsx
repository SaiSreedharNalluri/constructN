import { Button, Checkbox, OutlinedInput } from "@mui/material";
import React, { useState } from "react";
import moment from "moment";
import { publish } from "../../services/light-box-service";
import { IAsset, IAssetStage } from "../../models/IAssetCategory";
import { getCookie } from "cookies-next";

interface Props {
	assets: IAsset[];
}

const Progress2dAssets = ({
	assets = [],
}: Props) => {

	const userObj: any = getCookie("user");
	const user = JSON.parse(userObj || "{}");
	const [search, setSearch] = useState("");
	const [showInActiveAssets, setShowInActiveAssets] = useState(false);

	const inActiveAssets = showInActiveAssets ? assets.filter((asset)=>(asset.status === 'Inactive')): assets

	const filteredAssets = inActiveAssets.filter(
		(asset) =>
			asset.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
			(asset?.progress?.stage as IAssetStage)?.name
				?.toLowerCase()
				?.includes(search?.toLowerCase())
	);

	const SingleCard = ({ row, isSupportUser }: { row: IAsset; isSupportUser: boolean }) => {
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
					{isSupportUser && <div className="text-[11px] mt-[2px] text-[#ccc] mr-2">
						{row.status}
					</div>}
				</div>
			</div>
		);
	};

	return (
		<div className="m-2 mt-0 bg-white">
			<div className="pt-4 mb-2 sticky top-0 bg-white z-10 flex justify-between">
				<div className={`${user?.isSupportUser ? 'w-[calc(70%-30px)]': 'w-full'}`}>
					<OutlinedInput
					className="mb-2"
					size="small"
					placeholder="Search"
					onChange={(e) => setSearch(e.target.value)}
					fullWidth
					/>
				</div>
				{user?.isSupportUser && <div>
					<Checkbox sx={{
						'&.Mui-checked': {
						color: '#F1742E',
						},
						'&.MuiButtonBase-root':{
							padding:'10px 2px'
						}
					}} checked={showInActiveAssets}  onChange={(e) => setShowInActiveAssets(e.target.checked) } />
						<span className="text-[12px] mr-1" >Show InActive</span>
				</div>}
			</div>
			{(filteredAssets || []).map((row) => (
				<SingleCard row={row} key={row._id} isSupportUser={user?.isSupportUser}/>
			))}
		</div>
	);
};

export default Progress2dAssets;
