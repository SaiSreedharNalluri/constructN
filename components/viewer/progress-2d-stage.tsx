

import { FormControlLabel, Checkbox, LinearProgress, Divider, FormGroup, Stack, styled, linearProgressClasses, Typography } from '@mui/material'

import { IAssetStage } from '../../models/IAssetCategory'

export default function Progress2DStage({ stage, assetCount }: { stage: Partial<IAssetStage> & {assets: string[]}, assetCount: number }) {

    return (<>

        <div className='p-4 mt-3 select-none' style={{ border: '1px solid #e2e3e5', borderRadius: '6px' }}>

            <FormGroup>

                <FormControlLabel

                    className='text-[#4a4a4a]'

                    control={<Checkbox size='small' defaultChecked

                        sx={{

                            color: stage.color,

                            '&.Mui-checked': {

                                color: stage.color,
                                
                            }

                        }} />}

                    color={stage.color} label={<Typography fontSize={15} variant='caption'>{stage.name}</Typography>} />

            </FormGroup>

            <Stack sx={{ color: stage.color, marginTop: '0.5rem' }} direction="row">

                <BorderLinearProgress className='w-full' color="inherit" variant="determinate" value={60} />

            </Stack>

            <div className='w-full flex justify-between mt-2'>

                <Typography className='text-sm text-[#727375]'>{stage.assets.length == 0 ? 0 : (stage.assets.length * 100 / assetCount).toFixed(1)}%</Typography>

                <Typography className='text-sm text-[#727375]'>123/560 {stage.uom}</Typography>

            </div>

            {/* <Divider orientation="horizontal" className='m-2' variant="middle" flexItem /> */}

        </div>

    </>)
}

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({

    height: 6,

    borderRadius: 3,

    [`&.${linearProgressClasses.colorPrimary}`]: {

        backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],

    },

    [`& .${linearProgressClasses.bar}`]: {

        borderRadius: 3,
    },

}))