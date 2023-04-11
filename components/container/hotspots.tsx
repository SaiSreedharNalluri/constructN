import React, { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';

interface IProps {
  data: any[]
  onHotspotClick: Function
  selected: number
}

const Hotspots: React.FC<IProps> = ({ data, onHotspotClick, selected }) => {

  const [q, setQ] = useState("");
  const [show, setShow] = useState<boolean>(true)

  useEffect(() => {

  }, []);

  const progressHotspots = []

  for (let hotspot of data) {
    if (hotspot.properties.name.indexOf(q) > -1) {
      progressHotspots.push(
        <li
          className={`pt-2 pb-2 pl-8 pr-4 text-xs cursor-pointer ${selected === hotspot.properties.id ? 'bg-sky-500 hover:bg-sky-300' : 'hover:bg-sky-300'}`} key={hotspot.properties.id}
          onClick={(e) => onHotspotClick(hotspot)}>
          {hotspot.properties.name}
        </li>
      )
    }
  }
  if (data && data.length > 0) {
    return (
      <><div id="mapbox-hotspot" className={`fixed right-0 bottom-0 overflow-auto ${show ? 'h-4/5' : 'h-auto'} w-1/6 bg-white`}>
        <div className='h-6 bg-slate-300 w-full flex align-items-center' onClick={() => setShow(!show)}>
          <div className='pl-4 pt-1 text-xs flex-1'>{show ? 'Hide' : 'Show'} Details</div>
          <IconButton size="small" className='w-3 h-3 mt-1 text-l' aria-label="delete">
            {show ? '-' : '+'}
          </IconButton>
        </div>
        {
          show ? <div>
            <input
              className="m-2 placeholder:italic placeholder:text-slate-400 block bg-white w-auto border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm" placeholder="Search..."
              type="text" name="search" value={q} onChange={(e) => setQ(e.target.value)} />
            <ul>{progressHotspots}</ul>
          </div> : <></>
        }
      </div></>
    )
  } else return (<></>)
};
export default Hotspots;
