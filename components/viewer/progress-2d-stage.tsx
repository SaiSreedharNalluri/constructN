

import { FormControlLabel, Checkbox, LinearProgress, FormGroup, Stack, styled, linearProgressClasses, Typography, Slider, OutlinedInput } from '@mui/material'

import { IAsset, IAssetStage } from '../../models/IAssetCategory'

import DoneIcon from '@mui/icons-material/Done';

import EditIcon from '../../public/divami_icons/edit.svg'

import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react';
import PopupComponent from '../popupComponent/PopupComponent';

export default function Progress2DStages(

    { stages, assetCount, compare, onToggleVisibility, setTotalAssets }:

        {
            stages: ({ assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean })[] | undefined, assetCount: number,

            onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void, compare: boolean;

            setTotalAssets: Dispatch<SetStateAction<number>>

        }) {

    return (

        <>

            {stages?.map(stage => (stage as IAssetStage).sequence > 0 &&

                <Progress2DStage

                    key={stage._id} assetCount={assetCount} stage={stage}

                    onToggleVisibility={onToggleVisibility} compare={compare}  setTotalAssets={setTotalAssets}/>)

            }

        </>
    )

}


const ModalMessage =({ quantity, units }: { quantity: number, units: string})=>(<div className='ml-3'>
        <Typography fontFamily='Open Sans' className='text-[16px]'>This Will Make This Stage as Completed</Typography>
        <Typography fontFamily='Open Sans' className='text-sm font-[700] mt-2'>Total quantity : {quantity} {units}</Typography>
        <Typography fontFamily='Open Sans' className='text-[10px] font-[400] mt-1'>ConstructN will reach out to you to understand more about this change</Typography>
    </div>) 

function Progress2DStage(

    { stage, assetCount, compare, onToggleVisibility, setTotalAssets }: {

        stage: Partial<IAssetStage> & { assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & { visible: boolean }, assetCount: number, 
        
        onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void, compare: boolean;

        setTotalAssets: Dispatch<SetStateAction<number>>

    }) {

    const [edit , setEdit]= useState(false)

    const [completed, setCompleted] = useState<{checked: boolean, details?: Partial<IAssetStage> & { assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & { visible: boolean }}>({ checked: false})

    const getProgress = (): number | number[] => {

        const baseProgress = stage.assets.length == 0 ? 0 : (stage.assets.length * 100 / assetCount)

        const compareProgress = stage.assetsCompare.length == 0 ? 0 : (stage.assetsCompare.length * 100 / assetCount)

        if(!compare) return baseProgress

        else return [compareProgress, baseProgress]
    }

    const getProgressValue = (): string => {

        const progress = getProgress()

        if(typeof(progress) === 'number') return `${(progress as number).toFixed(1)}`

        else return `${(progress as number[])[progress.length - 1].toFixed(1)}`
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
                
                    className='w-full mt-4' valueLabelDisplay='on'
                    
                    valueLabelFormat={value => _progressLabelFormatter(value)} value={getProgress()} />
                
                {!edit? <Image src={EditIcon} alt={"edit icon"} data-testid="edit-icon" className='ml-2 cursor-pointer' onClick={()=>setEdit(true)} />: null}

            </Stack>

            <div className='w-full flex justify-between align-middle mt-1'>

                <div className='flex'>

                    <Typography fontFamily='Open Sans' className='text-sm text-[#727375] font-[600]'>{getProgressValue()}%</Typography>
                    <div className='flex ml-2'>
                        <Typography fontFamily='Open Sans' className='text-sm text-[#727375]'>{stage.assets.length} / {edit? <OutlinedInput type='number' size='small' value={assetCount} className='w-[60px] h-[24px] input-no-arrows' onChange={(e)=> setTotalAssets(parseInt(e.target.value)) } /> : assetCount} {edit? null: 'assets'}</Typography>
                        {edit?<DoneIcon className='cursor-pointer ml-1 p-0.5' onClick={()=>setEdit(false)} />: null}
                    </div>

                </div>

                <div className='flex'>
                    <Typography fontFamily='Open Sans' onClick={(e)=> setCompleted({checked: true, details: stage})} className='ml-2 text-[12px] text-[#0000FF] underline cursor-pointer'>Mark as Complete</Typography>
                </div>

            </div>

            {completed?.checked && (
                    <PopupComponent
                        open={completed?.checked}
                        setShowPopUp={setCompleted}
                        modalTitle={"Mark as complete?"}
                        modalmessage={<ModalMessage units={completed?.details?.uom || ''} quantity={assetCount}/>}
                        primaryButtonLabel={"Confirm"}
                        SecondaryButtonlabel={"Cancel"}
                        callBackvalue={()=>{console.log('callBack')}}
                    />
                )}

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