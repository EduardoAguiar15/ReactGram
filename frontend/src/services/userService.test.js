import userService from "./userService";

describe("userService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    /* ================= PROFILE ================= */

    it("deve chamar profile com GET e token", async () => {
        fetch.mockResolvedValue({ json: async () => ({}) });

        await userService.profile({}, "fake-token");

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/profile"),
            expect.objectContaining({
                method: "GET",
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );

    });

    it("deve retornar errors quando fetch falhar", async () => {
        fetch.mockRejectedValue(new Error("Network error"));

        const res = await userService.profile({}, "fake-token");

        expect(res.errors).toBeDefined();
    });

    it("deve retornar os dados do usuário", async () => {
        const mockUser = { name: "Carlos" };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockUser,
        });

        const res = await userService.profile({}, "fake-token");

        expect(res).toEqual(mockUser);
    });

    /* ================= UPDATE PROFILE ================= */

    it("deve chamar o endpoint correto de updateProfile", async () => {
        fetch.mockResolvedValue({
            json: async () => ({}),
        });

        await userService.updateProfile({}, "fake-token");

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/"),
            expect.any(Object)
        );
    });

    it("deve enviar método PUT, body e token no updateProfile", async () => {
        const payload = { name: "Carlos" };

        fetch.mockResolvedValue({
            json: async () => ({}),
        });

        await userService.updateProfile(payload, "fake-token");

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: "PUT",
                body: payload,
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        )
    });

    /* ================= GET USER DETAILS ================= */

    it("deve chamar o endpoint correto de getUserDetails", async () => {
        fetch.mockResolvedValue({
            json: async () => ({}),
        });

        await userService.getUserDetails("123");

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/123"),
            expect.any(Object)
        );
    });

    it("deve usar método GET no getUserDetails", async () => {
        fetch.mockResolvedValue({
            json: async () => ({}),
        });

        await userService.getUserDetails("123");

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: "GET",
            })
        );
    });

    /* ================= GET ALL USERS ================= */

    it("deve chamar o endpoint correto de getAllUsers", async () => {
        fetch.mockResolvedValue({
            json: async () => ({}),
        });

        await userService.getAllUsers("fake-token");

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/users/all"),
            expect.any(Object)
        );
    });

    it("deve enviar token corretamente no getAllUsers", async () => {
        fetch.mockResolvedValue({
            json: async () => ({}),
        });

        await userService.getAllUsers("fake-token");

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: "Bearer fake-token",
                }),
            })
        );
    });
});