import { useState } from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight'

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

import { Divider, Typography } from '@mui/material'

import KeyboardDoubleArrowDownOutlinedIcon from '@mui/icons-material/KeyboardDoubleArrowDownOutlined'

let mStructure: string = ''


const StructureHierarchy = ({ structure, hierarchy, onSelect, onClose }: any) => {

    mStructure = structure

    return (

        <div className='p-4 min-w-[20vw]' >

            <div className='flex text-[#4a4a4a] mb-4' >

                <Typography variant='body1' className='pl-4 flex-grow select-none'>Hierarchy</Typography>

                <KeyboardDoubleArrowDownOutlinedIcon className='cursor-pointer' onClick={onClose} fontSize={'small'} />

            </div>

            <Divider className='mb-4' />

            <Tree treeData={hierarchy} onSelect={onSelect} />

        </div>
    )

}


const Tree = ({ treeData, onSelect }: any) => {

    return (

        <ul>

            {treeData.map((node: any) => (

                <TreeNode node={node} key={node._id} onSelect={onSelect} />

            ))}

        </ul>
    )

}

const TreeNode = ({ node, onSelect }: any) => {

    const { children, name } = node

    const [showChildren, setShowChildren] = useState(true)

    const _handleClick = () => onSelect(node)

    const _showChildren = () => setShowChildren(!showChildren)

    return (

        <>

            <div className='mb-2 border border-slate-50 text-sm'>

                <div className='flex items-center flex-wrap cursor-pointer rounded' onClick={_handleClick}

                    style={{ backgroundColor: mStructure == node._id ? '#f1742e' : 'white', color: mStructure == node._id ? 'white' : '#4a4a4a' }} >

                    {

                        (showChildren ?

                            <ArrowDropDownIcon htmlColor={`${(!children || children.length == 0) ? 'rgba(0, 0, 0, 0)' : 'black'}`} onClick={_showChildren} /> :

                            <ArrowRightIcon htmlColor={`${(!children || children.length == 0) ? 'rgba(0, 0, 0, 0)' : 'black'}`} onClick={_showChildren} />

                        )
                    }

                    <span>{name}</span>

                </div>

            </div>

            <ul className='pl-6' style={{ borderLeft: '1px dashed #e2e3e5' }}>

                {showChildren && children && children.length > 0 && <Tree treeData={children} onSelect={onSelect} />}

            </ul>

        </>
    )

}

export default StructureHierarchy