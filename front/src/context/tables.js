import { createContext, useContext } from "react";

export const TableDispatchContext = createContext();
export const FKContext = createContext();

export const useTableDispatch = () => useContext(TableDispatchContext);
export const useFK = () => useContext(FKContext);
