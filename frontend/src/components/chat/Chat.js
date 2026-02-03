import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageIcon from "../../assets/Message.svg";

import { getAllUsers } from "../../slices/userSlice";
import { conversationBetween, userConversations } from "../../slices/conversationSlice";
import { getMessagesByConversation, sendMessage, clearMessages } from "../../slices/messageSlice";

import ConversationChat from "./ConversationChat";
import MessageChat from "./MessageChat";

const Chat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [conversationId, setConversationId] = useState(null);

    const messagesEndRef = useRef(null);
    const chatRef = useRef(null);

    const dispatch = useDispatch();

    const { users: allUsers } = useSelector(state => state.user);
    const { userConversations: conversations } = useSelector(state => state.conversation);
    const { user, token } = useSelector(state => state.auth);
    const { messages, page, totalPages, loading } = useSelector(state => state.messages);

    const orderedMessages = [...messages].sort(
        (messageA, messageB) => new Date(messageA.createdAt) - new Date(messageB.createdAt)
    );

    const toggleChat = () => {
        setIsOpen(!isOpen);
        setSelectedUser(null);
    };

    useEffect(() => {
        if (token) {
            dispatch(getAllUsers(token));
            dispatch(userConversations(token));
        }
    }, [token, dispatch]);

    useEffect(() => {
        if (!selectedUser || !token) return;

        dispatch(clearMessages());

        (async () => {
            const res = await dispatch(
                conversationBetween({ token, userId: selectedUser._id })
            );

            if (res.payload?._id) {
                setConversationId(res.payload._id);
                dispatch(
                    getMessagesByConversation({
                        token,
                        conversationId: res.payload._id,
                        page: 1
                    })
                );
            }
        })();
    }, [selectedUser, token, dispatch]);

    useEffect(() => {
        if (page === 1) {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, page]);

    const loadMoreMessages = () => {
        if (loading || page >= totalPages) return;

        dispatch(
            getMessagesByConversation({
                token,
                conversationId,
                page: page + 1
            })
        );
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim()) return;

        await dispatch(
            sendMessage({
                token,
                receiverId: selectedUser._id,
                text: newMessage.trim()
            })
        );

        setNewMessage("");
        dispatch(userConversations(token));
    };

    return (
        <div
            onClick={!isOpen ? toggleChat : undefined}
            className={`fixed bottom-8 right-8 bg-[rgb(49,49,49)] text-white shadow-lg transition-all duration-300 overflow-hidden ${isOpen
                ? "w-[350px] h-[500px] rounded-xl px-6 py-4"
                : "w-[251px] h-[56px] rounded-full px-[50px] cursor-pointer"
                }`}
        >
            {!isOpen && (
                <div className="h-full flex items-center gap-5">
                    <img src={MessageIcon} alt="Mensagens" />
                    <p>Mensagens</p>
                </div>
            )}

            {isOpen && !selectedUser && (
                <ConversationChat
                    conversations={conversations}
                    allUsers={allUsers}
                    currentUser={user}
                    setSelectedUser={setSelectedUser}
                    toggleChat={toggleChat}
                />
            )}

            {isOpen && selectedUser && (
                <MessageChat
                    chatRef={chatRef}
                    messages={orderedMessages}
                    currentUser={user}
                    selectedUser={selectedUser}
                    newMessage={newMessage}
                    setNewMessage={setNewMessage}
                    handleSendMessage={handleSendMessage}
                    messagesEndRef={messagesEndRef}
                    loadMoreMessages={loadMoreMessages}
                    loading={loading}
                    page={page}
                    totalPages={totalPages}
                    setSelectedUser={setSelectedUser}
                    toggleChat={toggleChat}
                />
            )}
        </div>
    );
};

export default Chat;