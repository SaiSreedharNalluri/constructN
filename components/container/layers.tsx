import { faCirclePlus, faList, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Layers: React.FC = () => {
    return (
        <div className=' flex justify-between'>
            <FontAwesomeIcon
                icon={faCirclePlus}
                className="mr-2 cursor-pointer"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
                icon={faList}
                className="mr-2 cursor-pointer"
            ></FontAwesomeIcon>
            <FontAwesomeIcon
                icon={faEyeSlash}
                className=" cursor-pointer"
            ></FontAwesomeIcon>
        </div >
    )
}

export default Layers