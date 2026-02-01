import conversationService from "./conversationService";

describe("conversationService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it("deve chamar getUserConversations com GET e token", async () => {
        const mockResponse = [{ id: "1", title: "Conversa 1" }];
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        const token = "fake-token";
        const res = await conversationService.getUserConversations(token);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/conversations"),
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
        expect(res).toEqual(mockResponse);
    });

    it("deve chamar getConversationBetween com GET, token e userId", async () => {
        const mockResponse = { id: "1", title: "Conversa 1" };
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        const token = "fake-token";
        const userId = "user123";
        const res = await conversationService.getConversationBetween(token, userId);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/conversations/${userId}`),
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
        expect(res).toEqual(mockResponse);
    });

    it("deve retornar errors quando getUserConversations falhar", async () => {
        fetch.mockRejectedValue(new Error("Network error"));
        const res = await conversationService.getUserConversations("fake-token");
        expect(res.errors).toBeDefined();
    });

    it("deve retornar errors quando getConversationBetween falhar", async () => {
        fetch.mockRejectedValue(new Error("Network error"));
        const res = await conversationService.getConversationBetween("fake-token", "user123");
        expect(res.errors).toBeDefined();
    });
});