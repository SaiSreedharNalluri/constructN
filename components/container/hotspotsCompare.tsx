import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { ISnapshot } from '../../models/ISnapshot';
import moment from 'moment';

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
      <table className="table-fixed">
        <thead>
          <tr>
            <th>Dates</th>
            <th>{moment(snapshot.date).format('MMM DD, YYYY')}</th>
            <th>{moment(compareSnapshot.date).format('MMM DD, YYYY')}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Row Clearing</td>
            <td>{left.row_clearing}%</td>
            <td>{right.row_clearing}%</td>
          </tr>
          <tr>
            <td>Stringing</td>
            <td>{left.stringing}%</td>
            <td>{right.stringing}%</td>
          </tr>
          <tr>
            <td>Excavation</td>
            <td>{left.excavation}%</td>
            <td>{right.excavation}%</td>
          </tr>
          <tr>
            <td>Pipe Laying</td>
            <td>{left.pipe_laying}%</td>
            <td>{right.pipe_laying}%</td>
          </tr>
          <tr>
            <td>OFC Cabling</td>
            <td>{left.ofc_cabling}%</td>
            <td>{right.ofc_cabling}%</td>
          </tr>
          <tr>
            <td>Mat Laying</td>
            <td>{left.mat_laying}%</td>
            <td>{right.mat_laying}%</td>
          </tr>
          <tr>
            <td>Back Filling</td>
            <td>{left.back_filling}%</td>
            <td>{right.back_filling}%</td>
          </tr>
        </tbody>
      </table>
    )

    return (
      <>
        {
          show ? <div id="mapbox-hotspot-compare" className='compare-details'>
            <div className='flex'>
              <h4 className='mb-2 flex-1'>{left.name} ({left.length.toFixed(0)} mts.)</h4>
              <IconButton size="small" className='w-3 h-3 mt-1 text-xs' aria-label="delete" onClick={() => setShow(false)} onTouchEnd={() => {
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
