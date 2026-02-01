import authService from "./authService";

describe("authService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    global.fetch = jest.fn();
  });

  /* ================= REGISTER ================= */

  it("deve chamar o endpoint correto de register", async () => {
    fetch.mockResolvedValue({
      json: async () => ({}),
    });

    await authService.register({});

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/register"),
      expect.any(Object)
    );
  });


  it("deve enviar método POST, headers e body corretamente no register", async () => {
    fetch.mockResolvedValue({
      json: async () => ({}),
    });

    const payload = {
      email: "teste@email.com",
      password: "123456",
    };

    await authService.register(payload);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/register"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(payload),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );
  });


  it("deve salvar usuário no localStorage quando o register retornar _id", async () => {
    const mockUser = {
      _id: "1",
      email: "teste@email.com",
      token: "123",
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    await authService.register({ email: mockUser.email, password: "123456" });

    const storedUser = JSON.parse(localStorage.getItem("user"));
    expect(storedUser).toEqual(mockUser);
  });


  /* ================= LOGIN ================= */

  it("deve chamar o endpoint correto de login", async () => {
    fetch.mockResolvedValue({
      json: async () => ({}),
    });

    await authService.login({});

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("/users/login"),
      expect.any(Object)
    );
  });


  it("deve salvar usuário no localStorage quando o login retornar _id", async () => {
    const mockUser = {
      _id: "1",
      email: "teste@email.com",
      token: "123",
    };

    fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    await authService.login({ email: mockUser.email, password: "123456" });

    const storedUser = JSON.parse(localStorage.getItem("user"));
    expect(storedUser).toEqual(mockUser);
  });

  /* ================= LOGOUT ================= */

  it("deve remover usuário do localStorage no logout", () => {
    localStorage.setItem(
      "user",
      JSON.stringify({ email: "teste@email.com" })
    );

    authService.logout();

    expect(localStorage.getItem("user")).toBeNull();
  });
});