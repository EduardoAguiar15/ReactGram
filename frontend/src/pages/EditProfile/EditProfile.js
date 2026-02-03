import { uploads } from "../../utils/config";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

// Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

// Components
import Message from '../../components/feedback/Message';
import EmojiInput from "../../components/post/EmojiInput";

const EditProfile = () => {
    const dispatch = useDispatch()

    const { user, message, error, loading } = useSelector((state) => state.user);

    const [bio, setBio] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profileImage, setProfileImage] = useState("")
    const [previewImage, setPreviewImage] = useState("")
    const [zoomImage, setZoomImage] = useState(null);

    useEffect(() => {
        dispatch(profile());
    }, [dispatch]);

    useEffect(() => {

        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            setBio(user.bio || "");
        }
    }, [user])
    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            name
        }

        if (profileImage) {
            userData.profileImage = profileImage
        }

        if (bio) {
            userData.bio = bio;
        }

        if (password) {
            userData.password = password;
        }

        const formData = new FormData();

        Object.keys(userData).forEach((key) => {
            formData.append(key, userData[key]);
        });

        await dispatch(updateProfile(formData));

        setTimeout(() => {
            dispatch(resetMessage())
        }, 2000)
    };

    const handleFile = (e) => {
        const image = e.target.files[0]

        setPreviewImage(image);

        setProfileImage(image);
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
            <div className="border border-[#363636] bg-[#000] py-6 px-8 max-w-[40%] my-8 mx-auto text-center rounded-md">
                <h2>Edite seus dados</h2>
                <p className='text-[#ccc] mb-4'>Adicione uma imagem de perfil e conte mais sobre você...</p>
                {(user && (user.profileImage || previewImage)) && (
                    <div className="flex justify-center w-full">
                        <img className="w-[150px] h-[150px] rounded-full mb-4 object-cover cursor-pointer"
                            src={
                                previewImage ? URL.createObjectURL(previewImage) : `${uploads}/users/${user.profileImage}`
                            }
                            alt={user.name}
                            onClick={() => setZoomImage(`${uploads}/users/${user.profileImage}`)}
                        />
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder='Nome' onChange={(e) => setName(e.target.value)} value={name || ""} />
                    <input type="email" placeholder='E-mail' disabled value={email || ""} />
                    <label>
                        <span>Imagem do Perfil:</span>
                        <input type="file" onChange={handleFile} />
                    </label>
                    <label>
                        <span>Bio:</span>
                        <EmojiInput
                            placeholder="Descrição do perfil"
                            inputClassName="w-full"
                            pickerWidth={340}
                            pickerHeight={150}
                            value={bio || ""}
                            onChange={(newValue) => setBio(newValue)}
                            pickerPositionClass="right-1/2 translate-x-[77%] top-14"
                        />
                    </label>
                    <label>
                        <span>Quer alterar sua senha?</span>
                        <input type="password" placeholder="Digite sua nova senha" onChange={(e) => setPassword(e.target.value)} value={password || ""} />
                    </label>
                    {!loading && <input type='submit' value='Atualizar' />}
                    {loading && <input type='submit' value='Aguarde...' disabled />}
                    {error && <Message msg={error} type='error' />}
                    {message && <Message msg={message} type="success" />}
                </form>
            </div>
        </>
    )
}

export default EditProfile;