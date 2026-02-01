import reducer, { resetMessageState, clearMessages, sendMessage, getMessagesByConversation } from "./messageSlice";

describe("messageSlice", () => {
    it("deve retornar o estado inicial", () => {
        const state = reducer(undefined, { type: "@@INIT" });

        expect(state).toEqual({
            messages: [],
            page: 1,
            totalPages: 1,
            loading: false,
            error: null,
            success: false,
        });
    });


    it("deve resetar loading, error e success", () => {
        const initialState = {
            messages: [{ text: "oi" }],
            loading: true,
            error: "Erro",
            success: true,
        };

        const state = reducer(initialState, resetMessageState());

        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.success).toBe(false);
        expect(state.messages).toHaveLength(1);
    });


    it("deve limpar as mensagens", () => {
        const initialState = {
            messages: [{ text: "msg 1" }, { text: "msg 2" }],
            loading: false,
            error: null,
            success: false,
        };

        const state = reducer(initialState, clearMessages());

        expect(state.messages).toEqual([]);
    });


    it("deve lidar com sendMessage.pending", () => {
        const action = { type: sendMessage.pending.type };

        const state = reducer(undefined, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
    });


    it("deve lidar com sendMessage.fulfilled", () => {
        const message = {
            _id: "1",
            text: "Mensagem enviada",
            conversationId: "123",
        };

        const action = {
            type: sendMessage.fulfilled.type,
            payload: message,
        };

        const state = reducer(undefined, action);

        expect(state.loading).toBe(false);
        expect(state.success).toBe(true);
        expect(state.messages).toContainEqual(message);
    });


    it("deve lidar com sendMessage.rejected", () => {
        const action = {
            type: sendMessage.rejected.type,
            payload: "Erro ao enviar mensagem.",
        };

        const state = reducer(undefined, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe("Erro ao enviar mensagem.");
    });


    it("deve salvar mensagens ao buscar conversa", () => {
        const messages = [
            { _id: "1", text: "Oi" },
            { _id: "2", text: "Tudo bem?" },
        ];

        const action = {
            type: getMessagesByConversation.fulfilled.type,
            payload: { messages, page: 1, totalPages: 1 },
        };

        const state = reducer(undefined, action);

        expect(state.loading).toBe(false);
        expect(state.success).toBe(true);
        expect(state.messages).toEqual(messages);
        expect(state.page).toBe(1);
        expect(state.totalPages).toBe(1);
    });


    it("deve lidar com erro ao buscar mensagens", () => {
        const action = {
            type: getMessagesByConversation.rejected.type,
            payload: "Erro ao buscar mensagens.",
        };

        const state = reducer(undefined, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe("Erro ao buscar mensagens.");
    });
});