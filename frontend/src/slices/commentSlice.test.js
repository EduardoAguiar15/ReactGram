import reducer, { commentPhoto, getCommentsByPhotoId, getAllComments, likeComment, resetCommentsMessage } from "./commentSlice";

describe("commentSlice", () => {
    it("deve retornar o estado inicial", () => {
        const state = reducer(undefined, { type: "@@INIT" });

        expect(state).toEqual({
            comments: [],
            loading: false,
            error: null,
            message: null,
            success: false,
        });
    });


    it("deve publicar um comentário corretamente", () => {
        const initialState = {
            comments: [],
            loading: false,
            error: null,
            message: null,
            success: false,
        };

        const newComment = {
            _id: "1",
            comment: "Novo comentário",
            like: [],
        };

        const action = {
            type: commentPhoto.fulfilled.type,
            payload: {
                comment: newComment,
                message: "Comentário publicado com sucesso!",
            },
        };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBeNull();
        expect(state.success).toBe(true);
        expect(state.comments[0]).toEqual(newComment);
        expect(state.message).toBe("Comentário publicado com sucesso!");
    });




    it("deve salvar os comentários da foto", () => {
        const comments = [
            { _id: "1", comment: "Comentário 1" },
            { _id: "2", comment: "Comentário 2" },
        ];

        const action = {
            type: getCommentsByPhotoId.fulfilled.type,
            payload: comments,
        };

        const state = reducer(undefined, action);

        expect(state.comments).toEqual(comments);
        expect(state.success).toBe(true);
        expect(state.loading).toBe(false);
    });



    it("deve salvar todos os comentários", () => {
        const payload = {
            comments: [
                { _id: "1", comment: "Comentário A" },
            ],
        };

        const action = {
            type: getAllComments.fulfilled.type,
            payload,
        };

        const state = reducer(undefined, action);

        expect(state.comments).toEqual(payload.comments);
        expect(state.loading).toBe(false);
    });

    it("deve adicionar like corretamente", () => {
        const initialState = {
            comments: [
                { _id: "1", like: [] },
            ],
            loading: false,
            error: null,
            message: null,
            success: false,
        };

        const action = {
            type: likeComment.fulfilled.type,
            payload: {
                commentId: "1",
                userId: "123",
                message: "O comentário foi curtido.",
            },
        };

        const state = reducer(initialState, action);

        expect(state.comments[0].like).toContain("123");
    });


    it("deve remover o like se o usuário já tiver curtido", () => {
        const initialState = {
            comments: [
                { _id: "1", like: ["123"] },
            ],
            loading: false,
            error: null,
            message: null,
            success: false,
        };

        const action = {
            type: likeComment.fulfilled.type,
            payload: {
                commentId: "1",
                userId: "123",
                message: "O like foi removido do comentário.",
            },
        };

        const state = reducer(initialState, action);

        expect(state.comments[0].like).not.toContain("123");
    });


    it("deve resetar a mensagem", () => {
        const initialState = {
            comments: [],
            loading: false,
            error: null,
            message: "Mensagem qualquer",
            success: true,
        };

        const state = reducer(initialState, resetCommentsMessage());

        expect(state.message).toBeNull();
    });
});