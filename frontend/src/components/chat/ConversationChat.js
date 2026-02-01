import { BsXLg } from "react-icons/bs";
import { uploads } from "../../utils/config";
import MessageIcon from "../../assets/Message.svg";

const ConversationChat = ({ conversations, allUsers, currentUser, setSelectedUser, toggleChat }) => {
    const chatList = Array.isArray(conversations)
        ? conversations
            .map(chat => {
                const otherUser = chat.senderId?._id === currentUser?._id ? chat.receiverId : chat.senderId;
                return { _id: otherUser?._id, name: otherUser?.name, profileImage: otherUser?.profileImage };
            })
            .filter(user => user && user._id && user._id !== currentUser?._id)
        : [];

    const remainingUsers = Array.isArray(allUsers)
        ? allUsers.filter(user => user._id !== currentUser?._id && !chatList.some(chatUser => chatUser._id === user._id))
            .map(user => ({ _id: user._id, name: user.name, profileImage: user.profileImage }))
        : [];

    return (
        <>
            <div className="flex items-center gap-6 relative bottom-[-15px]">
                <img src={MessageIcon} alt="Ícone de mensagem" />
                <p className="text-white">Mensagens</p>
                <div className="ml-auto text-white text-xl">
                    <BsXLg onClick={toggleChat} className="cursor-pointer" />
                </div>
            </div>

            <div className="flex flex-col gap-7 transition-opacity duration-300 overflow-y-auto scrollbar scrollbar-thumb-scroll-thumb scrollbar-track-scroll-track mt-10">
                {[...chatList, ...remainingUsers].map(user => (
                    <div
                        key={user._id}
                        className="flex items-center gap-4 cursor-pointer hover:bg-[rgb(70,70,70)] p-2 rounded-lg"
                        onClick={() => setSelectedUser(user)}
                    >
                        <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} className="w-14 h-14 object-cover rounded-full" />
                        <p className="text-white">{user.name}</p>
                    </div>
                ))}
            </div>
        </>
    );
};

export default ConversationChat;