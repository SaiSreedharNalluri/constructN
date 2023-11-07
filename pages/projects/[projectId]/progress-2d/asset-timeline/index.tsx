
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineConnector, TimelineContent, timelineItemClasses } from '@mui/lab'

import { IAsset, IAssetCategory, IAssetProgress, IAssetStage, NOT_STARTED_STAGE } from '../../../../../models/IAssetCategory'

import { Typography } from '@mui/material'

import moment from 'moment'


const AssetTimeline: React.FC<{ asset: IAsset }> = ({ asset }) => {

    return (

        <Timeline

            sx={{

                [`& .${timelineItemClasses.root}:before`]: {

                    flex: 0,

                    padding: 0,

                },
            }} >

            {asset?.progressSnapshot.map((item: IAssetProgress, index: number) => {

                return <TimelineItem key={index}>

                    <TimelineSeparator>

                        <TimelineDot color='warning' />

                        <TimelineConnector className='bg-[#F1742E]' color='warning' />

                    </TimelineSeparator>

                    <TimelineContent>

                        <AssetTimelineContent progress={item} stages={(asset.category as IAssetCategory).stages} />

                    </TimelineContent>

                </TimelineItem>

            })}

        </Timeline>
    )
}

export default AssetTimeline

const AssetTimelineContent: React.FC<{ progress: IAssetProgress, stages: IAssetStage[] }> = ({ progress, stages }) => {

    const _getStageFromId = (stageId: string): IAssetStage => {

        const filtered = stages.filter((stage: IAssetStage) => stageId == stage._id)

        return filtered.length == 0 ? NOT_STARTED_STAGE : filtered[0]

    }

    return (

        <div className='mt-[-1.5px]'>

            <Typography variant='caption' color={'#7a7a7a'}>{ moment(new Date(progress.updatedAt)).format('DD MMM, yyyy')}</Typography>

            <Typography fontSize={13} className='mt-1 mb-4' color={'#4a4a4a'}>{ `The stage of this asset has been updated to ${_getStageFromId(progress.stage as string).name} by `}<i>{progress.updatedBy.firstName}</i></Typography>

        </div>
    )
}