import { IconButton, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, Typography , Button, Input} from '@mui/material'

import { useEffect, useState } from 'react'

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

interface Stage extends IAssetStage {
	id?: string;
	metric?: number | string | { metric: string | number} | { metric: { metric: string | number; } };
}

const ElementDetails: React.FC<{

    asset: IAsset, supportUser: boolean,

    onChange?: (key: string, value: string) => void,

    onDeleteStage?: (stage: string) => void,

    values?: { [key: string]: string },

    onSave?: ()=> void,

    stages?: Stage[],

    metrics: { [key: string]: string | number | { metric: string } | { metric: { metric: number | string }} },

    metricsChange?: (asset: IAsset) => void,

    refetchAssets: () => void,

    actualCategoryName: string,
    
}> = ({ asset, supportUser, onChange, onDeleteStage, values , onSave = () => {}, stages =[] , metrics , metricsChange, refetchAssets , actualCategoryName }) => {

    const params = useParams();

    const { description: actualDecription = '', progress = {}, name: actualName, _id: assetId } = asset || {}

    const { stage: actualStage } = progress  as IAssetProgress || {}

    const { name , description, stage } = values || {}

    const fields = [
        {
            label:"Area",
            name: "area",
            show: true
        },
        {
            label:"Volume",
            name: "volume",
            show: true
        },
        {
            label:"Height",
            name: "height",
            show: true
        },
        {
            label:"Width",
            name: "width",
            show: true
        }
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
                    <div className='mt-4 flex justify-end'>
                    <Button 
                    size='small'  
                    className='py-2 pl-[7px] pr-[8px] rounded-[8px] font-semibold text-white bg-[#F1742E] hover:bg-[#F1742E] disabled:bg-gray-300'
                    disabled={ !( actualName !== name || description !== actualDecription ||  stage !== actualStage ) || !name}
                    onClick={onSave}
                    >
                        Save
                    </Button>
                    </div>
                    <div className='mt-4 ml-1 flex flex-wrap'>
                        {fields.map((field, index)=>(<div className='flex items-baseline basis-1/2 justify-between mt-2' key={field.label}>
                            <div className={index%2 ? "ml-2":'ml-0'}>{field.label}</div>
                            <div className='flex items-baseline'>
                                <OutlinedInput size="small" sx={{ width:"64px" }} name={field.name} className='mr-1'/>
                                <div className='text-[12px]'>ft</div>
                            </div>
                        </div>))}
                    </div>
                    <Metrics stages ={stages}
                    assetId = {assetId}
                    metrics = {metrics}
                    refetchAssets ={refetchAssets}
                    asset={asset}
                    onChange={metricsChange} />
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

        if (!shouldDisable(event.target.value)) {

            setStage(event.target.value)

            onChange && onChange(label.toLowerCase(), event.target.value)

        }

        else toast.warn(`You have already completed this stage`, { autoClose: 5000 })

    }

    const shouldDisable = (stageId: string) => {

        if(actualValue === stageId) return false

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