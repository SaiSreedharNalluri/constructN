

import { FormControlLabel, Checkbox, LinearProgress, FormGroup, Stack, styled, linearProgressClasses, Typography, Slider } from '@mui/material'

import { IAsset, IAssetStage } from '../../models/IAssetCategory'

export default function Progress2DStages(

    { stages, assetCount, compare, onToggleVisibility }:

        {
            stages: ({ assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean })[] | undefined, assetCount: number,

            onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void, compare: boolean

        }) {

    return (

        <>

            {stages?.map(stage => (stage as IAssetStage).sequence > 0 &&

                <Progress2DStage

                    key={stage._id} assetCount={assetCount} stage={stage}

                    onToggleVisibility={onToggleVisibility} compare={compare} />)

            }

        </>
    )

}

function Progress2DStage(

    { stage, assetCount, compare, onToggleVisibility }: {

        stage: Partial<IAssetStage> & { assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & { visible: boolean }, assetCount: number, 
        
        onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void, compare: boolean

    }) {

    const getProgress = (): number | number[] => {

        const baseProgress = stage.assets.length == 0 ? 0 : (stage.assets.length * 100 / assetCount)

        const compareProgress = stage.assetsCompare.length == 0 ? 0 : (stage.assetsCompare.length * 100 / assetCount)

        if(!compare) return baseProgress

        else return [compareProgress, baseProgress]
    }

    const getProgressValue = (): string => {

        const progress = getProgress()

        if(typeof(progress) === 'number') return `${(progress as number).toFixed(1)}%`

        else {

            const prog = progress as number[]

            return `% Change - ${(prog[prog.length - 1] - prog[prog.length - 2]).toFixed(1)}%`

        }
    }

    const onVisibilityChange = (event: any) => {

        const value = event.target.checked

        stage.visible = value

        onToggleVisibility(stage!)

    }

    const _progressLabelFormatter = (value: number) => `${value.toFixed(1)}%`

    return (<>

        <div className='p-4 mt-3 select-none' style={{ border: '1px solid #e2e3e5', borderRadius: '6px' }}>

            <FormGroup>

                <FormControlLabel key={stage._id}

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

            <Stack sx={{ color: stage.color }} direction='row'>

                {/* <BorderLinearProgress className='w-full mt-4 mb-2' color='inherit' variant='determinate' value={getProgress() as number} /> */}

                <RangeLinearProgress 
                
                    className='w-full mt-4' valueLabelDisplay='auto'
                    
                    valueLabelFormat={value => _progressLabelFormatter(value)} value={getProgress()} />

            </Stack>

            <div className='w-full flex justify-between mt-1'>

                <Typography fontFamily='Open Sans' className='text-sm text-[#727375]'>{getProgressValue()}</Typography>

                <Typography fontFamily='Open Sans' className='text-sm text-[#727375]'>{stage.assets.length} / {assetCount} assets</Typography>

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

const RangeLinearProgress = styled(Slider)({

    color: 'inherit',
    
    height: 8,
    
    '& .MuiSlider-track': {
    
        border: 'none'
    
    },
    
    '& .MuiSlider-thumb': {
    
        height: 12,
    
        width: 12,
    
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
    
        width: 1,
    
        height: 16,

        color: 'currentColor',

        margin: '0 0 0 0.5rem',
    
        '&:before': { display: 'none' },
    
        '&.MuiSlider-valueLabelOpen': {
    
            transform: 'translate(50%, -75%) scale(1)'
    
        }
    
    }
  
})