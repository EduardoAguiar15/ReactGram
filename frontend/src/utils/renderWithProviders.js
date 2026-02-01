import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import authReducer from "../slices/authSlice";
import photoReducer from "../slices/photoSlice";
import commentReducer from "../slices/commentSlice";
import userReducer from "../slices/userSlice";


const defaultPreloadedState = {
  auth: {
    user: null,
    token: null,
    loading: false,
    error: null,
    success: false,
    message: null,
  },
  user: {
    user: null,
    users: [],
    loading: false,
    error: null,
    message: null,
  },
  photo: {
    photos: [],
    photo: { likes: [] },
    loading: false,
    error: false,
    success: false,
    message: null,
  },
  comments: {
    comments: [],
    loading: false,
    error: null,
    message: null,
  },
};

export function renderWithProviders(
  ui,
  {
    route = "/",
    preloadedState = defaultPreloadedState,
    store = configureStore({
      reducer: {
        auth: authReducer,
        user: userReducer,
        photo: photoReducer,
        comments: commentReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {

  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter initialEntries={[route]}>
          {children}
        </MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}