
import { uploads } from "../../utils/config";

import { Link } from "react-router-dom";

const PhotoItem = ({ photo }) => {
    return <div className="mt-8 flex flex-col items-center">
        {photo.image && (
        <div className="w-full">     
            <img className="w-full h-[85vh] mt-4 rounded-lg flex justify-center border border-[#363636] object-contain" src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
            </div>
        )}
        <h2 className="font-bold text-[1.3em] mb-1 mt-1">{photo.title}</h2>
        <div className="w-full">
            <p className="text-left mb-1">
                Publicada por: <Link className="font-bold hover:underline" to={`/users/${photo.userId?._id}`}> {photo.userId?.name}</Link>
            </p>
        </div>
    </div>
}

export default PhotoItem