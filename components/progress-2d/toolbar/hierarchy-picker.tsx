
import { Box, MenuItem, MenuProps, OutlinedInput, Select, Typography } from '@mui/material'

import StructureHierarchy from '../../viewer/structure-hierarchy'

const ITEM_HEIGHT = 48

const ITEM_PADDING_TOP = 8

const MenuProps: Partial<MenuProps> = {

    PaperProps: {

        style: {

            backgroundColor: 'white !important',

            opacity: 1,

            maxHeight: ITEM_HEIGHT * 10 + ITEM_PADDING_TOP,

            marginTop: 2

        }
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

                        startAdornment={<Typography className='text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-sm mr-3'>

                            Structure:

                        </Typography>} />

                }

                renderValue={(selected) => (

                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>

                        <div className='text-black text-sm mt-[2px]'>{ (selected as any).name }</div>

                    </Box>

                )}

                MenuProps={MenuProps}>

                <MenuItem sx={{

                    '&.MuiPaper-root': {

                        backgroundColor: 'white !important'
                    },

                    '&.MuiPaper-root MuiList-root ': {

                        backgroundColor: 'white !important'
                    },

                }} color='warning' value={selected || ''} >

                    <StructureHierarchy

                        structure={selected._id}

                        hierarchy={hierarchy}

                        onClose={onClose}

                        onSelect={onSelect} />

                </MenuItem>

            </Select>

        </Box>

    )
}