import { screen } from "@testing-library/react";
import Profile from "./Profile";
import { renderWithProviders } from "../../utils/renderWithProviders";
import * as userSlice from "../../slices/userSlice";
import * as photoSlice from "../../slices/photoSlice";
import { useParams } from "react-router-dom";

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useParams: jest.fn(),
}));

describe("Profile Page", () => {
beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(userSlice, "getUserDetails").mockImplementation(() => ({
        type: "user/getUserDetails",
    }));

    jest.spyOn(photoSlice, "getUserPhotos").mockImplementation(() => ({
        type: "photo/getUserPhotos",
    }));

    jest.spyOn(photoSlice, "publishPhoto").mockImplementation(() => ({
        type: "photo/publishPhoto",
    }));

    jest.spyOn(photoSlice, "resetMessage").mockImplementation(() => ({
        type: "photo/resetMessage",
    }));

    jest.spyOn(photoSlice, "deletePhoto").mockImplementation(() => ({
        type: "photo/deletePhoto",
    }));

    jest.spyOn(photoSlice, "updatePhoto").mockImplementation(() => ({
        type: "photo/updatePhoto",
    }));
});

const renderProfile = ({ authUserId, profileUserId }) => {
  useParams.mockReturnValue({ id: profileUserId });
        return renderWithProviders(<Profile />, {
            preloadedState: {
                auth: {
                    user: { _id: authUserId },
                    loading: false,
                    error: null,
                    success: false,
                    message: null,
                },
                user: {
                    user: { _id: profileUserId, name: "Usuário" },
                    users: [],
                    loading: false,
                    error: null,
                    success: false,
                    message: null,
                },
                photo: {
                    photo: { likes: [] },
                    photos: [],
                    likes: [],
                    loading: false,
                    error: null,
                    message: null,
                },
            },
        });
};

it("mostra formulário de nova foto quando usuário é dono do perfil", () => {
        renderProfile({
            authUserId: "1",
            profileUserId: "1",
        });

        expect(
            screen.getByText(/compartilhe algum momento seu/i)
        ).toBeInTheDocument();
    });

it("não mostra formulário quando usuário NÃO é dono do perfil", () => {
    renderProfile({
        authUserId: "1",
        profileUserId: "999",
    });

    expect(
        screen.queryByText(/compartilhe algum momento seu/i)
    ).not.toBeInTheDocument();
});
});