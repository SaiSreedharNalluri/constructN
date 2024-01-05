
import { InputAdornment, OutlinedInput, TextField, Typography } from '@mui/material'

import dayjs from 'dayjs'

import moment from 'moment'

import { LightBoxInstance } from '../../services/light-box-service'

import CustomCalender from '../divami_components/custom-datepicker/CustomCalender'

export interface IProps {

    snapshots: any[]

    snapshotBase: any

    snapshotCompare: any

    compare: boolean

    onChangeFromDate?: (date: Date, snapshot: any) => void

    onChangeToDate: (date: Date, snapshot: any) => void

}

export default function AssetCategoryDatePicker({ snapshots, snapshotBase, snapshotCompare, compare, onChangeFromDate, onChangeToDate }: IProps) {

    const _handleDateChange = async (event: any, isCompare: boolean = false) => {

        const dateFormatted = moment(new Date(event)).format('YYYY-MM-DD').toString()

        const value = snapshots.find((item: any) => moment(item?.date).format('YYYY-MM-DD').toString() === dateFormatted)

        if(isCompare && onChangeFromDate) onChangeFromDate(new Date(event), value)

        else onChangeToDate(new Date(event), value)
    }

    const _formattedDate = (date: any) => date ? moment(new Date(date)).format('DD MMM, yyyy') : ''

    const _disableWeekends = (date: any) => {

        const timelineDates: any[] = []

        const snapshots = LightBoxInstance.viewerData().snapshots

        if (snapshots.length > 0) {

            snapshots.forEach((element: any, i: number) => {

                timelineDates.push(dayjs(element.date).format('YYYY-MM-DD'))

            })

        }

        return timelineDates.indexOf(dayjs(date).format('YYYY-MM-DD')) < 0

    }

    return (

        <div className='flex'>

            { compare && <OutlinedInput

                size='small' disabled value={snapshotCompare ? _formattedDate(snapshotCompare.date) : ''}

                sx={{

                    width: '24ch', border: '1px solid #e2e3e5', borderRadius: '6px', fontFamily: 'Open Sans',

                    '&.MuiInputBase-root': { paddingLeft: '4px' },

                    '.MuiOutlinedInput-notchedOutline': { border: 0 },

                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {

                        border: 0

                    },

                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {

                        border: 0

                    }

                }}

                inputProps={{ style: {fontSize: 14, WebkitTextFillColor: '#4a4a4a' }}}

                startAdornment={<InputAdornment position='start'>

                    <Typography fontFamily='Open Sans' className='text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-sm mr-3'>

                        From:

                    </Typography>

                </InputAdornment>}

                endAdornment={<InputAdornment position='end'>

                    <CustomCalender

                        onChange={(event: any) => _handleDateChange(event, true)}

                        data-testid='calender'

                        shouldDisableDate={_disableWeekends}

                        hideTextField

                        data={{

                            disableAll: true,

                            defaultValue: snapshotBase.date,

                            disableDays: _disableWeekends

                        }}
                    />

                </InputAdornment>}
            /> }

            { compare && <div className='ml-2'></div> }

            <OutlinedInput

                size='small' disabled value={_formattedDate(snapshotBase.date)}

                sx={{

                    width: '23ch', border: '1px solid #e2e3e5', borderRadius: '6px', fontFamily: 'Open Sans',

                    '&.MuiInputBase-root': { paddingLeft: '4px' },

                    '.MuiOutlinedInput-notchedOutline': { border: 0 },

                    '&.MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {

                        border: 0

                    },

                    '&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {

                        border: 0

                    }

                }}

                inputProps={{ style: {fontSize: 14, WebkitTextFillColor: '#4a4a4a' }}}

                startAdornment={<InputAdornment position='start'>

                    <Typography fontFamily='Open Sans' className='text-[#4a4a4a] rounded bg-[#F1742E] bg-opacity-10 px-2 py-[6px] text-sm mr-1'>

                        {compare ? 'To' : 'Date'}:

                    </Typography>

                </InputAdornment>}

                endAdornment={<InputAdornment position='end'>

                    <CustomCalender

                        onChange={_handleDateChange}

                        data-testid='calender'

                        shouldDisableDate={_disableWeekends}

                        hideTextField

                        data={{

                            disableAll: true,

                            defaultValue: snapshotBase.date,

                            disableDays: _disableWeekends

                        }}
                    />

                </InputAdornment>}
            />

        </div>
    )
}