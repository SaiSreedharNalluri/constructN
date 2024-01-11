import { ChangeEvent, useRef, useState } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { Button, Chip, FormHelperText, LinearProgress, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'

import PopupComponent from '../../../popupComponent/PopupComponent'

import AddOutlinedIcon from '@mui/icons-material/AddOutlined'

import RemoveOutlinedIcon from '@mui/icons-material/RemoveOutlined'

import { IStructure } from '../../../../models/IStructure'

import { Signal, useSignal } from '@preact/signals-react'

import { useComputed, useSignals } from '@preact/signals-react/runtime'

import { IDesign } from '../../../../models/IDesign'

import { Uploader } from '../../web_worker/uploadFileWorker'

import UploadingStatus from '../../uploaderFIle/uploadingStatus'

import ChooseOnboardingFiles from '../chooseOnboardingFiles'

import { CustomToast } from '../../custom-toaster/CustomToast'

import MoreVertIcon from '@mui/icons-material/MoreVert'

import { TruncatedString } from "../../../../utils/utils";

import { TooltipText } from "../../../divami_components/side-panel/SidePanelStyles";

type UploadProgress = {
    sent: number
    total: number
    percentage: number
}

const StructureHierarchy = ({ projectId, hierarchy, onAdd, onDelete, onSheetAdded,loader }: any) => {

    useSignals()

    const addSheetPopup = useSignal(false)

    const addStructurePopup = useSignal(false)

    const removeStructurePopup = useSignal(false)

    const currentStructure = useSignal<IStructure | undefined>(undefined)

    const fileToUpload = useSignal<File | undefined>(undefined)

    const newStructureName = useSignal<string>('')

    const uploadComplete = useSignal(false)

    const uploadProgress = useSignal<UploadProgress>({ sent: 0, total: 0, percentage: -1 })

    const addSheetFormJSX = useComputed(() => renderAddSheetForm(addSheetPopup, projectId, currentStructure.value!, onSheetAdded, fileToUpload, uploadProgress, uploadComplete,loader))

    const renderAddSheetPopup = useComputed(() => addSheetPopup.value === true ? <PopupComponent open={addSheetPopup.value} hideButtons
        setShowPopUp={(state: boolean) =>{ addSheetPopup.value = state;fileToUpload.value?fileToUpload.value=undefined:""}} modalTitle={'Add Drawing'}
        modalmessage={''} primaryButtonLabel={'Delete'} SecondaryButtonlabel={'Discard'}
        callBackvalue={() => { }} modalContent={addSheetFormJSX}
        backdropWidth={true} showButton={false}
    /> : <></>)

    const addStructureFormJSX = useComputed(() => renderAddStructureForm(addStructurePopup, currentStructure.value?._id, newStructureName, onAdd))

    const renderAddStructurePopup = useComputed(() => addStructurePopup.value === true ? <PopupComponent open={addStructurePopup.value} hideButtons
        setShowPopUp={(state: boolean) => addStructurePopup.value = state}
        modalTitle={`Add sublevel for ${currentStructure.value?.name}`}
        modalmessage={''} primaryButtonLabel={'Save'} SecondaryButtonlabel={'Discard'}
        callBackvalue={() => { }} width={'60%'} backdropWidth={true} showButton={false}
        modalContent={addStructureFormJSX}
    /> : <></>)

    const removeStructureFormJSX = useComputed(() => renderDeleteStructureForm(removeStructurePopup, currentStructure.value!, onDelete))

    const renderRemoveStructurePopup = useComputed(() => removeStructurePopup.value === true ? <PopupComponent open={removeStructurePopup.value} hideButtons
        setShowPopUp={(state: boolean) => removeStructurePopup.value = state} modalTitle={'Delete level'}
        modalmessage={''} primaryButtonLabel={'Delete'} SecondaryButtonlabel={'Discard'}
        callBackvalue={() => { }} modalContent={removeStructureFormJSX}
        backdropWidth={true} showButton={false}
    /> : <></>)

    return (

        <div className='p-4 min-w-[20vw] bg-white' >

            <Tree treeData={hierarchy} parent={undefined}
                onAdd={(structure: IStructure) => { currentStructure.value = structure; addStructurePopup.value = true }}
                onDelete={(structure: IStructure) => { currentStructure.value = structure; removeStructurePopup.value = true }}
                addSheet={(structure: IStructure) => { currentStructure.value = structure; addSheetPopup.value = true }} />

            {renderAddSheetPopup}

            {renderAddStructurePopup}

            {renderRemoveStructurePopup}

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

    const _sheetName = () => {
        const designs = node.designs
        const drawing = designs?.find((design: IDesign) => design.type === 'Plan Drawings')
        return drawing?.name ?? ''
    }

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
                    <TooltipText title={name.length > 50 ? name : ""} placement="right">
                        <div>
                            <TruncatedString text={name} maxLength={50} suffixLength={0}></TruncatedString>
                        </div>

                    </TooltipText>
                </div>

                <div className='flex w-[25vw] items-center'>

                    <Stack direction='row' spacing={1}>

                        {_sheetName() !== '' && <Chip label={_sheetName()} color='default' size='small' onClick={handleClick} />}

                        {_sheetName() === '' &&
                            <Chip label='Add Drawing' size='small' color='secondary' clickable className='mr-2 text-[12px]'
                                variant='outlined' onClick={() => addSheet(node)} icon={<AddOutlinedIcon className='w-[16px] h-[16px]' />} />
                        }

                    </Stack>

                </div>

                <div className='flex w-[13rem] group-hover:opacity-100 opacity-0 items-center'>

                    <Chip label='Add Sublevel' size='small' color='info' clickable className='mr-2 text-[12px]' variant='outlined'
                        icon={<AddOutlinedIcon className='w-[16px] h-[16px]' />} onClick={() => onAdd(node)} />

                    {node.parent !== null && <Chip label='Delete Level' size='small' color='error' clickable className='mr-2 text-[12px]' variant='outlined'
                        icon={<RemoveOutlinedIcon className='w-[16px] h-[16px]' />} onClick={() => onDelete(node)} />}

                </div>

                <MoreVertIcon className='group-hover:opacity-0 opacity-100' htmlColor='#c2c3c5' fontSize='small' />

            </div>


            <ul className='pl-[2rem]' style={{ borderLeft: '1px dashed #e2e3e5' }}>

                {showChildren && children && children.length > 0 && <Tree treeData={children} parent={node._id} onAdd={onAdd} onDelete={onDelete} addSheet={addSheet} />}

            </ul>

        </>
    )

}

const renderAddSheetForm = (
    showPopup: Signal<boolean>, projectId: string, structure: IStructure, onSheetAdded: Function,
    fileToUpload: Signal<File | undefined>, uploadProgress: Signal<UploadProgress>, uploadStatus: Signal<boolean>,loader:any) => {

    const dragDropText = "(or drag and drop file here)";
    const supportFileText = "Upload .PDF or .DWG file";

    const onDrop = (acceptedFiles: File[]) => {
        if (acceptedFiles) {
            fileToUpload.value = acceptedFiles[0]
        }
    }

    const onDelete = (e: any) => {
        fileToUpload.value = undefined
        e.stopPropagation();
    }

    const onUpload = (e: any) => {
        e.stopPropagation();
        // proceedUpload()
    }

    const proceedUpload = () => {
        const uploader = new Uploader({ file: fileToUpload.value, projectId, structureId: structure._id, type: 'Plan Drawings' })

        uploader.onProgress(({ sent, total, percentage }: { percentage: number, sent: number, total: number }) => {
            // console.log(`${percentage}%`)
            uploadProgress.value = { sent, total, percentage }
           loader.value=true
        })
            .onError((error: any) => {
                console.error(error)
                uploadStatus.value = false
                CustomToast('Failed to upload.', 'error', false)
                fileToUpload.value = undefined
                loader.value=true
            })
            .onComplete(() => {
                uploadStatus.value = false
                showPopup.value = false
                uploadProgress.value = { sent: 0, total: 0, percentage: -1 }
                CustomToast(`Added drawing to ${structure.name} successfully.`, 'success')
                onSheetAdded()
                fileToUpload.value = undefined
                loader.value=false
            })

        uploadStatus.value = true
        uploader.start()
    }

    const _sizeInMB = (file: File) => `${(file.size / (1024 * 1024)).toFixed(1)} MB`

    return (<><div className='flex flex-col'>

        <ChooseOnboardingFiles
            onDrop={onDrop}
            onUpload={onUpload}
            onDelete={onDelete}
            dragDropText={dragDropText}
            supportFileText={supportFileText}
            fileToUpload={fileToUpload}
            uploadStatus={uploadStatus}
            UploadingStatus={<UploadingStatus />}
            isDisabled={false}
            acceptFiles={{ "application/octet-stream": [".pdf", ".dwg"] }} />

        {uploadProgress.value.percentage !== -1 && uploadStatus.value == true &&
            <div className='mt-8 w-[400px] py-4 px-8'>
                <div className='flex justify-between'>
                    <div className='text-[12px]'>{`${(uploadProgress.value.sent / (1024 * 1024)).toFixed(1)} MB / ${(uploadProgress.value.total / (1024 * 1024)).toFixed(1)} MB`}</div>
                    <div className='text-[12px]'>{`${(uploadProgress.value.percentage).toFixed(1)}%`}</div>
                </div>
                <LinearProgress className='mt-4' color='warning' variant="determinate" value={uploadProgress.value.percentage} />
            </div>
        }
        {loader.value&&<div style={{  position: "fixed",
  top: "0",
  left: "0",
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0, 0, 0, 0.5)" ,
  zIndex: 9999,}}></div>}

        <div className='flex justify-between mt-6'>

            <Button variant='outlined' size='large' className='flex-1 mr-3' color='warning'
                onClick={() => { showPopup.value = false; fileToUpload.value = undefined }}>
                Discard
            </Button>

            <Button variant='contained' size='large' className='flex-1 ml-3 bg-[#F1742E]' color='warning'
                disabled={fileToUpload.value === undefined || uploadStatus.value == true} onClick={() =>{ proceedUpload(); loader.value=true}} >
                Upload
            </Button>

        </div>

    </div></>)

}

const renderAddStructureForm = (
    showPopup: Signal<boolean>, parent: string | undefined, newStructureName: Signal<string>,
    onAdd: (name: string, parent: string | undefined) => {}) => {

    return (<><div className='flex flex-col'>

        <TextField color='warning' className='my-4'
            label='Level Name*' variant='outlined' value={newStructureName.value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => { newStructureName.value = e.target.value }} />

        <div className='flex justify-between mt-6'>

            <Button variant='outlined' size='large' className='flex-1 mr-3' color='warning'
                onClick={() => { showPopup.value = false; setTimeout(() => newStructureName.value = '', 1000) }}>
                Discard
            </Button>

            <Button variant='contained' size='large' disabled={newStructureName.value === ''} className='flex-1 ml-3 bg-[#F1742E]'
                color='warning' onClick={() => {
                    onAdd(newStructureName.value, parent)
                    showPopup.value = false
                    setTimeout(() => newStructureName.value = '', 1000)
                }} >
                Save
            </Button>

        </div>

    </div></>)

}

const renderDeleteStructureForm = (
    showPopup: Signal<boolean>, structure: IStructure,
    onDelete: (structure: string) => {}) => {

    return (<><div className='flex flex-col'>

        <Typography variant='body1'>{`Are you sure you want to delete level ${structure?.name} ?`}</Typography>

        <div className='flex justify-between mt-6'>

            <Button variant='outlined' size='large' className='flex-1 mr-3' color='warning'
                onClick={() => { showPopup.value = false }}>
                Discard
            </Button>

            <Button variant='contained' size='large' className='flex-1 ml-3 bg-[#F1742E]'
                color='warning' onClick={() => {
                    onDelete(structure._id)
                    showPopup.value = false
                }} >
                Delete
            </Button>

        </div>

    </div></>)

}

export default StructureHierarchy