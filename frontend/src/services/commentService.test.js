import commentService from "./commentService";

describe("commentService", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        global.fetch = jest.fn();
    });

    const token = "fake-token";
    const photoId = "photo123";
    const commentId = "comment123";

    /* ================= COMMENT ================= */

    it("deve chamar o endpoint correto para comentar uma foto", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        await commentService.comment(photoId, { comment: "Teste" }, token);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/comments/${photoId}`),
            expect.any(Object)
        );
    });

    it("deve enviar método POST, body e token corretamente ao comentar", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        const payload = { comment: "Comentário teste" };

        await commentService.comment(photoId, payload, token);

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify(payload),
                headers: expect.objectContaining({
                    Authorization: `Bearer ${token}`,
                }),
            })
        );
    });

    it("deve retornar os dados do comentário", async () => {
        const mockResponse = {
            comment: {
                _id: "1",
                comment: "Teste",
            },
        };

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });

        const res = await commentService.comment(photoId, { comment: "Teste" }, token);

        expect(res).toEqual(mockResponse);
    });

    /* ================= LIKE COMMENT ================= */

    it("deve chamar o endpoint correto para curtir comentário", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        await commentService.likeComment(commentId, token);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/comments/${commentId}/like`),
            expect.any(Object)
        );
    });

    it("deve enviar método PUT e token corretamente ao curtir comentário", async () => {
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({}),
        });

        await commentService.likeComment(commentId, token);

        expect(fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                method: "PUT",
                headers: expect.objectContaining({
                    Authorization: `Bearer ${token}`,
                }),
            })
        );
    });

    /* ================= GET ALL COMMENTS ================= */

    it("deve buscar todos os comentários", async () => {
        const mockComments = [{ _id: "1" }, { _id: "2" }];

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockComments,
        });

        const res = await commentService.getAllComments(token);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining("/comments/"),
            expect.any(Object)
        );

        expect(res).toEqual(mockComments);
    });

    /* ================= GET COMMENTS BY PHOTO ================= */

    it("deve buscar comentários por photoId", async () => {
        const mockComments = [{ _id: "1", comment: "Teste" }];

        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockComments,
        });

        const res = await commentService.getCommentsByPhotoId(photoId, token);

        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/comments/${photoId}`),
            expect.any(Object)
        );

        expect(res).toEqual(mockComments);
    });
});