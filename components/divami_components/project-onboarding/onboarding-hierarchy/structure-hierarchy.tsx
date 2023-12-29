import { useRef, useState } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded'

import RemoveCircleOutlineRoundedIcon from '@mui/icons-material/RemoveCircleOutlineRounded'

import { Button, IconButton, OutlinedInput } from '@mui/material'


const StructureHierarchy = ({ hierarchy, onAdd, onDelete }: any) => {

    return (

        <div className='p-4 min-w-[20vw] bg-white' >

            {/* <div className='flex text-[#4a4a4a] mb-4' >

                <Typography variant='body1' className='pl-4 flex-grow select-none'>Hierarchy</Typography>

                <KeyboardDoubleArrowDownOutlinedIcon className='cursor-pointer' onClick={onClose} fontSize={'small'} />

            </div>

            <Divider className='mb-4' /> */}

            <Tree treeData={hierarchy} parent={undefined} onAdd={onAdd} onDelete={onDelete} />

        </div>
    )

}


const Tree = ({ treeData, parent, onAdd, onDelete }: any) => {

    return (

        <ul>

            {treeData.map((node: any) => (

                <TreeNode node={node} parent={node._id} key={node._id} onAdd={onAdd} onDelete={onDelete} />

            ))}

        </ul>
    )

}

const TreeNode = ({ node, parent, onAdd, onDelete }: any) => {

    const { children, name } = node

    const [showChildren, setShowChildren] = useState(true)

    const [showNewChild, setShowNewChild] = useState(false)

    const valueRef = useRef<any>()

    const _onAdd = (name: string, parent: string | undefined) => onAdd && onAdd(name, parent)

    const _onDelete = (structure: string) => onDelete && onDelete(structure)

    const _showChildren = () => setShowChildren(!showChildren)

    return (

        <>

            <div className='flex mb-2 border border-slate-50 rounded text-sm justify-between align-center group'>

                <div className={`flex flex-1 items-center flex-wrap cursor-pointer rounded bg-white text-['#4a4a4a]`} >

                    {

                        (showChildren ?

                            (children && children.length > 0) ? <ArrowDropDownIcon htmlColor={`${(!children || children.length == 0) ? 'rgba(0, 0, 0, 0)' : 'black'}`} onClick={_showChildren} /> : <div className='pl-2'></div> :

                            (children && children.length > 0) ? <ArrowRightIcon htmlColor={`${(!children || children.length == 0) ? 'rgba(0, 0, 0, 0)' : 'black'}`} onClick={_showChildren} /> : <div className='pl-2'></div>

                        )
                    }

                    <span>{name}</span>

                </div>

                <div className='flex group-hover:opacity-100 opacity-0 items-center'>

                    <IconButton size='small' onClick={() => setShowNewChild(true)}>
                        
                        <AddCircleOutlineRoundedIcon className='text-[#9a9a9a]' fontSize='small' />
                        
                    </IconButton>

                    <IconButton size='small' onClick={() => _onDelete(node._id)}>

                        <RemoveCircleOutlineRoundedIcon className='text-[#9a9a9a] mx-1' fontSize='small' />

                    </IconButton>

                </div>

            </div>

            { showNewChild && <div className='flex ml-[2rem] border p-1 border-slate-50 rounded text-sm align-center'>

                <OutlinedInput size='small' placeholder='Structure Name' className='mr-4' inputRef={valueRef} />

                <Button variant='text' size='small' color='inherit' onClick={() => setShowNewChild(false)}>Discard</Button>

                <Button variant='text' size='small' color='warning' onClick={() => onAdd(valueRef.current.value, parent)}>Save</Button>

            </div> }

            <ul className='pl-[2rem]' style={{ borderLeft: '1px dashed #e2e3e5' }}>

                {showChildren && children && children.length > 0 && <Tree treeData={children} parent={node._id} onAdd={onAdd} onDelete={onDelete} />}

            </ul>

        </>
    )

}

export default StructureHierarchy