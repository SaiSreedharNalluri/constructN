import { IconButton, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, Typography , Button, Input} from '@mui/material'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import { IAsset, IAssetCategory, IAssetProgress, IAssetStage, NOT_STARTED_STAGE } from '../../models/IAssetCategory'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'

import CircleIcon from '@mui/icons-material/Circle'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import moment from 'moment'

import { toast } from 'react-toastify'
import Metrics from './metrics-details'
import EmailButton from './send-email'
import { LightBoxInstance } from '../../services/light-box-service'
import { useParams } from 'next/navigation'
import { getCookie } from 'cookies-next'

interface Stage extends IAssetStage {
	id?: string;
	metric?: number | string | { metric: string | number} | { metric: { metric: string | number; } };
}

const ElementDetails: React.FC<{

    asset: IAsset, supportUser: boolean,

    onChange?: (key: string, value: string) => void,

    onDeleteStage?: (stage: string) => void,

    values: {
        name: string;
        description: string;
        stage: string;
        height?: number;
        width?: number;
    },

    onSave?: ()=> void,

    stages?: Stage[],

    setValues: Dispatch<SetStateAction<{
        name: string;
        description: string;
        stage: string;
        height?: number;
        width?: number;
        metrics?: { [key: string]: { measurementFactor: number; }; };
    }>>,

    metrics: { [key: string]: { measurementFactor: number } };

    metricsChange?: (asset: IAsset) => void,

    refetchAssets: () => void,

    actualCategoryName: string,

    assetContext: any,

}> = ({ asset, supportUser, onChange, onDeleteStage, values , onSave = () => {}, stages =[] , metrics, metricsChange, refetchAssets , actualCategoryName, assetContext, setValues }) => {

    const params = useParams();

    const userObj: string = (getCookie('user') || "{}") as string;

    const user = JSON.parse(userObj);

    const { name: actualName, _id: assetId} = asset || {}

    const { height: assetHeight, width: assetWidth } = values || {}

    const selectedData: any = Object.values(assetContext?.selection?.isSelected || {})?.[0];

    const conversionUnits = assetContext?.unitHandler?.toDisplayUnits('ft',1);

    const assetStages =  (asset?.category as IAssetCategory)?.stages

    const fields = [
        {
            label:"Height",
            name: "height",
            units: 'ft',
            show: !!assetStages?.find((stag)=>(['LxH', 'A'].includes(stag.measurement))),
            value: assetHeight
        },
        {
            label:"Width",
            name: "width",
            units: 'ft',
            show: !!assetStages?.find((stag)=>(['LxHxW', 'AxH'].includes(stag.measurement))),
            value: assetWidth
        },
        {
            label:"Length",
            name: "length",
            disabled: true,
            units: 'ft',
            show: true,
            value: (selectedData.getLength() * conversionUnits)?.toFixed(2)
        },
        {
            label:"Area",
            name: "area",
            show: selectedData.shapeType === "Polygon",
            units: 'ft²',
            disabled: true,
            value: selectedData.shapeType === "Polygon" ? (selectedData.getArea() * conversionUnits**2)?.toFixed(2) : null
        },
    ]


    return (
        <>
            {
                asset && <div>

                    <Element label={'Name'} value={values?.name} supportUser={supportUser} onChange={onChange} canEdit={true} />

                    <Element

                        label={'Description'} value={values?.description}

                        supportUser={supportUser} onChange={onChange} canEdit={true} lines={3} />

                    <StageElement

                        label={'Stage'} onChange={onChange} onDeleteStage={onDeleteStage} progressSnapshot={asset.progressSnapshot}

                        value={(asset.progress.stage as string)} supportUser={supportUser}

                        actualValue={(asset.progress.stage as string)}

                        stages={[...[NOT_STARTED_STAGE], ...(asset.category as IAssetCategory).stages]} />

                    <div className='mt-4 ml-1'>

                        <Typography className='text-[#a2a3a5]' fontSize={'0.9rem'} fontWeight={300}>

                            Updated at {moment(new Date(asset.updatedAt)).format('DD MMM, yyyy HH:mm')}

                        </Typography>

                    </div>
                    {user?.isSupportUser ? <div className='mt-4 ml-1 flex flex-wrap'>
                        {fields.map((field)=>(field.show? <div className='flex items-baseline basis-1/2 justify-between mt-2' key={field.label}>
                            <div className={"text-[12px]"}>{field.label}</div>
                            <div className='flex items-baseline w-[100px]'>
                                <OutlinedInput size="small" sx={{ width:"60px", ".MuiInputBase-inputSizeSmall":{
                                    padding:'8px',
                                    fontSize:'12px'
                                } }} name={field.name} type='number' onChange={(e)=>{onChange && onChange(field.name, e.target.value)}} className='mr-1' value={field.value || ''} disabled={field.disabled} />
                                <div className='text-[12px]'>{field?.units}</div>
                            </div>
                        </div>: null))}
                    </div>: null}
                    <Metrics stages ={stages}
                    assetId = {assetId}
                    metrics={metrics}
                    refetchAssets ={refetchAssets}
                    assetWidth={assetWidth}
                    assetHeight={assetHeight}
                    setValues={setValues}
                    values={values}
                    asset={asset}
                    selectedData={selectedData}
                    conversionUnits={conversionUnits}
                    onChange={metricsChange} />
                    <div className='mt-4 flex justify-end'>
                    <Button 
                    size='small'  
                    className='py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white bg-[#F1742E] hover:bg-[#F1742E] disabled:bg-gray-300'
                    onClick={onSave}
                    >
                        Save
                    </Button>
                    </div>
                    <div className='my-2'>
                        <EmailButton projectId ={params['projectId'] as string} assetId={assetId} assetName={actualName} structure={LightBoxInstance?.viewerData()?.structure?.name} captureDate={moment(new Date(LightBoxInstance?.getSnapshotBase()?.date)).format('DD-MMM-yyyy')} category={actualCategoryName} />
                    </div>
                </div>
            }
        </>
    )
}

export default ElementDetails


interface IElementProps {

    label: string

    value?: string

    progressSnapshot?: IAssetProgress[]

    supportUser: boolean

    lines?: number

    canEdit?: boolean

    stages?: IAssetStage[]

    onChange?: (key: string, value: string) => void

    onDeleteStage?: (stage: string) => void

    actualValue?: string

}


const Element: React.FC<IElementProps> = ({ label, value, onChange, lines = 1 }) => {

    return (

        <div className='mt-4'>

            <Typography fontFamily='Open Sans' color={'#777777'} className='ml-2 font-[500]' fontSize={13}>

                {label}

            </Typography>

            <OutlinedInput

                fullWidth

                multiline={lines > 1 ? true : false}

                rows={lines} size='small'

                className='mt-1'

                sx={{

                    fontFamily: 'Open Sans',

                    fontSize:'14px',

                    "& .MuiOutlinedInput-root": {

                        "& > fieldset": { border: 'none !important' },

                    },

                }}

                value={value} onChange={event => onChange && onChange(label.toLowerCase(), event.target.value)}  />

        </div>
    )
}

const StageElement: React.FC<IElementProps> = ({ label, value, supportUser = false, progressSnapshot = [], stages, onChange, onDeleteStage , actualValue}) => {

    const [stage, setStage] = useState<string>()

    useEffect(() => setStage(value), [value])

    const handleChange = (event: SelectChangeEvent) => {

        if (!shouldDisable(event.target.value) || actualValue === event.target.value) {

            setStage(event.target.value)

            onChange && onChange(label.toLowerCase(), event.target.value)

        }

        else toast.warn(`You have already completed this stage`, { autoClose: 5000 })

    }

    const shouldDisable = (stageId: string) => {

        for (let i = 0; i < progressSnapshot.length; i++) {

            if (progressSnapshot[i].stage == stageId) return true

        }

        return false

    }

    return (

        <div className='mt-4'>

            <Typography fontFamily='Open Sans' color={'#777777'} className='ml-2 font-[500]' fontSize={13}>

                {label}

            </Typography>

            <Select

                id='demo-select-small' className='text-[16px] mt-1'

                value={stage === undefined ? '' : stage} fullWidth

                label='Age' size='small' onChange={handleChange} >

                {stages && stages.map((stage: IAssetStage, index: number) => {

                    return <MenuItem key={index} value={stage._id} disabled={!supportUser && shouldDisable(stage._id)} >

                        <div className='flex relative items-center w-full'>

                            <CircleIcon fontSize='small' htmlColor={stage.color} />

                            <Typography fontFamily='Open Sans' variant='caption' className='ml-2 flex-1 text-[#4a4a4a]' fontSize='0.9rem'>{stage.name}</Typography>

                            {supportUser && shouldDisable(stage._id) && stage._id !== 'NOT_STARTED' &&

                                <IconButton className='absolute right-1' onClick={(event) => {

                                    event?.stopPropagation()

                                    onDeleteStage && onDeleteStage(stage._id)

                                }}><DeleteForeverIcon fontSize='small' color='error' /></IconButton>}

                        </div>

                    </MenuItem>

                })}

            </Select>

        </div>
    )
}