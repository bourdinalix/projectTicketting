import React from "react";
import "./index.scss";

const Loader = () => {
  return (
    <>
      <div className="minting-text6">
        Processing
        <div className="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
