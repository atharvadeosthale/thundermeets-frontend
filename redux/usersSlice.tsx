import { createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import { axiosInstance } from "../api";
import axios from "axios";
import { toast } from "react-toastify";

const base_url = `https://thunder-meets.herokuapp.com`;

export interface UserState {
  isLoggedIn: boolean;
  access: string;
  refresh: string;
  user: any[];

  userDetails: any[];
}

export const userInitialState: UserState = {
  isLoggedIn: false,
  access: "",
  refresh: "",
  user: [],

  userDetails: [],
};

const userSlice = createSlice({
  name: "users",
  initialState: userInitialState,
  reducers: {
    logIn(state, action: PayloadAction<UserState>) {
      state.isLoggedIn = true;
      state.access = action.payload.access;

      localStorage.setItem("access", action.payload.access);
      state.refresh = action.payload.refresh;
      localStorage.setItem("refresh", action.payload.refresh);
    },
    logOut(state, action: PayloadAction<UserState>) {
      state.isLoggedIn = false;
      state.access = "";
      state.refresh = "";
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
    },
    checkAuthenticated(state, action: PayloadAction<number>) {
      if (action.payload === 200) {
        state.isLoggedIn = true;
      } else {
        state.isLoggedIn = false;
      }
    },
    refreshToken(state, action) {
      state.access = action.payload.access;
      localStorage.setItem("access", action.payload.access);
    },
    load_user(state, action) {
      state.user = action.payload;
    },
  },
});
export const { logIn, logOut, checkAuthenticated, load_user, refreshToken } =
  userSlice.actions;
export default userSlice.reducer;

export const checkUserAuthenticated = () => async (dispatch: Dispatch<any>) => {
  try {
    const body = JSON.stringify({
      token: localStorage.getItem("access"),
    });
    const res = await axiosInstance.post("/auth/token/verify/", body);
    console.log(res.data);
    if (res.status == 401) {
      dispatch(getRefreshToken);
    }

    dispatch(checkAuthenticated(res.status));
    console.log("loading the user");
    dispatch(loadLoggedInUser());
  } catch (e) {
    dispatch(getRefreshToken());
  }
};
export const getRefreshToken = () => async (dispatch: Dispatch<any>) => {
  try {
    const body = JSON.stringify({
      refresh: localStorage.getItem("refresh"),
    });
    const res = await axiosInstance.post("/auth/token/refresh/", body);
    console.log(res);
    dispatch(refreshToken(res.data));
  } catch (e) {
    dispatch(logOut());
  }
};
export const loadLoggedInUser = () => async (dispatch: Dispatch<any>) => {
  try {
    console.log("load logged in user ran ");
    const token = localStorage.getItem("access");
    const headers = {
      Authorization: `JWT ${token}`,
      accept: "application/json",
      "content-type": "application/json",
    };

    // const res = await axiosInstance.get(`auth/user/`);
    const res = await axios.get(`${process.env.backendUrl}/auth/user/`, {
      headers,
    });
    console.log(res.data);
    dispatch(load_user(res.data));
    dispatch(getRefreshToken());
  } catch (e) {}
};

export const userLogin = (form: string) => async (dispatch: Dispatch<any>) => {
  try {
    const {
      data: { refresh_token: refresh, access_token: access },
    } = await axiosInstance.post("/auth/login/", form);
    // console.log(refresh, access);
    if (refresh && access) {
      dispatch(logIn({ refresh, access }));
      dispatch(loadLoggedInUser());
      toast.success("You Are SuccessFully Logged In ");
    }
  } catch (e) {
    toast.error("Unable to log in with provided credentials.");
  }
};
export const RegisterUser =
  (form: RegisterInputs) => async (dispatch: Dispatch<any>) => {
    const formBody = JSON.stringify({
      email: form.Email,
      password1: form.Password,
      password2: form.confirmPassword,
      first_name: form.first_name,
      last_name: form.last_name,
    });
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const data = await axiosInstance.post(
        "auth/registration/",
        formBody,
        config
      );
      console.log(data);
      toast.success("we sent you a Email to verify that its your real email ");
    } catch (e) {
      console.log(e.response.data.email);
      if (e.response.data.email) toast.error(`${e.response.data.email}`);
      else toast.error(`${JSON.stringify(e.response.data)}`);
    }
  };

export const github = (Code: string) => async (dispatch: Dispatch<any>) => {
  const formBody = JSON.stringify({
    code: Code,
  });
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const {
      data: { refresh_token: refresh, access_token: access },
    } = await axiosInstance.post("/auth/github/", formBody, config);
    if (refresh && access) {
      dispatch(logIn({ refresh, access }));
      dispatch(loadLoggedInUser());
      toast.success("You Are Logged In With Github  ");
    }
  } catch (e) {
    toast.error(
      "There Was A Problem logging you in with github have you registered with the same email before ?"
    );
  }
};
