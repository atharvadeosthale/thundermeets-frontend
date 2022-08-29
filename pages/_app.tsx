// @ts-nocheck
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import { checkUserAuthenticated } from "../redux/usersSlice";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <GoogleOAuthProvider clientId="168967323973-l1daaprr5b7oeaeeu5i0h15lj5rn31a4.apps.googleusercontent.com">
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </GoogleOAuthProvider>
  );
}

export default MyApp;
