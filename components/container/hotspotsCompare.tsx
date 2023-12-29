import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { ISnapshot } from '../../models/ISnapshot';
import moment from 'moment';
import { Typography } from '@mui/material';

interface IProps {
  hotspotDetails: any|undefined,
  hotspotCompareDetails: any| undefined,
  snapshot: ISnapshot,
  compareSnapshot: ISnapshot
}

const HotspotsCompare: React.FC<IProps> = ({ hotspotDetails, hotspotCompareDetails, snapshot, compareSnapshot }) => {

  const [show, setShow] = useState<boolean>(true)

  useEffect(() => {
    setShow(true)
  }, [hotspotDetails, hotspotCompareDetails]);

  if (hotspotDetails && hotspotCompareDetails) {

    const getCompareDetails = (feature: any) => {
      return {
        name: feature.name,
        length: feature.length,
        row_clearing: (+feature.row_clearing * 100 / feature.length).toFixed(),
        stringing: (+feature.stringing * 100 / feature.length).toFixed(),
        excavation: (+feature.excavation * 100 / feature.length).toFixed(),
        pipe_laying: (+feature.pipe_laying * 100 / feature.length).toFixed(),
        ofc_cabling: (+feature.ofc_cabling * 100 / feature.length).toFixed(),
        mat_laying: (+feature.mat_laying * 100 / feature.length).toFixed(),
        back_filling: (+feature.back_filling * 100 / feature.length).toFixed()
      }
    }

    const progressHotspots: any[] = []

    const left = getCompareDetails(hotspotDetails.properties);
    const right = getCompareDetails(hotspotCompareDetails.properties);
    progressHotspots.push(
      <table className='table-fixed border border-[#e2e3e5]'>
        <thead>
          <tr className='border border-[#e2e3e5]'>
            <th className='border border-[#e2e3e5] px-2 py-1'>Dates</th>
            <th className='border border-[#e2e3e5] px-2 py-1'>{moment(snapshot.date).format('MMM DD, YYYY')}</th>
            <th className='border border-[#e2e3e5] px-2 py-1'>{moment(compareSnapshot.date).format('MMM DD, YYYY')}</th>
          </tr>
        </thead>
        <tbody>
          {left.row_clearing != right.row_clearing && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>Row Clearing</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.row_clearing}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.row_clearing}%</td>
          </tr> }
          {left.stringing != right.stringing && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>Stringing</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.stringing}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.stringing}%</td>
          </tr>}
          {left.excavation != right.excavation && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>Excavation</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.excavation}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.excavation}%</td>
          </tr>}
          {left.pipe_laying != right.pipe_laying && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>Pipe Laying</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.pipe_laying}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.pipe_laying}%</td>
          </tr>}
          {left.ofc_cabling != right.ofc_cabling && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>OFC Cabling</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.ofc_cabling}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.ofc_cabling}%</td>
          </tr>}
          {left.mat_laying != right.mat_laying && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>Mat Laying</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.mat_laying}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.mat_laying}%</td>
          </tr>}
          {left.back_filling != right.back_filling && <tr className='border border-[#e2e3e5]'>
            <td className='border border-[#e2e3e5] px-2 py-1'>Back Filling</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{left.back_filling}%</td>
            <td className='border border-[#e2e3e5] px-2 py-1'>{right.back_filling}%</td>
          </tr>}
        </tbody>
      </table>
    )

    return (
      <>
        {
          show ? <div id='mapbox-hotspot-compare' className='compare-details'>
            <div className='flex'>
              <Typography variant='h6' className='mb-2 ml-4 flex-1'>{left.name} ({left.length.toFixed(0)} mts.)</Typography>
              <IconButton size='large' className='w-3 h-3 mt-1 text-lg' aria-label='delete' onClick={() => setShow(false)} onTouchEnd={() => {
                  setShow(false);
                }}>
                X
              </IconButton>
            </div>
            {progressHotspots}
          </div> : <></>
        }
      </>
    )
  } else return (<></>)
};
export default HotspotsCompare;
