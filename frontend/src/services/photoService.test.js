import photoService from './photoService';

describe("photoService.publishPhoto", () => {
    const mockData = { title: "Minha foto" };
    const mockToken = "token123";

    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    it("deve retornar dados ao publicar foto com sucesso", async () => {
        const mockResponse = { id: "1", title: "Minha foto" };

        fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await photoService.publishPhoto(mockData, mockToken);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockResponse);
    });

    it("deve retornar erro ao falhar na publicação", async () => {
        fetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ errors: ["Erro ao publicar foto de usuário"] }),
        });

        const result = await photoService.publishPhoto(mockData, mockToken);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ errors: ["Erro ao publicar foto de usuário"] });
    });

    it("deve retornar erro ao lançar exceção", async () => {
        fetch.mockImplementationOnce(() => Promise.reject(new Error("Falha na rede")));

        const result = await photoService.publishPhoto(mockData, mockToken);

        expect(fetch).toHaveBeenCalledTimes(1);
        expect(result).toEqual({ errors: ["Erro ao publicar foto"] });
    });
});