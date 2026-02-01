import messageService from "./messageService";

describe("messageService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it("deve chamar sendMessage com POST, token, receiverId e text", async () => {
        const mockResponse = { id: "1", text: "Olá" };
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        const token = "fake-token";
        const receiverId = "receiver123";
        const text = "Olá";
        const res = await messageService.sendMessage(token, receiverId, text);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/messages"),
            expect.objectContaining({
                method: "POST",
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
                body: JSON.stringify({ receiverId, text }),
            })
        );
        expect(res).toEqual(mockResponse);
    });

    it("deve chamar getMessagesByConversation com GET, token e conversationId", async () => {
        const mockResponse = [{ id: "1", text: "Olá" }];
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        const token = "fake-token";
        const conversationId = "conv123";
        const res = await messageService.getMessagesByConversation(token, conversationId);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/messages/${conversationId}`),
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
        expect(res).toEqual(mockResponse);
    });

    it("deve retornar errors quando sendMessage falhar", async () => {
        fetch.mockRejectedValue(new Error("Network error"));
        const res = await messageService.sendMessage("fake-token", "receiver123", "Olá");
        expect(res.errors).toBeDefined();
    });

    it("deve retornar errors quando getMessagesByConversation falhar", async () => {
        fetch.mockRejectedValue(new Error("Network error"));
        const res = await messageService.getMessagesByConversation("fake-token", "conv123");
        expect(res.errors).toBeDefined();
    });
});