// @ts-nocheck
import Head from "next/head";
import { Router, useRouter } from "next/router";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
// import { GoogleLogin } from "@leecheuk/react-google-login";
import { GoogleLogin } from "@react-oauth/google";
import Layout from "../components/Layout";
import { useAppSelector } from "../hooks";
import { github, logIn, userLogin } from "../redux/usersSlice";
import { useAppDispatch } from "../hooks/index";
import { toast } from "react-toastify";

const LoginGithub: any = dynamic(() => import("react-login-github"), {
  ssr: false,
});

export default function login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fname, setFname] = useState<string>("");
  const [lname, setLname] = useState<string>("");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.users.isLoggedIn);
  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }

    return () => {};
  }, [isLoggedIn]);

  const login = async () => {
    try {
      const form = JSON.stringify({ email, password });

      dispatch(userLogin(form));
    } catch (err) {
      console.error(err);
      toast("There was an error signing in");
    }
  };

  const register = async () => {
    try {
      const request = await fetch(
        "https://thunder-meets.herokuapp.com/auth/registration/",
        {
          method: "POST",
          body: JSON.stringify({
            first_name: fname,
            last_name: lname,
            email,
            password,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await request.json();

      if (!request.ok) {
        console.log(data);
        return toast.warning("Please check your fields!");
      }

      console.log(data);

      // Save a copy of data to LocalStorage
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      dispatch(
        logIn({ refresh: data.refresh_token, access: data.access_token })
      );

      // Further actions
      router.push("/dashboard");
      alert("Sign in successful!");
    } catch (err) {
      console.error(err);
      alert("There was an error signing in");
    }
  };

  const loginWithGithub = async (response: any) => {
    const body = JSON.stringify({ code: response.code });
    dispatch(github(body));
  };

  return (
    <Layout>
      <div className="flex min-h-screen max-w-7xl mx-auto w-full flex-col py-2">
        <Head>
          <title>Login - Thunder Meets</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="w-96 border border-gray-500 mx-auto p-5 rounded-lg mt-40">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address"
            className="w-full px-3 py-2 bg-gray-700 rounded-lg outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-3 py-2 bg-gray-700 rounded-lg outline-none mt-5"
          />
          <input
            type="text"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            placeholder="First Name"
            className="w-full px-3 py-2 bg-gray-700 rounded-lg outline-none mt-5"
          />
          <input
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            placeholder="Last Name"
            className="w-full px-3 py-2 bg-gray-700 rounded-lg outline-none mt-5"
          />
          <button
            onClick={login}
            className="mt-5 w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Login
          </button>
          <button
            onClick={register}
            className="mt-5 w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600 transition-all"
          >
            Register
          </button>
          <LoginGithub
            clientId={"53affafa78ef369c653b"}
            onSuccess={loginWithGithub}
            onFailure={console.log}
            className="w-full border mt-5 py-2 rounded-lg"
          />
          {/* <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log(credentialResponse);
            }}
            onError={() => {
              console.log("Login Failed");
            }}
          /> */}
        </div>
      </div>
    </Layout>
  );
}
