import { createContext, useReducer } from "react";

const SET_DATA = "SET_DATA";

export const todoContext = createContext({});

interface Props {
  children: JSX.Element | JSX.Element[];
}
