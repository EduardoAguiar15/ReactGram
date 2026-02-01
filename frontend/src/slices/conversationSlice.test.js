import reducer, { userConversations, conversationBetween, resetConversationState } from "./conversationSlice";

describe("conversationSlice", () => {
  it("deve retornar o estado inicial", () => {
    const state = reducer(undefined, { type: "@@INIT" });

    expect(state).toEqual({
      currentConversation: null,
      userConversations: [],
      loading: false,
      error: null,
      success: false,
    });
  });

  
  it("deve salvar a conversa atual", () => {
    const conversation = {
      _id: "1",
      users: ["1", "2"],
      messages: [],
    };

    const action = {
      type: conversationBetween.fulfilled.type,
      payload: conversation,
    };

    const state = reducer(undefined, action);

    expect(state.currentConversation).toEqual(conversation);
    expect(state.success).toBe(true);
    expect(state.loading).toBe(false);
  });

  
  it("deve salvar as conversas do usuário", () => {
    const conversations = [
      { _id: "1", users: ["1", "2"] },
      { _id: "2", users: ["1", "3"] },
    ];

    const action = {
      type: userConversations.fulfilled.type,
      payload: conversations,
    };

    const state = reducer(undefined, action);

    expect(state.userConversations).toEqual(conversations);
    expect(state.success).toBe(true);
    expect(state.loading).toBe(false);
  });

  
  it("deve lidar com erro ao buscar conversa", () => {
    const initialState = {
      currentConversation: null,
      userConversations: [],
      loading: true,
      error: null,
      success: false,
    };

    const action = {
      type: conversationBetween.rejected.type,
      payload: ["Erro ao buscar conversa"],
    };

    const state = reducer(initialState, action);

    expect(state.loading).toBe(false);
    expect(state.error).toEqual(["Erro ao buscar conversa"]);
    expect(state.currentConversation).toBeNull();
  });

  
  it("deve resetar o estado da conversa", () => {
    const initialState = {
      currentConversation: { _id: "1" },
      userConversations: [{ _id: "2" }],
      loading: true,
      error: ["Erro qualquer"],
      success: true,
    };

    const state = reducer(initialState, resetConversationState());

    expect(state.currentConversation).toBeNull();
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.success).toBe(false);
  });
});