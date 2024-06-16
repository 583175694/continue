import React, { PropsWithChildren, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const CustomPostHogProvider = ({ children }: PropsWithChildren) => {
  return  <>{children}</>
};

export default CustomPostHogProvider;
