import reducer, { resetMessage, publishPhoto, deletePhoto, updatePhoto, getPhotos, getUserPhotos, searchPhotos, getPhoto, like } from "./photoSlice";


describe("photoSlice", () => {
    it("deve retornar o estado inicial", () => {
        const state = reducer(undefined, { type: "@@INIT" });

        expect(state).toEqual({
            photo: { likes: [] },
            photos: [],
            error: false,
            success: false,
            loading: false,
            message: null,
        });
    });


    it("deve resetar a mensagem", () => {
        const initialState = {
            photos: [],
            photo: {},
            error: false,
            success: true,
            loading: false,
            message: "Mensagem qualquer",
        };

        const state = reducer(initialState, resetMessage());

        expect(state.message).toBeNull();
    });


    it("deve publicar uma foto corretamente", () => {
        const initialState = {
            photos: [],
            photo: {},
            error: false,
            success: false,
            loading: false,
            message: null,
        };

        const newPhoto = {
            _id: "1",
            title: "Nova foto",
            likes: [],
        };

        const action = {
            type: publishPhoto.fulfilled.type,
            payload: newPhoto,
        };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.success).toBe(true);
        expect(state.error).toBeNull();
        expect(state.photo).toEqual(newPhoto);
        expect(state.photos[0]).toEqual(newPhoto);
        expect(state.message).toBe("Foto publicada com sucesso!");
    });


    it("deve deletar uma foto corretamente", () => {
        const initialState = {
            photos: [
                { _id: "1", title: "Foto 1" },
                { _id: "2", title: "Foto 2" },
            ],
            photo: {},
            error: false,
            success: false,
            loading: false,
            message: null,
        };

        const action = {
            type: deletePhoto.fulfilled.type,
            payload: {
                id: "1",
                message: "Foto deletada com sucesso",
            },
        };

        const state = reducer(initialState, action);

        expect(state.photos).toHaveLength(1);
        expect(state.photos[0]._id).toBe("2");
        expect(state.message).toBe("Foto deletada com sucesso");
    });


    it("deve atualizar o título da foto corretamente", () => {
        const initialState = {
            photos: [
                { _id: "1", title: "Antigo título" },
            ],
            photo: {},
            error: false,
            success: false,
            loading: false,
            message: null,
        };

        const action = {
            type: updatePhoto.fulfilled.type,
            payload: {
                photo: {
                    _id: "1",
                    title: "Novo título",
                },
                message: "Foto atualizada",
            },
        };

        const state = reducer(initialState, action);

        expect(state.photos[0].title).toBe("Novo título");
        expect(state.message).toBe("Foto atualizada");
    });


    it("deve salvar todas as fotos no getPhotos.fulfilled", () => {
        const photos = [
            { _id: "1", title: "Foto 1" },
            { _id: "2", title: "Foto 2" },
        ];

        const action = {
            type: getPhotos.fulfilled.type,
            payload: photos,
        };

        const state = reducer(undefined, action);

        expect(state.photos).toEqual(photos);
        expect(state.success).toBe(true);
        expect(state.loading).toBe(false);
    });


    it("deve salvar as fotos do usuário", () => {
        const userPhotos = [
            { _id: "1", title: "Foto usuário 1" },
        ];

        const action = {
            type: getUserPhotos.fulfilled.type,
            payload: userPhotos,
        };

        const state = reducer(undefined, action);

        expect(state.photos).toEqual(userPhotos);
        expect(state.success).toBe(true);
    });


    it("deve salvar as fotos retornadas da busca", () => {
        const searchResult = [
            { _id: "1", title: "Paisagem" },
        ];

        const action = {
            type: searchPhotos.fulfilled.type,
            payload: searchResult,
        };

        const state = reducer(undefined, action);

        expect(state.photos).toEqual(searchResult);
    });


    it("deve salvar a foto no getPhoto.fulfilled", () => {
        const mockPhoto = {
            _id: "123",
            title: "Foto teste",
            likes: [],
        };

        const action = {
            type: getPhoto.fulfilled.type,
            payload: mockPhoto,
        };

        const state = reducer(undefined, action);

        expect(state.loading).toBe(false);
        expect(state.photo).toEqual(mockPhoto);
        expect(state.success).toBe(true);
    });


    it("deve adicionar like corretamente", () => {
        const initialState = {
            photos: [
                { _id: "1", likes: [] },
            ],
            photo: { _id: "1", likes: [] },
            error: null,
            success: false,
            loading: false,
            message: null,
        };

        const action = {
            type: like.fulfilled.type,
            payload: {
                photoId: "1",
                userId: "user123",
                message: "A foto foi curtida.",
            },
        };

        const state = reducer(initialState, action);

        expect(state.photo.likes).toContain("user123");
        expect(state.photos[0].likes).toContain("user123");
    });


    it("deve remover o like se o usuário já tiver curtido", () => {
        const initialState = {
            photos: [
                { _id: "1", likes: ["user123"] },
            ],
            photo: { _id: "1", likes: ["user123"] },
            error: null,
            success: false,
            loading: false,
            message: null,
        };

        const action = {
            type: like.fulfilled.type,
            payload: {
                photoId: "1",
                userId: "user123",
                message: "Like removido.",
            },
        };

        const state = reducer(initialState, action);

        expect(state.photo.likes).not.toContain("user123");
        expect(state.photos[0].likes).not.toContain("user123");
    });
});