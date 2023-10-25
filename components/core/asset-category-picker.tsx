
import { Autocomplete, Box, TextField } from '@mui/material'

import { IAssetCategory } from '../../models/IAssetCategory'

import FormatShapesIcon from '@mui/icons-material/FormatShapes'

import PolylineIcon from '@mui/icons-material/Polyline'

import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked'

export default function AssetCategoryPicker({ categories }: { categories: IAssetCategory[] }) {

    const getIconForShape = (shape: string) => {

        switch (shape) {

            case 'Polygon':

                return <FormatShapesIcon sx={{fontSize: '0.9rem', color: '#7a7a7a'}} />

            case 'Line':

                return <PolylineIcon sx={{fontSize: '0.9rem', color: '#7a7a7a'}} />

            case 'Circle':

                return <RadioButtonUncheckedIcon sx={{fontSize: '0.9rem', color: '#7a7a7a'}} />

        }

    }

    return (

        <Autocomplete

            id="asset-category-picker"

            sx={{ width: 300 }}

            options={categories}

            autoHighlight

            getOptionLabel={(option: IAssetCategory) => option.name}

            renderOption={(props, option: IAssetCategory) => (

                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>

                    { getIconForShape(option.shape) }

                    <div className='ml-2 text-[14px] text-[#4a4a4a] font-light'>{ option.name }</div>

                </Box>

            )}

            renderInput={(params) => (

                <TextField

                    {...params}

                    className='text-[#4a4a4a]'

                    label="Choose a category"

                    inputProps={{

                        ...params.inputProps,

                        autoComplete: 'new-password', // disable autocomplete and autofill

                    }}
                />
            )}
        />
    )
}