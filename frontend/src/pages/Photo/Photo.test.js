import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Photo from "./Photo";
import { renderWithProviders } from "../../utils/renderWithProviders";
import * as photoSlice from "../../slices/photoSlice";
import * as commentSlice from "../../slices/commentSlice";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({ id: "photo123" }),
}));

describe("Photo Page", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.spyOn(photoSlice, "getPhoto").mockImplementation(() => ({
      type: "photo/getPhoto",
    }));

    jest.spyOn(photoSlice, "like").mockImplementation((id) => ({
      type: "photo/like",
      payload: id,
    }));

    jest.spyOn(commentSlice, "getCommentsByPhotoId").mockImplementation(() => ({
      type: "comment/getCommentsByPhotoId",
    }));

    jest.spyOn(commentSlice, "commentPhoto").mockImplementation((data) => ({
      type: "comment/commentPhoto",
      payload: data,
    }));
  });

  const renderPhoto = (customState = {}) =>
    renderWithProviders(<Photo />, {
      preloadedState: {
        auth: {
          user: { _id: "user1", name: "Carlos" },
          token: null,
          loading: false,
          error: null,
          success: false,
          message: null,
        },
        user: {
          user: null,
          loading: false,
          error: null,
          message: null,
        },
        photo: {
          photo: { likes: [] },
          photos: [],
          likes: [],
          loading: false,
          error: null,
          success: false,
          message: null,
          ...customState.photo,
        },
        comments: {
          comments: [],
          loading: false,
          error: null,
          message: null,
          ...customState.comments,
        },
      },
    });

  it("exibe loading quando foto ainda não foi carregada", () => {
    renderPhoto({
      photo: { photo: null, loading: true },
    });

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renderiza formulário de comentário quando foto carrega", async () => {
    renderPhoto({
      photo: {
        photo: { _id: "photo123", likes: []},
        loading: false,
      },
    });

    expect(
      await screen.findByPlaceholderText(/insira o seu comentário/i)
    ).toBeInTheDocument();
  });

  it("despacha commentPhoto ao enviar comentário", async () => {
    const user = userEvent.setup();

    renderPhoto({
      photo: {
        photo: { _id: "photo123", likes: []},
        loading: false,
      },
    });

    await user.type(
      screen.getByPlaceholderText(/insira o seu comentário/i),
      "Comentário teste"
    );

    await user.click(
      screen.getByRole("button", { name: /enviar/i })
    );

    expect(commentSlice.commentPhoto).toHaveBeenCalledWith({
      id: "photo123",
      comment: "Comentário teste",
      replyTo: null,
    });
  });
});