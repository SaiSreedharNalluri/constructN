

import { FormControlLabel, Checkbox, LinearProgress, FormGroup, Stack, styled, linearProgressClasses, Typography, Slider, OutlinedInput } from '@mui/material'

import { IAsset, IAssetCategory, IAssetStage } from '../../models/IAssetCategory'

import DoneIcon from '@mui/icons-material/Done';

import EditIcon from '../../public/divami_icons/edit.svg'

import Image from 'next/image'
import { Dispatch, SetStateAction, useState } from 'react';
import PopupComponent from '../popupComponent/PopupComponent';
import { API } from '../../config/config';
import instance from '../../services/axiosInstance';
import authHeader from '../../services/auth-header';


const markAsComplete = async (details: { category?: string, date?: Date, stage?: string, setCompleted: Function, refetch: () => void , setLoading: Dispatch<SetStateAction<boolean>>, structId: string}) => {

    const { refetch, setCompleted , setLoading, structId } = details;

    try {
        setLoading(true)
        await instance.put(`${API.PROGRESS_2D_URL}/assets/mark-as-complete`, null,{
            headers: authHeader.authHeader(),
            params: {category: details.category, date: details.date, stage: details.stage, structure: structId}
        })
        refetch()
        setCompleted(false)

    } catch (error) { 
        throw error 
    } finally{
        setLoading(false)
    }

}



export default function Progress2DStages(

    { stages, compare, onToggleVisibility , snapShotDate, selectedCategory, refetch, assets, structId ='' }:

        {
            stages: ({ assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & Partial<IAssetStage> & { visible: boolean })[] | undefined,

            onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void, compare: boolean;

            snapShotDate?: Date

            selectedCategory?: IAssetCategory | undefined

            refetch?: ()=> void

            assets?: IAsset[]

            structId?: string

        }) {

    return (

        <>

            {stages?.map(stage => (stage as IAssetStage).sequence > 0 &&

                <Progress2DStage

                    key={stage._id} stage={stage}

                    snapShotDate={snapShotDate}

                    selectedCategory={selectedCategory}

                    refetch={refetch}

                    assets={assets}

                    structId={structId}

                    onToggleVisibility={onToggleVisibility} compare={compare} />)

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

    { stage, compare, onToggleVisibility, snapShotDate, selectedCategory, refetch =()=>{}, assets = [], structId ='' }: {

        stage: Partial<IAssetStage> & { assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & { visible: boolean },
        
        onToggleVisibility: (stage: Partial<IAssetStage> & { assets: Partial<IAsset>[] } & { visible: boolean }) => void, compare: boolean;

        snapShotDate?: Date

        selectedCategory?: IAssetCategory | undefined

        refetch?: ()=> void

        assets?: IAsset[]

        structId?: string

    }) {


    const totalValueMetrics = assets.reduce((newVal, oldVal)=>{
        return newVal + (Number((oldVal?.metrics?.[stage._id!] as { metric: string; })?.metric || 0))
    },0)

    const [edit , setEdit]= useState(false)

    const [completed, setCompleted] = useState<{checked: boolean, details?: Partial<IAssetStage> & { assets: Partial<IAsset>[], assetsCompare: Partial<IAsset>[] } & { visible: boolean }}>({ checked: false})

    const [loading, setLoading] = useState(false)

    const [assetValue , totalAssetValue]= useState(totalValueMetrics)

    const totalCompletedMetrics = stage.assets.reduce((newVal, oldVal)=>{
        return newVal + (Number((oldVal?.metrics?.[stage._id!] as { metric: string; })?.metric || 0))
    },0)

    const totalCompletedCompareMetrics = stage.assetsCompare.reduce((newVal, oldVal)=>{
        return newVal + (Number((oldVal?.metrics?.[stage._id!] as { metric: string; })?.metric || 0))
    },0)

    const getProgress = (): number | number[] => {

        const baseProgress = stage.assets.length == 0 ? 0 : (totalCompletedMetrics * 100 / (totalValueMetrics || 1))

        const compareProgress = stage.assetsCompare.length == 0 ? 0 : (totalCompletedCompareMetrics * 100 / (totalValueMetrics || 1))

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

    const _progressLabelFormatter = (value: number) => `${(value || 0).toFixed(1)}%`

    return (<>

        <div className='p-4 pr-[28px] mt-3 select-none' style={{ border: '1px solid #e2e3e5', borderRadius: '6px' }}>

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
                

            </Stack>

            <div className='w-full flex justify-between align-middle mt-1'>

                <div className='flex justify-between w-full'>


                    <Typography fontFamily='Open Sans' className='text-sm text-[#727375] font-[600]'>{getProgressValue() || 0}%</Typography>
                    <div className='flex ml-2'>
                        <Typography fontFamily='Open Sans' className='text-sm text-[#727375]'>{totalCompletedMetrics} / {edit? <OutlinedInput type='number' size='small' value={assetValue} className='w-[60px] h-[24px] input-no-arrows' onChange={(e)=> totalAssetValue(parseInt(e.target.value)) } /> : assetValue} {edit? null: stage.uom}</Typography>
                        {!edit? <Image src={EditIcon} alt={"edit icon"} data-testid="edit-icon" className='ml-2 cursor-pointer' onClick={()=>setEdit(true)} />: <DoneIcon className='cursor-pointer ml-1 p-0.5' onClick={()=>setEdit(false)} />}
                    </div>

                </div>


            </div>
            {((totalCompletedMetrics / totalValueMetrics) < 1) ? <div className='flex mt-2'>
                    <Typography fontFamily='Open Sans' onClick={(e)=> setCompleted({checked: true, details: stage})} className='text-[12px] text-[#0000FF] underline cursor-pointer'>Mark as Complete</Typography>
            </div> :null}

            {completed?.checked && ((totalCompletedMetrics / totalValueMetrics) < 1) && (
                    <PopupComponent
                        open={completed?.checked}
                        setShowPopUp={setCompleted}
                        modalTitle={"Mark as complete?"}
                        modalmessage={<ModalMessage units={completed?.details?.uom || ''} quantity={totalCompletedMetrics}/>}
                        primaryButtonLabel={"Confirm"}
                        SecondaryButtonlabel={"Cancel"}
                        disableSecondaryButton={loading}
                        disablePrimaryButton={loading}
                        callBackvalue={()=>{ markAsComplete({ stage: completed.details?._id , date: snapShotDate, category: selectedCategory?._id, setCompleted, refetch, setLoading , structId})}}
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