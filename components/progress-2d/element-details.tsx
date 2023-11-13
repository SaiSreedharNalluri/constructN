import { IconButton, InputAdornment, MenuItem, OutlinedInput, Select, SelectChangeEvent, Tooltip, Typography } from '@mui/material'

import { useEffect, useState } from 'react'

import { IAsset, IAssetCategory, IAssetStage, NOT_STARTED_STAGE } from '../../models/IAssetCategory'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'

import CircleIcon from '@mui/icons-material/Circle'

import moment from 'moment'


const ElementDetails: React.FC<{ asset: IAsset, onChange?: (key: string, value: string) => void }> = ({ asset, onChange }) => {

    const _getSequence = (stageId: string) => {

        const stages = (asset.category as IAssetCategory).stages

        const filtered = stages.filter((value: IAssetStage) => value._id === stageId)

        return filtered.length == 0 ? 0 : filtered[0].sequence

    }

    return (
        <>
            {
                asset && <div>

                    <Element label={'Name'} value={asset.name} onChange={onChange} canEdit={true} />

                    <Element label={'Description'} value={asset.description} onChange={onChange} canEdit={true} lines={3} />

                    <StageElement

                        label={'Stage'} onChange={onChange} sequence={_getSequence(asset.progress.stage as string)}

                        value={(asset.progress.stage as string)}

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

    sequence?: number

    lines?: number

    canEdit?: boolean

    stages?: IAssetStage[]

    onChange?: (key: string, value: string) => void

}

const Element: React.FC<IElementProps> = ({ label, value, onChange, lines = 1, canEdit = false }) => {

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

            <Typography color={'#777777'} className='ml-2 font-[500]' fontSize={13}>

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

                    "& .MuiOutlinedInput-root": {

                        "& > fieldset": { border: 'none !important' },

                    },

                }}

                value={name} onChange={event => handleChange(event.target.value)} onBlur={event => setEditable(false)} />

        </div>
    )
}

const StageElement: React.FC<IElementProps> = ({ label, value, sequence = 0, stages, onChange }) => {

    const [stage, setStage] = useState<string>()

    useEffect(() => setStage(value), [value])

    const handleChange = (event: SelectChangeEvent) => {

        setStage(event.target.value)

        onChange && onChange(label.toLowerCase(), event.target.value)

    }

    return (

        <div className='mt-4'>

            <Typography color={'#777777'} className='ml-2 font-[500]' fontSize={13}>

                {label}

            </Typography>

            <Select

                id='demo-select-small' className='text-[16px] mt-1'

                value={stage === undefined ? '' : stage} fullWidth

                label='Age' size='small' onChange={handleChange} >

                {stages && stages.map((stage: IAssetStage, index: number) => {

                    return <MenuItem key={index} value={stage._id}>
                        
                        <div className='flex items-center'>

                            <CircleIcon fontSize='small' htmlColor={stage.color} />

                            <Typography variant='caption' className='ml-2 text-[#4a4a4a]' fontSize='0.9rem'>{stage.name}</Typography>
                            
                        </div>
                        
                </MenuItem>

                })}

            </Select>

        </div>
    )
}