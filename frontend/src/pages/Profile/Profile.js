import { uploads } from "../../utils/config";

// components
import Message from "../../components/feedback/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// hooks
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// redux
import { getUserDetails } from "../../slices/userSlice";
import { publishPhoto, resetMessage, getUserPhotos, deletePhoto, updatePhoto } from "../../slices/photoSlice";

const Profile = () => {

    const { id } = useParams()

    const dispatch = useDispatch()

    const { user, loading } = useSelector((state) => state.user)
    const { user: userAuth } = useSelector((state) => state.auth);
    const { photos, loading: loadingPhoto, message: messagePhoto, error: errorPhoto } = useSelector((state) => state.photo);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [editId, setEditId] = useState("");
    const [editImage, setEditImage] = useState("");
    const [editTitle, setEditTitle] = useState("");
    const [zoomImage, setZoomImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const newPhotoForm = useRef();
    const editPhotoForm = useRef();

    useEffect(() => {
        dispatch(getUserDetails(id));
        dispatch(getUserPhotos(id));
    }, [dispatch, id]);


    const handleFile = (e) => {
        const image = e.target.files[0]
        setImage(image);
    }

    const resetComponentMessage = () => {
        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);
    }

    const submitHandle = async (e) => {
        e.preventDefault();

        const photoData = {
            title,
            image
        }

        const formData = new FormData();
        Object.keys(photoData).forEach((key) => {
            formData.append(key, photoData[key]);
        });

        await dispatch(publishPhoto(formData));

        setTimeout(() => {
            dispatch(resetMessage());
        }, 2000);

        setTitle("");
        resetComponentMessage()
    };

    const handleDelete = (id) => {
        dispatch(deletePhoto(id));
        resetComponentMessage();
    };

    const toggleEditForm = () => {
        setIsEditing((prev) => !prev);
    };

    const handleUpdate = (e) => {
        e.preventDefault()

        const photoData = {
            title: editTitle,
            id: editId
        }

        dispatch(updatePhoto(photoData));
        resetComponentMessage();
    }

    const handleEdit = (photo) => {
        if (!isEditing) toggleEditForm();

        setEditId(photo._id);
        setEditTitle(photo.title);
        setEditImage(photo.image);
    };

    const handleCancelEdit = () => {
        toggleEditForm();
    };

    if (loading) {
        return <p>Carregando...</p>;
    }

    const closeZoom = () => setZoomImage(null);

    return (
        <>
            {zoomImage && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-[9999]"
                    onClick={closeZoom}
                >
                    <img
                        src={zoomImage}
                        alt="Zoom"
                        className="w-[550px] h-[550px] object-cover rounded-full shadow-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            <div className="w-1/2 mx-auto" id="profile">
                <div className="flex items-center flex-wrap p-4 border-b border-[#363636]">
                    {user && user.profileImage && (
                        <img className="w-[120px] h-[120px] rounded-full mr-8 object-cover cursor-pointer" src={`${uploads}/users/${user.profileImage}`} alt={user.name} onClick={() => setZoomImage(`${uploads}/users/${user.profileImage}`)} />
                    )}
                    <div className="flex flex-col gap-2">
                        <h2>{user?.name}</h2>
                        <p>{user?.bio}</p>
                    </div>
                </div>
                {userAuth && id === userAuth._id && (
                    <>
                        <div className={`p-4 border-b border-[#363636] ${isEditing ? 'hidden' : 'block'}`} ref={newPhotoForm}>
                            <h3>Compartilhe algum momento seu:</h3>
                            <form onSubmit={submitHandle}>
                                <label>
                                    <span>Título para a foto:</span>
                                    <input type="text" placeholder="Insira um título" onChange={(e) => setTitle(e.target.value)} value={title || ""} />
                                </label>
                                <label>
                                    <span>Imagem:</span>
                                    <input type="file" onChange={handleFile} />
                                </label>
                                {!loadingPhoto && <input type="submit" value="Postar" />}
                                {loadingPhoto && <input type="submit" disabled value="Aguarde..." />}
                            </form>
                        </div>
                        <div className={`mb-4 ${isEditing ? 'block' : 'hidden'}`} ref={editPhotoForm}>
                            <p>Editando:</p>
                            {editImage && (
                                <img className="w-full mb-4" src={`${uploads}/photos/${editImage}`} alt={editTitle} />
                            )}
                            <form onSubmit={handleUpdate}>
                                <input type="text" placeholder="Insira o novo título" onChange={(e) => setEditTitle(e.target.value)} value={editTitle || ""} />
                                <input type="submit" value="Atualizar" />
                                <button className="cancel-btn" onClick={handleCancelEdit}>Cancelar edição</button>
                            </form>
                        </div>
                        {errorPhoto && <Message msg={errorPhoto} type="error" />}
                        {messagePhoto && <Message msg={messagePhoto} type="success" />}
                    </>
                )}
                <div className="user-photos">
                    <h2 className="mt-5 mb-7 mr-0 ml-0">Fotos publicadas:</h2>
                    <div className="photos-container">
                        <div className="flex flex-row w-full flex-wrap justify-start ">
                            {Array.isArray(photos) && photos.map((photo) => (
                                <div className="flex flex-col justify-center w-[32%] m-[0.5%]" key={photo?._id}>
                                    {photo.image && (<img className="flex justify-center w-[99%] h-[320px] object-cover rounded-[3px]" src={`${uploads}/photos/${photo.image}`} alt={photo.title} />)}
                                    {userAuth && id === userAuth._id ? (
                                        <div className="flex justify-around p-[10px]">
                                            <Link to={`/photos/${photo._id}`}>
                                                <BsFillEyeFill className="cursor-pointer" />
                                            </Link>
                                            <BsPencilFill className="cursor-pointer" onClick={() => handleEdit(photo)} />
                                            <BsXLg className="cursor-pointer" onClick={() => handleDelete(photo._id)} />
                                        </div>
                                    ) : (<Link className="max-w-[80px] text-center block bg-[#0094f6] opacity-80 rounded px-1.5 py-2 font-light cursor-pointer mt-2 mb-8 mx-0" to={`/photos/${photo._id}`}>Ver Mais</Link>)}
                                </div>
                            ))}
                            {Array.isArray(photos) && photos.length === 0 && <p className="mb-5">Ainda não há fotos publicadas</p>}
                        </div>
                    </div>
                </div>
            </div >
        </>)
}

export default Profile;