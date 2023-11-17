import { IconButton, InputAdornment, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material'

import { useEffect, useState } from 'react'

import { IAsset, IAssetCategory, IAssetProgress, IAssetStage, NOT_STARTED_STAGE } from '../../models/IAssetCategory'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'

import CircleIcon from '@mui/icons-material/Circle'

import DeleteForeverIcon from '@mui/icons-material/DeleteForever'

import moment from 'moment'

import { toast } from 'react-toastify'


const ElementDetails: React.FC<{

    asset: IAsset, supportUser: boolean,

    onChange?: (key: string, value: string) => void,

    onDeleteStage?: (stage: string) => void
    
}> = ({ asset, supportUser, onChange, onDeleteStage }) => {

    return (
        <>
            {
                asset && <div>

                    <Element label={'Name'} value={asset.name} supportUser={supportUser} onChange={onChange} canEdit={true} />

                    <Element

                        label={'Description'} value={asset.description}

                        supportUser={supportUser} onChange={onChange} canEdit={true} lines={3} />

                    <StageElement

                        label={'Stage'} onChange={onChange} onDeleteStage={onDeleteStage} progressSnapshot={asset.progressSnapshot}

                        value={(asset.progress.stage as string)} supportUser={supportUser}

                        stages={[...[NOT_STARTED_STAGE], ...(asset.category as IAssetCategory).stages]} />

                    <div className='mt-4 ml-1'>

                        <Typography className='text-[#a2a3a5]' fontSize={'0.9rem'} fontWeight={300}>

                            Updated at {moment(new Date(asset.updatedAt)).format('DD MMM, yyyy HH:mm')}

                        </Typography>

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

}

const Element: React.FC<IElementProps> = ({ label, value, supportUser = false, onChange, lines = 1, canEdit = false }) => {

    const [name, setName] = useState(value)

    const [editable, setEditable] = useState(false)

    useEffect(() => {

        setName(value)

    }, [value])

    const handleChange = (data: string) => {

        setName(data)

    }

    return (

        <div className='mt-4'>

            <Typography fontFamily='Open Sans' color={'#777777'} className='ml-2 font-[500]' fontSize={13}>

                {label}

            </Typography>

            <OutlinedInput

                autoFocus fullWidth

                multiline={lines > 1 ? true : false}

                rows={lines} size='small'

                className='mt-1' disabled={!editable}

                endAdornment={

                    canEdit && <InputAdornment position='end'>

                        <Tooltip title={editable ? 'Save' : 'Edit'} arrow>

                            <IconButton

                                aria-label='toggle password visibility'

                                onClick={() => {

                                    setEditable(!editable)

                                    if (editable) onChange && name && onChange(label.toLowerCase(), name)

                                }}

                                onMouseDown={() => {

                                    setEditable(!editable)

                                    if (editable) onChange && name && onChange(label.toLowerCase(), name)

                                }}

                                className='text-[#aaaaaa]' edge='end' >

                                {editable ? <DoneOutlinedIcon fontSize='small' /> : <EditOutlinedIcon fontSize='small' />}

                            </IconButton>
                        </Tooltip>

                    </InputAdornment>

                }

                sx={{

                    fontFamily: 'Open Sans',

                    "& .MuiOutlinedInput-root": {

                        "& > fieldset": { border: 'none !important' },

                    },

                }}

                value={name} onChange={event => handleChange(event.target.value)} onBlur={event => setEditable(false)} />

        </div>
    )
}

const StageElement: React.FC<IElementProps> = ({ label, value, supportUser = false, progressSnapshot = [], stages, onChange, onDeleteStage }) => {

    const [stage, setStage] = useState<string>()

    useEffect(() => setStage(value), [value])

    const handleChange = (event: SelectChangeEvent) => {

        if (!shouldDisable(event.target.value)) {

            setStage(event.target.value)

            onChange && onChange(label.toLowerCase(), event.target.value)

        }

        else toast.warn(`You have already completed this stage (${event.target.value})`, { autoClose: 5000 })

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