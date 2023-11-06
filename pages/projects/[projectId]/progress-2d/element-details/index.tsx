import { IconButton, InputAdornment, MenuItem, OutlinedInput, Select, SelectChangeEvent, Typography } from '@mui/material'

import { useEffect, useState } from 'react'

import { IAsset, IAssetCategory, IAssetStage, NOT_STARTED_STAGE } from '../../../../../models/IAssetCategory'

import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

import DoneOutlinedIcon from '@mui/icons-material/DoneOutlined'


const ElementDetails: React.FC<{ asset: IAsset, onChange?: (key: string, value: string) => void }> = ({ asset, onChange }) => {

    return (
        <>
            {
                asset && <div>

                    <Element label={'Name'} value={asset.name} onChange={onChange} canEdit={true} />

                    <Element label={'Description'} value={asset.description} onChange={onChange} lines={3} />

                    <StageElement

                        label={'Stage'} onChange={onChange}

                        value={(asset.progress.stage as string)}

                        stages={[...[NOT_STARTED_STAGE], ...(asset.category as IAssetCategory).stages]} />

                </div>
            }
        </>
    )
}

export default ElementDetails


interface IElementProps {

    label: string

    value?: string

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

                        <IconButton

                            aria-label='toggle password visibility'

                            onClick={() => {
                                
                                setEditable(!editable)

                                if(editable) onChange && name && onChange(label.toLowerCase(), name)
                            
                            }}

                            onMouseDown={() => {
                                
                                setEditable(!editable)

                                if(editable) onChange && name && onChange(label.toLowerCase(), name)
                            
                            }}

                            className='text-[#aaaaaa]' edge='end' >

                            {editable ? <DoneOutlinedIcon fontSize='small' /> : <EditOutlinedIcon fontSize='small' />}

                        </IconButton>

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

const StageElement: React.FC<IElementProps> = ({ label, value, stages, onChange }) => {

    const [stage, setStage] = useState<string>()

    useEffect(() => {

        setStage(value)

    }, [value])

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

                    return <MenuItem key={index} className='text-[12px]' value={stage._id}>{stage.name}</MenuItem>

                })}

            </Select>

        </div>
    )
}