import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "./Login";
import { renderWithProviders } from "../../utils/renderWithProviders";
import * as authSlice from "../../slices/authSlice";

const renderLogin = () =>
  renderWithProviders(<Login />, {
    preloadedState: {
      auth: {
        user: null,
        token: null,
        loading: false,
        error: null,
        success: false,
        message: null,
      },
    },
  });

describe("Login Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(authSlice, "login").mockImplementation((user) => ({
      type: "auth/login",
      payload: user,
    }));

    jest.spyOn(authSlice, "reset").mockImplementation(() => ({
      type: "auth/reset",
    }));
  });

  it("renderiza campos de email e senha", () => {
    renderLogin();

    expect(screen.getByPlaceholderText(/e-?mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/senha/i)).toBeInTheDocument();
  });

  it("despacha login com email e senha ao submeter o formulário", async () => {
    const user = userEvent.setup();
    renderLogin();

    await user.type(
      screen.getByPlaceholderText(/e-?mail/i),
      "teste@email.com"
    );

    await user.type(
      screen.getByPlaceholderText(/senha/i),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /entrar/i })
    );

    expect(authSlice.login).toHaveBeenCalledTimes(1);
    expect(authSlice.login).toHaveBeenCalledWith({
      email: "teste@email.com",
      password: "123456",
    });
  });
});