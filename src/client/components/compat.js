import React, {useEffect, useContext} from "react";
import {MMContext} from "./magic-mirror";

const Compat = ({ module, data }) => {
  const MM = useContext(MMContext);
  useEffect(() => {
    module.init();
    return () => {};
  });

  return <></>;
};

export default Compat;