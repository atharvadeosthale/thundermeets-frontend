import React, { useEffect, useLayoutEffect } from "react";

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../redux/store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const canUseDOM = typeof window !== "undefined";
export const useIsomorphicLayoutEffect = canUseDOM
  ? useLayoutEffect
  : useEffect;

export const isAuthenticated = () => {
  if (canUseDOM) {
    return localStorage.getItem("access") !== null;
  }
};
