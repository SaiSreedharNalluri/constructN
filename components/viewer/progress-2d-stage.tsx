

import { FormControlLabel, Checkbox, LinearProgress, Divider } from '@mui/material'

import { IAssetStage } from '../../models/IAssetCategory'

export default function Progress2DStage({ stage }: { stage: IAssetStage }) {

    return (<>

        <div className='px-2 py-4' style={{ border: '1px solid #e2e3e5', borderRadius: '6px' }}>

            <FormControlLabel control={<Checkbox defaultChecked />} label={stage.name} />

            <LinearProgress variant="determinate" value={60} />

            <Divider orientation="horizontal" variant="middle" flexItem />

        </div>

    </>)
}