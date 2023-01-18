import { faCirclePlus, faList, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function Layers() {
    return (
        <div className='ml-1 flex justify-between'>
            <FontAwesomeIcon
                icon={faCirclePlus}
                className="hover:white text-center cursor-pointer"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
                icon={faList}
                className="hover:white text-center cursor-pointer"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
                icon={faEyeSlash}
                className="hover:white text-center cursor-pointer"
            ></FontAwesomeIcon>
        </div >
    )
}

export default Layers