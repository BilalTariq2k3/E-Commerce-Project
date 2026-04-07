"use client";
import { Provider } from "react-redux";
import { store } from "../app/Redux/store";

export default function ProviderS({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
