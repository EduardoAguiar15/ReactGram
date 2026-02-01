import { configureStore } from "@reduxjs/toolkit";
import authReducer, { login, register } from "./authSlice";
import authService from "../services/authService";

jest.mock("../services/authService");

describe("authSlice thunks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("deve chamar a API e salvar usuário no login", async () => {
    const mockUser = {
      _id: "1",
      email: "teste@email.com",
      token: "123",
    };

    authService.login.mockResolvedValue(mockUser);

    const store = configureStore({
      reducer: { auth: authReducer },
    });

    await store.dispatch(
      login({ email: "teste@email.com", password: "123456" })
    );

    const state = store.getState().auth;

    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith({
      email: "teste@email.com",
      password: "123456",
    });

    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe("123");
    expect(state.success).toBe(true);
  });

  it("deve tratar erro retornado pela API", async () => {
    authService.login.mockResolvedValue({
      errors: ["Credenciais inválidas."],
    });

    const store = configureStore({
      reducer: { auth: authReducer },
    });

    await store.dispatch(
      login({ email: "errado@email.com", password: "123" })
    );

    const state = store.getState().auth;

    expect(state.error).toBe("Credenciais inválidas.");
    expect(state.user).toBeNull();
    expect(state.loading).toBe(false);
  });

  it("deve registrar usuário com sucesso", async () => {
    const mockUser = {
      _id: "1",
      email: "teste@email.com",
      token: "123",
    };

    authService.register.mockResolvedValue(mockUser);

    const store = configureStore({
      reducer: { auth: authReducer },
    });

    await store.dispatch(register(mockUser));

    const state = store.getState().auth;

    expect(state.success).toBe(true);
    expect(state.user).toEqual(mockUser);
  });
});