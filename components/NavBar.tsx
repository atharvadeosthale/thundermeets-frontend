import { useRouter } from "next/router";
import React, { useEffect } from "react";
import {
  canUseDOM,
  isAuthenticated,
  useAppDispatch,
  useAppSelector,
} from "../hooks/index";
import {
  checkAuthenticated,
  checkUserAuthenticated,
} from "../redux/usersSlice";
// @ts-nocheck
import { useIsomorphicLayoutEffect } from "../hooks";
type Props = {};

const NavBar = (props: Props) => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector((state) => state.users.isLoggedIn);

  const router = useRouter();
  useEffect(() => {
    if (canUseDOM) {
      dispatch(checkUserAuthenticated());
    }
  }, []);
  return (
    <div className="flex justify-between py-3 items-center container mx-auto">
      <div className="text-2xl font-bold">ThunderMeets</div>
      {!isLoggedIn ? (
        <div
          className="text-xl font-light"
          onClick={() => router.push("/login")}
        >
          Login
        </div>
      ) : (
        <div
          className="text-xl font-light"
          onClick={() => router.push("/logout")}
        >
          LogOut
        </div>
      )}
    </div>
  );
};

export default NavBar;
