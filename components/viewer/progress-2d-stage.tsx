

import { FormControlLabel, Checkbox, LinearProgress, FormGroup, Stack, styled, linearProgressClasses, Typography, Slider } from '@mui/material'

import { IAsset, IAssetStage } from '../../models/IAssetCategory'

export default function Progress2DStages(

    { stages, assetCount, onToggleVisibility }:

        {
            stages: ({ assets: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean })[] | undefined, assetCount: number,

            onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void

        }) {

    return (

        <>

            {stages?.map(stage => (stage as IAssetStage).sequence > 0 &&

                <Progress2DStage

                    key={stage._id} assetCount={assetCount} stage={stage}

                    onToggleVisibility={onToggleVisibility} />)

            }

        </>
    )

}

function Progress2DStage(

    { stage, assetCount, onToggleVisibility }: {

        stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }, assetCount: number, 
        
        onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void

    }) {

    const getProgress = () => {

        console.log(stage.assets, assetCount, '++++', stage.assets.length == 0 ? 0 : (stage.assets.length * 100 / assetCount))

        return stage.assets.length == 0 ? 0 : (stage.assets.length * 100 / assetCount)
    }

    const onVisibilityChange = (event: any) => {

        const value = event.target.checked

        stage.visible = value

        onToggleVisibility(stage!)

    }

    return (<>

        <div className='p-4 mt-3 select-none' style={{ border: '1px solid #e2e3e5', borderRadius: '6px' }}>

            <FormGroup>

                <FormControlLabel

                    className='text-[#4a4a4a]' onChange={onVisibilityChange}

                    control={<Checkbox size='small' checked={stage.visible}

                        sx={{

                            color: stage.color,

                            '&.Mui-checked': {

                                color: stage.color,

                            }

                        }} />}

                    color={stage.color} label={<Typography className='mt-[-2px]' 
                    
                    fontFamily='Open Sans' fontSize={15} variant='caption'>{stage.name}</Typography>} />

            </FormGroup>

            <Stack sx={{ color: stage.color, marginTop: '0.5rem' }} direction='row'>

                <BorderLinearProgress className='w-full' color='inherit' variant='determinate' value={getProgress()} />

                {/* <RangeLinearProgress customColor={stage.color!} className='w-full' valueLabelDisplay='on' value={getProgress()} /> */}

            </Stack>

            <div className='w-full flex justify-between mt-2'>

                <Typography fontFamily='Open Sans' className='text-sm text-[#727375]'>{getProgress().toFixed(1)}%</Typography>

                <Typography fontFamily='Open Sans' className='text-sm text-[#727375]'>123/560 {stage.uom}</Typography>

            </div>

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

const RangeLinearProgress = styled(Slider)<{ customColor: string }>({

    color: 'inherit',
    
    height: 8,
    
    '& .MuiSlider-track': {
    
        border: 'none'
    
    },
    
    '& .MuiSlider-thumb': {
    
        height: 8,
    
        width: 8,
    
        backgroundColor: '#fff',
    
        border: '2px solid currentColor',
    
        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
    
            boxShadow: 'inherit'
    
        },
    
        '&:before': {
    
            display: 'none'
    
        }
    
    },
    
    '& .MuiSlider-valueLabel': {
    
        lineHeight: 1.2,
    
        fontSize: 12,
    
        background: 'unset',
    
        padding: 0,
    
        width: 32,
    
        height: 32,
    
        borderRadius: '50% 50% 50% 0',
    
        backgroundColor: 'inherit',
    
        transformOrigin: 'bottom left',
    
        transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
    
        '&:before': { display: 'none' },
    
        '&.MuiSlider-valueLabelOpen': {
    
            transform: 'translate(50%, -100%) rotate(-45deg) scale(1)'
    
        },
    
        '& > *': {
    
            transform: 'rotate(45deg)'
    
        }
    
    }
  
})