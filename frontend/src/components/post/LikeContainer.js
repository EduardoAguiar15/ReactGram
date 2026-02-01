import { BsHeart, BsHeartFill } from 'react-icons/bs'

const LikeContainer = ({ photo, user, handleLike }) => {
    if (!photo || !user) return null;

    const liked = photo.likes?.includes(user._id);

    return (
        <div className='flex items-center py-2'>
            {liked ? (
                <BsHeartFill
                    className="text-[1.5em] cursor-pointer text-[#ff3040]"
                    onClick={() => handleLike(photo)} />
            ) : (
                <BsHeart
                    className="text-[1.5em] cursor-pointer"
                    onClick={() => handleLike(photo)} />
            )}

            <p className='ml-3'>{photo.likes?.length} curtida(s)</p>
        </div>
    )
}

export default LikeContainer