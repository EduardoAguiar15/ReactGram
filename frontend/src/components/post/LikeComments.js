import { BsHeart, BsHeartFill } from 'react-icons/bs'

const LikeComments = ({ comment, user, handleLikeComment }) => {
  if (!comment || !user) return null;

  const liked = comment.like?.includes(user._id);

  return (
    <div className="flex flex-col justify-center mr-3">
      {liked ? (
        <BsHeartFill
          className="text-[1.4em] cursor-pointer text-[#ff3040]"
          onClick={() => handleLikeComment(comment._id)}
        />
      ) : (
        <BsHeart
          className="text-[1.4em] cursor-pointer"
          onClick={() => handleLikeComment(comment._id)}
        />
      )}
    </div>
  );
};

export default LikeComments