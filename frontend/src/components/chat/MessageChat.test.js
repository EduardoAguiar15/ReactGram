import { render, screen, fireEvent } from "@testing-library/react";
import MessageChat from "../../components/chat/MessageChat";

jest.mock("../../components/post/EmojiInput", () => () => (
    <input data-testid="emoji-input" />
));

describe("MessageChat Component", () => {

    const defaultProps = {
        messages: [],
        currentUser: { _id: "1" },
        selectedUser: { name: "Maria" },
        newMessage: "",
        setNewMessage: jest.fn(),
        handleSendMessage: jest.fn(),
        messagesEndRef: { current: null },
        setSelectedUser: jest.fn(),
        toggleChat: jest.fn(),
        loadMoreMessages: jest.fn(),
        loading: false,
        page: 1,
        totalPages: 1,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve exibir mensagem quando não houver mensagens", () => {
        render(<MessageChat {...defaultProps} />);

        expect(
            screen.getByText("Nenhuma mensagem ainda.")
        ).toBeInTheDocument();
    });

    it("deve renderizar mensagens corretamente", () => {
        const messages = [
            {
                _id: "1",
                text: "Olá",
                createdAt: new Date().toISOString(),
                sender: { _id: "2" },
            },
        ];

        render(
            <MessageChat
                {...defaultProps}
                messages={messages}
            />
        );

        expect(screen.getByText("Olá")).toBeInTheDocument();
        expect(screen.getByText("Maria")).toBeInTheDocument();
    });

    it("deve limpar usuário selecionado e mensagem ao clicar em Voltar", () => {
        const setSelectedUser = jest.fn();
        const setNewMessage = jest.fn();

        render(
            <MessageChat
                {...defaultProps}
                setSelectedUser={setSelectedUser}
                setNewMessage={setNewMessage}
            />
        );

        fireEvent.click(screen.getByText("Voltar"));

        expect(setSelectedUser).toHaveBeenCalledWith(null);
        expect(setNewMessage).toHaveBeenCalledWith("");
    });

    it("deve chamar handleSendMessage ao clicar em Enviar", () => {
        const handleSendMessage = jest.fn();

        render(
            <MessageChat
                {...defaultProps}
                handleSendMessage={handleSendMessage}
            />
        );

        fireEvent.click(screen.getByText("Enviar"));

        expect(handleSendMessage).toHaveBeenCalled();
    });

    it("deve carregar novas mensagens quando scroll estiver no topo", () => {
        const loadMoreMessages = jest.fn();

        render(
            <MessageChat
                {...defaultProps}
                loadMoreMessages={loadMoreMessages}
                page={1}
                totalPages={2}
                loading={false}
            />
        );

        const scrollContainer = screen.getByTestId("chat-scroll-container");

        Object.defineProperty(scrollContainer, "scrollTop", { value: 0 });
        Object.defineProperty(scrollContainer, "scrollHeight", { value: 500 });

        fireEvent.scroll(scrollContainer);

        expect(loadMoreMessages).toHaveBeenCalled();
    });
});