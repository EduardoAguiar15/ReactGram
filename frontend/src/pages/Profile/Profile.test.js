import { screen, fireEvent } from "@testing-library/react";
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

  const renderProfile = ({
    authUserId,
    profileUserId,
    photos = [],
  }) => {
    useParams.mockReturnValue({ id: profileUserId });

    return renderWithProviders(<Profile />, {
      preloadedState: {
        auth: {
          user: { _id: authUserId },
          loading: false,
        },
        user: {
          user: { _id: profileUserId, name: "Usuário" },
          loading: false,
        },
        photo: {
          photo: { likes: [] },
          photos,
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

  it("permite selecionar uma imagem", () => {
    renderProfile({
      authUserId: "1",
      profileUserId: "1",
    });

    const file = new File(["foto"], "foto.png", { type: "image/png" });

    const input = screen.getByLabelText(/imagem/i);

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(input.files[0]).toBe(file);
  });

  it("envia uma nova foto", () => {
    renderProfile({
      authUserId: "1",
      profileUserId: "1",
    });

    const file = new File(["foto"], "foto.png", { type: "image/png" });

    fireEvent.change(screen.getByLabelText(/imagem/i), {
      target: { files: [file] },
    });

    fireEvent.change(screen.getByLabelText(/título/i), {
      target: { value: "Minha foto" },
    });

    fireEvent.click(screen.getByDisplayValue("Postar"));

    expect(photoSlice.publishPhoto).toHaveBeenCalled();
  });

  it("renderiza fotos do usuário", () => {
    renderProfile({
      authUserId: "1",
      profileUserId: "1",
      photos: [
        {
          _id: "1",
          title: "Foto teste",
          image: "foto.png",
        },
      ],
    });

    expect(screen.getByAltText("Foto teste")).toBeInTheDocument();
  });

  it("permite deletar uma foto", () => {
    renderProfile({
      authUserId: "1",
      profileUserId: "1",
      photos: [
        {
          _id: "1",
          title: "Foto teste",
          image: "foto.png",
        },
      ],
    });

    const deleteButton = screen.getByTestId("delete-photo");

    fireEvent.click(deleteButton);

    expect(photoSlice.deletePhoto).toHaveBeenCalled();
  });
});