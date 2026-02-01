import reducer, { getAllUsers, getUserDetails, updateProfile } from "./userSlice";

describe("userSlice", () => {
    it("deve retornar o estado inicial", () => {
        const state = reducer(undefined, { type: "@@INIT" });

        expect(state).toEqual({
            user: {},
            users: [],
            error: null,
            success: false,
            loading: false,
            message: null
        });
    });


    it("deve salvar os detalhes do usuário", () => {
        const userData = { _id: "1", name: "Usuário" };

        const action = {
            type: getUserDetails.fulfilled.type,
            payload: userData,
        };

        const state = reducer(undefined, action);

        expect(state.user).toEqual(userData);
        expect(state.success).toBe(true);
        expect(state.loading).toBe(false);
    });


    it("deve salvar a lista de usuários", () => {
        const users = [
            { _id: "1", name: "Usuário 1" },
            { _id: "2", name: "Usuário 2" },
        ];

        const action = {
            type: getAllUsers.fulfilled.type,
            payload: users,
        };

        const state = reducer(undefined, action);

        expect(state.users).toEqual(users);
        expect(state.success).toBe(true);
        expect(state.loading).toBe(false);
    });


    it("deve atualizar os dados do perfil do usuário corretamente", () => {
        const initialState = {
            user: { _id: "1", name: "Teste", email: "test@example.com", bio: "Teste Bio", profileImage: "image.jpg" },
            users: [],
            error: null,
            success: false,
            loading: false,
            message: null,
        };

        const action = {
            type: updateProfile.fulfilled.type,
            payload: {
                _id: "1",
                name: "Teste Atualizado",
                email: "testupdated@example.com",
                bio: "Nova bio",
                profileImage: "newimage.jpg"
            }
        };

        const state = reducer(initialState, action);

        expect(state.success).toBe(true);
        expect(state.user.name).toBe("Teste Atualizado");
        expect(state.user.email).toBe("testupdated@example.com");
        expect(state.user.bio).toBe("Nova bio");
        expect(state.user.profileImage).toBe("newimage.jpg");
        expect(state.message).toBe("Usuário atualizado com sucesso!");
    });


    it("deve lidar com erro ao atualizar perfil", () => {
        const initialState = {
            user: { _id: "1", name: "Usuário" },
            users: [],
            error: null,
            success: false,
            loading: true,
            message: null,
        };

        const action = {
            type: updateProfile.rejected.type,
            payload: "Erro ao atualizar",
        };

        const state = reducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe("Erro ao atualizar");
        expect(state.user).toEqual({});
    });
});