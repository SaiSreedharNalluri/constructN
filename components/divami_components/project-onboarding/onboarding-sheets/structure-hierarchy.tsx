import { ChangeEvent, useRef, useState } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { Button, Chip, Stack, TextField } from '@mui/material'

import PopupComponent from '../../../popupComponent/PopupComponent'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'

import ChooseUploaderFile from '../../uploaderFIle/chooseUploaderFile'

import { IStructure } from '../../../../models/IStructure'

import { Signal, useSignal } from '@preact/signals-react';

import { useSignals } from '@preact/signals-react/runtime'


const StructureHierarchy = ({ hierarchy, onAdd, onDelete }: any) => {

    useSignals()

    const addSheetPopup = useSignal(false)

    const addStructurePopup = useSignal(false)

    const removeStructurePopup = useSignal(false)

    const currentStructure = useRef<IStructure>()

    return (

        <div className='p-4 min-w-[20vw] bg-white' >

            <Tree treeData={hierarchy} parent={undefined} 
                onAdd={(structure: IStructure) => { currentStructure.current = structure; addStructurePopup.value = true }} 
                onDelete={(structure: IStructure) => { currentStructure.current = structure; removeStructurePopup.value = true }} 
                addSheet={(structure: IStructure) => { currentStructure.current = structure; addSheetPopup.value = true} }/>

            {
                addSheetPopup.value === true ? <PopupComponent open={addSheetPopup.value} hideButtons
                    setShowPopUp={(state: boolean) => addSheetPopup.value = state} 
                    modalTitle={`Add sheet for ${currentStructure.current?.name}`}
                    modalmessage={''} primaryButtonLabel={'Save'} SecondaryButtonlabel={'Discard'}
                    callBackvalue={() => {}} modalContent={renderAddSheetForm(addSheetPopup)}
                    width={'60%'} backdropWidth={true} showButton={false}
                /> : ''
            }

            {
                addStructurePopup.value === true ? <PopupComponent open={addStructurePopup.value} hideButtons
                    setShowPopUp={(state: boolean) => addStructurePopup.value = state} 
                    modalTitle={`Add child level for ${currentStructure.current?.name}`}
                    modalmessage={''} primaryButtonLabel={'Save'} SecondaryButtonlabel={'Discard'}
                    callBackvalue={() => {}}  width={'60%'} backdropWidth={true} showButton={false}
                    modalContent={renderAddStructureForm(addStructurePopup, currentStructure.current?._id, onAdd)}
                   
                /> : ''
            }

            {
                removeStructurePopup.value === true ? <PopupComponent open={removeStructurePopup.value} hideButtons
                    setShowPopUp={(state: boolean) => removeStructurePopup.value = state} modalTitle={'Delete level'}
                    modalmessage={`Are you sure you want to delete level ${currentStructure.current?.name} ?`} 
                    primaryButtonLabel={'Save'} SecondaryButtonlabel={'Discard'} callBackvalue={() => onDelete(currentStructure.current?._id)} 
                    backdropWidth={true} showButton={false}
                /> : ''
            }

        </div>
    )

}


const Tree = ({ treeData, parent, onAdd, onDelete, addSheet }: any) => {

    return (

        <ul>

            {treeData.map((node: any) => (

                <TreeNode node={node} parent={node._id} key={node._id} onAdd={onAdd} onDelete={onDelete} addSheet={addSheet} />

            ))}

        </ul>
    )

}

const TreeNode = ({ node, parent, onAdd, onDelete, addSheet }: any) => {

    const { children, name } = node

    const [showChildren, setShowChildren] = useState(true)

    const handleClick = () => {

        console.info('You clicked the Chip.')

      }
    
      const handleDelete = () => {
        
        console.info('You clicked the delete icon.')
      
    }

    const _showChildren = () => setShowChildren(!showChildren)

    return (

        <>

            <div className='flex mb-2 p-1 border border-slate-50 rounded text-sm justify-between align-center group'>

                <div className={`flex flex-1 items-center flex-wrap cursor-pointer rounded bg-white text-['#4a4a4a]`} >

                    {

                        (showChildren ?

                            (children && children.length > 0) ? <ArrowDropDownIcon htmlColor={`${(!children || children.length == 0) ? 'rgba(0, 0, 0, 0)' : 'black'}`} onClick={_showChildren} /> : <div className='pl-2'></div> :

                            (children && children.length > 0) ? <ArrowRightIcon htmlColor={`${(!children || children.length == 0) ? 'rgba(0, 0, 0, 0)' : 'black'}`} onClick={_showChildren} /> : <div className='pl-2'></div>

                        )
                    }

                    <span>{name}</span>

                </div>

                <div className='flex items-center mr-4'>

                    <Stack direction='row' spacing={1}>
                        
                        <Chip label='Clickable Deletable' size='small' onClick={handleClick} onDelete={handleDelete} />

                    </Stack>

                </div>

                <div className='flex group-hover:opacity-100 opacity-0 items-center'>

                    <Chip 
                    
                        label='Add Child' size='small' color='info' clickable className='mr-2 text-[12px]' variant='outlined' 
                        
                        icon={<AddOutlinedIcon className='w-[16px] h-[16px]' />} onClick={() => onAdd(node)} />

                    <Chip label='Add Sheet' size='small' color='secondary' clickable className='mr-2 text-[12px]' variant='outlined' 
                    
                        icon={<AddOutlinedIcon className='w-[16px] h-[16px]' />} onClick={() => addSheet(node)} />

                    <Chip label='Delete Level' size='small' color='error' clickable className='mr-2 text-[12px]' variant='outlined' 
                        
                        icon={<RemoveOutlinedIcon className='w-[16px] h-[16px]' />} onClick={() => onDelete(node)} />

                </div>

            </div>


            <ul className='pl-[2rem]' style={{ borderLeft: '1px dashed #e2e3e5' }}>

                {showChildren && children && children.length > 0 && <Tree treeData={children} parent={node._id} onAdd={onAdd} onDelete={onDelete} addSheet={addSheet} />}

            </ul>

        </>
    )

}

const renderAddSheetForm = (showPopup: Signal<boolean>) => {

    const onDrop = (acceptedFiles: File[]) => {
        console.log(acceptedFiles)
        if (acceptedFiles) {
          
        }
      }

    return (<><div className='flex flex-col'>
    
        <ChooseUploaderFile onDrop={onDrop} />

        <TextField color='warning' size='small' className='mt-4' label='Sheet Name' variant='outlined' />
        
        <TextField color='warning' size='small' className='mt-4 mb-6' label='Sheet Type' variant='outlined' />
        
        <div className='flex justify-between mt-6'>
        
            <Button variant='outlined' size='large' className='flex-1 mr-3' color='warning'  
                onClick={() => { showPopup.value = false }}>
                Discard
            </Button>
        
            <Button variant='contained' size='large' className='flex-1 ml-3 bg-[#F1742E]' 
                color='warning' onClick={() => {  }} >
                    Save
            </Button>
        
        </div>

    </div></>)

}

const renderAddStructureForm = (
    showPopup: Signal<boolean>, parent: string | undefined,
    onAdd: (name: string, parent: string | undefined) => {}) => {

    const structureName = useSignal('')

    return (<><div className='flex flex-col'>

        <TextField color='warning' className='my-4' 
            label='Structure Name' variant='outlined' value={structureName.value}  
            onChange={(e: ChangeEvent<HTMLInputElement>) => {structureName.value = e.target.value}}/>

        <div className='flex justify-between mt-6'>
        
            <Button variant='outlined' size='large' className='flex-1 mr-3' color='warning'  
                onClick={() => { showPopup.value = false }}>
                Discard
            </Button>
        
            <Button variant='contained' size='large' className='flex-1 ml-3 bg-[#F1742E]' 
                color='warning' onClick={() => onAdd(structureName.value, parent)} >
                    Save
            </Button>
        
        </div>

    </div></>)

}

export default StructureHierarchy