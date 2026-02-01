import React, { useRef, useEffect } from "react";
import { BsXLg } from "react-icons/bs";
import chatImage from "../../assets/chat.jpg";
import EmojiInput from "../post/EmojiInput";

const MessageChat = ({ messages, currentUser, selectedUser, newMessage, setNewMessage, handleSendMessage, messagesEndRef, setSelectedUser, toggleChat, loadMoreMessages, loading, page, totalPages }) => {

    const chatRef = useRef(null);
    const prevScrollHeightRef = useRef(0);

    const handleScroll = () => {
        if (!chatRef.current) return;

        if (
            chatRef.current.scrollTop === 0 &&
            !loading &&
            page < totalPages
        ) {
            prevScrollHeightRef.current = chatRef.current.scrollHeight;
            loadMoreMessages();
        }
    };

    useEffect(() => {
        if (!chatRef.current) return;

        if (page > 1) {
            const newScrollHeight = chatRef.current.scrollHeight;
            const diff = newScrollHeight - prevScrollHeightRef.current;

            chatRef.current.scrollTop = diff;
        }
    }, [messages, page]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex justify-between">
                <button onClick={() => { setSelectedUser(null); setNewMessage(""); }} className="text-sm text-gray-300 self-start">Voltar</button>
                <div>
                    <BsXLg onClick={toggleChat} className="cursor-pointer h-full w-5" />
                </div>
            </div>

            <div
                ref={chatRef}
                onScroll={handleScroll}
                className="p-4 bg-gray-800 rounded-lg flex flex-col h-[350px] overflow-y-auto scrollbar scrollbar-thumb-scroll-thumb scrollbar-track-scroll-track bg-cover"
                style={{ backgroundImage: `url(${chatImage})` }}
            >
                {messages.length > 0 ? messages.map((msg, index) => {
                    const msgDate = new Date(msg.createdAt);
                    let msgDay = msgDate.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" }).replace(/\./g, '');
                    const prevMsg = messages[index - 1];
                    const showDate =
                        !prevMsg ||
                        new Date(prevMsg.createdAt).toDateString() !==
                        new Date(msg.createdAt).toDateString();
                    const isCurrentUser = msg.sender?._id === currentUser?._id;

                    return (
                        <React.Fragment key={msg._id}>
                            {showDate && (
                                <div className="flex flex-col items-center">
                                    <div className="flex flex-col w-[32%] p-[1px] rounded-md bg-[#032025] text-center text-gray-400 text-[0.75rem] my-2">{msgDay}</div>
                                </div>
                            )}
                            <div className={`pt-1 pb-1 pl-2 pr-2 my-1 rounded-lg max-w-[100%] ${isCurrentUser ? "bg-blue-600 self-end text-right" : "bg-gray-700 self-start text-left"}`}>
                                {!isCurrentUser && <p className="text-left text-lime-600 text-[0.70rem] mb-[0.15rem]">{selectedUser.name}</p>}
                                <p className="text-white text-[0.8rem] text-justify break-words">{msg.text}</p>
                                <small className="text-gray-400 text-[0.7rem] flex justify-end">{new Date(msg.createdAt).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</small>
                            </div>
                        </React.Fragment>
                    );
                }) : <p className="text-gray-400 italic">Nenhuma mensagem ainda.</p>}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex items-center gap-2 mt-2">
                <EmojiInput
                    emojiSize={22}
                    value={newMessage}
                    onChange={setNewMessage}
                    placeholder="Mensagem..."
                    onEnter={handleSendMessage}
                    inputClassName="w-full bg-gray-700 text-white px-3 py-2 rounded-lg outline-none m-0"
                    wrapperClassName="w-[210px]"
                    buttonClassName="right-1 top-[50%]"
                    pickerWidth={287}
                    pickerHeight={150}
                    pickerPositionClass="right-1/2 translate-x-[64%] bottom-14"
                />
                <button
                    onClick={handleSendMessage}
                    className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 flex flex-col justify-center"
                >
                    Enviar
                </button>

            </div>
        </div>
    );
};

export default MessageChat;