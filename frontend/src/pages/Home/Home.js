// Components
import LikeContainer from '../../components/post/LikeContainer';
import PhotoItem from '../../components/post/PhotoItem';
import { Link } from "react-router-dom";

// hooks
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useResetComponentMessage } from "../../hooks/useResetComponentMessage";

// Redux
import { getPhotos, like } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();
  const resetMessage = useResetComponentMessage(dispatch);

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  const handleLike = (photo) => {
    dispatch(like(photo._id));
    resetMessage();
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  const photosArray = Array.isArray(photos) ? photos : [];

  return (
    <div className="w-[45%] mx-auto pt-8 px-2.5 py-2">
      {photosArray.length > 0 ? (
        photosArray.map((photo, index) => (
          <div className={`w-full ${index !== photosArray.length - 1 ? "border-b border-[#363636]" : ""}`} key={photo._id}>
            <PhotoItem photo={photo} />
            <LikeContainer photo={photo} user={user} handleLike={handleLike} />
            <Link
              className="max-w-[80px] text-center block bg-[#0094f6] opacity-80 rounded px-2 py-2.5 font-medium cursor-pointer mt-2 mb-8 mx-0"
              to={`/photos/${photo._id}`}
            >
              Ver mais
            </Link>
          </div>
        ))
      ) : (
        <h2 className="text-center text-[#0094f6]">
          Ainda não há fotos publicadas,{" "}
          {user && <Link to={`/users/${user._id}`}>clique aqui</Link>}
        </h2>
      )}
    </div>
  );
};

export default Home;