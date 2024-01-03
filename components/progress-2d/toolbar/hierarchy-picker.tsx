
import { Box, MenuItem, MenuProps, OutlinedInput, Select, Theme, Typography, makeStyles } from '@mui/material'

import StructureHierarchy from '../../viewer/structure-hierarchy'

const ITEM_HEIGHT = 48

const ITEM_PADDING_TOP = 8

const MenuProps: Partial<MenuProps> = {

    PaperProps: {

        style: {

            maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,

            marginTop: 2,

        },
    }
}

export interface IProps {

    hierarchy: any

    selected: any

    onSelect: (structure: any) => void

    onClose: () => void

}

export default function HierarchyPicker({ hierarchy, selected, onSelect, onClose }: IProps) {

    return (

        <Box sx={{ display: 'flex', flexWrap: 'wrap', border: '1px solid #e2e3e5', borderRadius: '6px', padding: '0' }}>

            <Select size='small' sx={{

                boxShadow: 'none',

                '&.MuiOutlinedInput-root': { paddingLeft: '4px' },

                '.MuiOutlinedInput-notchedOutline': { border: 0 },

                '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {

                    border: 0

                },

                '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {

                    border: 0

                }

            }} value={selected || ''}

                input={

                    <OutlinedInput size='small' className='min-w-[200px]'

                        startAdornment={<Typography fontFamily='Open Sans' className='text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-sm mr-3'>

                            Hierarchy:

                        </Typography>} />

                }

                renderValue={(selected) => (

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, fontFamily: 'Open Sans' }}>

                        <div className='text-black text-sm mt-[2px]'>{ (selected as any).name }</div>

                    </Box>

                )}

                MenuProps={MenuProps}>

                <MenuItem className='!bg-white' color='warning' value={selected || ''} >

                    <StructureHierarchy

                        structure={selected ? selected._id : ''}

                        hierarchy={hierarchy}

                        onClose={onClose}

                        onSelect={onSelect} />

                </MenuItem>

            </Select>

        </Box>

    )
}