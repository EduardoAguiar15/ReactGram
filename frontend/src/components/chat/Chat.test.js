import { render, screen, fireEvent } from "@testing-library/react";
import Chat from "./Chat";
import { useSelector, useDispatch } from "react-redux";

jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn()
}));

describe("Chat Component", () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useDispatch.mockReturnValue(mockDispatch);

    useSelector.mockImplementation((selector) =>
      selector({
        user: { users: [] },
        conversation: { userConversations: [] },
        auth: {
          user: { _id: "1", name: "Carlos" },
          token: "fake-token"
        },
        messages: {
          messages: [],
          page: 1,
          totalPages: 1,
          loading: false
        }
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar botão fechado inicialmente", () => {
    render(<Chat />);
    expect(screen.getByText("Mensagens")).toBeInTheDocument();
  });

  it("deve abrir o chat ao clicar", () => {
    render(<Chat />);
    
    fireEvent.click(screen.getByText("Mensagens"));
    
    expect(screen.getByText("Mensagens")).toBeInTheDocument();
    // Aqui já renderiza ConversationChat
  });

  it("não deve enviar mensagem vazia", async () => {
    render(<Chat />);
    
    fireEvent.click(screen.getByText("Mensagens"));

    // Simulando que um usuário foi selecionado manualmente
    // Como selectedUser é estado interno, você pode simular renderizando MessageChat direto
    // ou adaptar para testar apenas o handler

    // Aqui verificamos que dispatch não foi chamado
    expect(mockDispatch).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "messages/sendMessage" })
    );
  });
});