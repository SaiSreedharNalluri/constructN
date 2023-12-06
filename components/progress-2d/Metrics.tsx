import { Button , Paper, TableRow, TableHead, TableContainer, TableCell, TableBody, Table }  from '@mui/material';
import { Dispatch, SetStateAction, useState } from 'react';
import Input from '@mui/material/OutlinedInput';
import { IAssetStage } from '../../models/IAssetCategory';

interface Stage  extends IAssetStage {
  id?: string;
  progress?: number | string;
}

interface SetProgressProps{
  id?: string, 
  val?: number | string, 
  stageValues?: Stage[], 
  setStageValues?: Dispatch<SetStateAction<Stage[]>>
}


const setProgress = ({ id = '', val = 0, stageValues = [], setStageValues = () => {} }: SetProgressProps) => {

  const index = stageValues.findIndex((stage)=>(stage.id === id ))

  setStageValues(() => {
    stageValues[index] = { ...(stageValues[index] || {}), progress: val }
    return([...(stageValues ||[])])
  })

}


const onSave = ({ stageValues }: { stageValues?: Stage[] }) =>{
  console.log(stageValues,'stageValuesstageValues')
}

export default function Metrics({ stages =[] }: { stages: Stage[]}) {

  const [stageValues, setStageValues] =  useState([...(stages || [])])
  
  return (
    <div className='mt-4'>
    <TableContainer   style={{ maxHeight: 428 }}>
      <Table aria-label="table" stickyHeader >
        <TableHead >
          <TableRow>
            <TableCell className='w-1/2 pl-2'>Stage</TableCell>
            <TableCell className='w-1/3 p-0'>Value</TableCell>
            <TableCell className='w-1/6'>Units</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(stageValues || []).map((row) => (
            <TableRow
              key={row.name}
            >
              <TableCell component="th" scope="row" className='w-1/2 pl-2'>
                {row.name}
              </TableCell>
              <TableCell align="right" className='w-1/3 p-0'> <Input value={row.progress} size='small' type='number' onChange={(val)=> setProgress({ id: row.id, val: (val.target.value), stageValues, setStageValues })}/></TableCell>
              <TableCell align="center" className='w-1/6 p-0'>{row.uom}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <div className='mt-4 flex justify-end'>
    <Button
    size='small'  
    className='py-2 pl-[7px] pr-[8px] mr-2 rounded-[8px] font-semibold text-white bg-[#F1742E] hover:bg-[#F1742E] disabled:bg-gray-300'
    onClick={()=> onSave({ stageValues })}
    >
      Save
    </Button>

    </div>
    </div>
  );
}