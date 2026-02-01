import { Link } from "react-router-dom";

// hooks
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useResetComponentMessage } from '../../hooks/useResetComponentMessage';
import { useQuery } from "../../hooks/useQuery";

// components
import LikeContainer from '../../components/post/LikeContainer';
import PhotoItem from '../../components/post/PhotoItem';

// redux
import { searchPhotos, like } from "../../slices/photoSlice";

const Search = () => {

    const query = useQuery()
    const search = query.get("q");

    const dispatch = useDispatch()

    const resetMessage = useResetComponentMessage(dispatch)

    const { user } = useSelector(state => state.auth)
    const { photos, loading } = useSelector(state => state.photo)

    useEffect(() => {

        dispatch(searchPhotos(search))

    }, [dispatch, search])

    const handleLike = (photo) => {
        dispatch(like(photo._id))
        resetMessage()
    }

    if (loading) {
        return <p>Carregando...</p>
    }

    return <div className="w-[45%] mx-auto pt-8">
        <h2 className="text-center">Você está buscando por: <span className="font-semibold">{search}</span></h2>
        {photos && photos.map((photo, index) => (
            <div key={photo._id} className={`w-full ${index !== photos.length - 1 ? "border-b border-[#363636]" : ""}`}>
                <PhotoItem photo={photo} />
                <LikeContainer photo={photo} user={user} handleLike={handleLike} />
                <Link className="max-w-[80px] text-center block bg-[#0094f6] opacity-80 rounded px-2 py-2.5 font-medium cursor-pointer mt-2 mb-8 mx-0" to={`/photos/${photo._id}`}>Ver mais</Link>
            </div>
        ))}
        {photos && photos.length === 0 && (
            <h2 className="text-center">
                Não foram encontrados resultados para sua busca...
            </h2>
        )}
    </div>;
};

export default Search;