// @ts-nocheck
import Router from "next/router";
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import { logOut } from "../redux/usersSlice";

type Props = {};

const index = (props: Props) => {
  const dispatch = useAppDispatch();
  const useApp = useAppSelector;
  const { isLoggedIn } = useApp((state) => state.users);
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(logOut());
      Router.push("/");
    } else {
      Router.push("/login");
    }
  });
  return <div>hello logout page</div>;
};

export default index;
