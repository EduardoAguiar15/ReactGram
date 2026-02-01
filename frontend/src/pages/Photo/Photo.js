import { uploads } from "../../utils/config";
import { Link } from "react-router-dom";

// Components
import Message from "../../components/feedback/Message";
import PhotoItem from "../../components/post/PhotoItem";
import LikeContainer from "../../components/post/LikeContainer";
import LikeComments from "../../components/post/LikeComments";
import EmojiInput from "../../components/post/EmojiInput";

// Hooks
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// Redux
import { commentPhoto, likeComment, getCommentsByPhotoId } from "../../slices/commentSlice";
import { getPhoto, like } from "../../slices/photoSlice";
const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { comments: reduxComments } = useSelector((state) => state.comments);
  const { photo, loading: photoLoading, error, message } = useSelector((state) => state.photo);

  const [comment, setComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [localComments, setLocalComments] = useState([]);
  const commentInputRef = useRef(null);

  // Carrega os dados da foto
  useEffect(() => {
    dispatch(getPhoto(id));
    dispatch(getCommentsByPhotoId(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (reduxComments?.length) {
      setLocalComments(reduxComments);
    }
  }, [reduxComments]);

  // Curtir comentário
  const handleLikeComment = (commentId) => {
    dispatch(likeComment(commentId));
    resetMessage();
  };

  // Curtir foto
  const handleLike = (photo) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  // Enviar comentário
  const handleComment = async (e) => {
    e.preventDefault();

    const commentData = { id, comment, replyTo };

    await dispatch(commentPhoto(commentData));
    dispatch(getCommentsByPhotoId(id));

    setComment("");
    setReplyTo(null);
    resetMessage();
  };

  if (photoLoading || !user || !photo) {
    return <p>Carregando...</p>;
  }

  const comments = localComments || [];
  const totalComments = comments.reduce(
    (acc, { replies = [] }) => acc + 1 + replies.length,
    0
  );

  return (
    <div className="w-1/2 mt-8 mx-auto text-center">
      <PhotoItem className="w-full" photo={photo} />
      <LikeContainer photo={photo} user={user} handleLike={handleLike} />

      <div className="my-4">
        {error && <Message msg={error} type="error" />}
        {message && <Message msg={message} type="success" />}
      </div>

      <div className="text-left">
        <h3 className="mb-5">Comentários: ({totalComments})</h3>
        <form
          className="mb-8 pb-4 border-b border-[#363636]"
          onSubmit={(e) => {
            e.preventDefault();
            handleComment(e);
          }}
        >
          <EmojiInput
            value={comment}
            onChange={setComment}
            placeholder="Insira o seu comentário..."
            inputRef={commentInputRef}
            inputClassName="w-full"
            wrapperClassName="mb-3"
            pickerWidth={500}
            pickerHeight={280}
            pickerPositionClass="right-1/2 translate-x-[73%] bottom-14"
          />

          <button type="submit" className="mb-4">
            Enviar
          </button>
        </form>

        {comments.length === 0 && <p>Não há comentários...</p>}

        {comments.map((comment) => {
          const userData =
            typeof comment.userId === "string"
              ? { _id: comment.userId, name: comment.userName }
              : comment.userId;

          if (!userData || !userData._id) {
            return null;
          }

          const replies = comment.replies || [];

          if (!replies || typeof replies !== "object") {
            return null;
          }

          return (
            <div className="comment mb-8" key={comment._id}>
              <div className="flex font-bold mb-6 justify-between">
                <div className="flex w-full">
                  <img
                    className="w-[50px] h-[50px] rounded-full object-cover mr-4"
                    src={`${uploads}/users/${userData.profileImage || "default.png"}`}
                    alt={userData?.name || comment.userName}
                  />
                  <div className="flex flex-col justify-between gap-[4px] w-full">
                    <div>
                      <Link to={`/users/${userData?._id || userData}`} className="inline hover:underline text-[#fff]">
                        <span className="hover:underline">
                          {userData?.name || comment.userName}
                        </span>
                      </Link>
                    </div>
                    <p className="font-light">{comment.comment}</p>
                    <div className="flex justify-between">
                      <div className="flex gap-1 items-center w-full mt-2">
                        <div className="w-[50px] h-px bg-gray-700 mr-2 my-2"></div>
                        <p className="bg-transparent text-[#a8a8a8] text-xs font-light">
                          Curtida(s): {comment.like?.length || 0}
                        </p>

                        <button
                          type="button"
                          className="bg-transparent text-[#a8a8a8] text-xs font-light cursor-pointer hover:underline"
                          onClick={() => {
                            setReplyTo(comment._id);
                            setComment(`@${userData?.name} `);

                            commentInputRef.current?.scrollIntoView({
                              behavior: "smooth", block: "center"
                            });
                            setTimeout(() => {
                              commentInputRef.current?.focus();
                            }, 500);
                          }}
                        >
                          Responder
                        </button>
                      </div>
                      <LikeComments
                        comment={comment}
                        user={user}
                        handleLikeComment={handleLikeComment}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {
                replies.length > 0 && (
                  <div className="ml-12 pl-4">
                    {replies.map((reply) => {
                      const replyUser = reply.userId;
                      return (
                        <div key={reply._id} className="flex mb-10 justify-between">
                          <div className="flex">
                            <img
                              className="w-[50px] h-[50px] rounded-full mr-3 object-cover"
                              src={`${uploads}/users/${replyUser.profileImage || "default.png"}`}
                              alt={replyUser.name}
                            />
                            <div className="flex flex-col gap-[4px]">
                              <Link to={`/users/${replyUser?._id || replyUser}`}>
                                <p className="font-bold text-sm hover:underline">
                                  {replyUser?.name || reply.userName}
                                </p>
                              </Link>
                              <p className="font-light text-sm">{reply.comment}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              }
            </div>
          );
        })}
      </div>
    </div >
  );
};

export default Photo;