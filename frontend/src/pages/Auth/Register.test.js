import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Register from "./Register";
import { renderWithProviders } from "../../utils/renderWithProviders";
import * as authSlice from "../../slices/authSlice";

const renderRegister = () =>
  renderWithProviders(<Register />, {
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

describe("Register Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(authSlice, "register").mockImplementation((user) => ({
      type: "auth/register",
      payload: user,
    }));

    jest.spyOn(authSlice, "reset").mockImplementation(() => ({
      type: "auth/reset",
    }));
  });

  it("renderiza campos de nome, email, senha e confirmar senha", () => {
    renderRegister();

    expect(screen.getByPlaceholderText(/nome/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e-?mail/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^senha$/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirme a senha/i)
    ).toBeInTheDocument();
  });

  it("despacha register com os dados corretos ao submeter o formulário", async () => {
    const user = userEvent.setup();
    renderRegister();

    await user.type(screen.getByPlaceholderText(/nome/i), "Teste");
    await user.type(
      screen.getByPlaceholderText(/e-?mail/i),
      "teste@email.com"
    );
    await user.type(screen.getByPlaceholderText(/^senha$/i), "123456");
    await user.type(
      screen.getByPlaceholderText(/confirme a senha/i),
      "123456"
    );

    await user.click(
      screen.getByRole("button", { name: /cadastrar/i })
    );

    expect(authSlice.register).toHaveBeenCalledWith({
      name: "Teste",
      email: "teste@email.com",
      password: "123456",
      confirmPassword: "123456",
    });
  });
});