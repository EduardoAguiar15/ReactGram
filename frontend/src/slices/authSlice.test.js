import authReducer, { register, login, logout, reset } from "./authSlice";

// 🔹 mock do service
jest.mock("../services/authService");

describe("authSlice", () => {
  const initialState = {
    user: null,
    token: null,
    error: false,
    success: false,
    loading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("deve retornar o estado inicial", () => {
    const state = authReducer(undefined, { type: "@@INIT" });
    expect(state).toEqual(initialState);
  });

  /* ================= REGISTER ================= */

  it("register.pending deve ativar loading", () => {
    const state = authReducer(initialState, register.pending());

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
  });

  it("register.fulfilled deve salvar usuário e sucesso", () => {
    const user = { name: "Teste", email: "teste@email.com" };

    const state = authReducer(
      initialState,
      register.fulfilled(user)
    );

    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.error).toBeNull();
  });

  it("register.rejected deve salvar erro", () => {
    const error = "Erro ao registrar";

    const state = authReducer(
      initialState,
      register.rejected(null, null, null, error)
    );

    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe(error);
  });

  /* ================= LOGIN ================= */

  it("login.pending deve ativar loading", () => {
    const state = authReducer(initialState, login.pending());

    expect(state.loading).toBe(true);
    expect(state.error).toBe(false);
  });

  it("login.fulfilled deve salvar usuário, token e localStorage", () => {
    const user = {
      _id: "1",
      email: "teste@email.com",
      token: "123",
    };

    const state = authReducer(
      initialState,
      login.fulfilled(user)
    );

    expect(state.loading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.token).toBe("123");

    const storedUser = JSON.parse(localStorage.getItem("user"));
    expect(storedUser).toEqual(user);
  });

  it("login.rejected deve salvar erro", () => {
    const error = "Credenciais inválidas.";

    const state = authReducer(
      initialState,
      login.rejected(null, null, null, error)
    );

    expect(state.loading).toBe(false);
    expect(state.user).toBeNull();
    expect(state.error).toBe(error);
  });

  /* ================= LOGOUT ================= */

  it("logout.fulfilled deve limpar usuário", () => {
    const loggedState = {
      ...initialState,
      user: { email: "teste@email.com" },
      token: "123",
    };

    const state = authReducer(
      loggedState,
      logout.fulfilled()
    );

    expect(state.user).toBeNull();
    expect(state.success).toBe(true);
    expect(state.error).toBeNull();
  });

  /* ================= RESET ================= */

  it("reset deve limpar flags de estado", () => {
    const modifiedState = {
      ...initialState,
      loading: true,
      error: "erro",
      success: true,
    };

    const state = authReducer(modifiedState, reset());

    expect(state.loading).toBe(false);
    expect(state.error).toBe(false);
    expect(state.success).toBe(false);
  });
});