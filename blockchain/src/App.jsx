import "./App.scss";
import React from "react";
import MintLogic from "./components/MintLogic";

function App() {
  return (
    <div id="body">
      <div id="main">
        <div className="background">
          <div className="back_nft">
            <div className="back_nft_img"></div>
          </div>
          <header id="header">
            <div className="header-logo-unit">
              <div className="header-logo-img"></div>
            </div>
          </header>

          <section id="hero">
            <div className="minting">
              <div className="back-minting">
                <div className="minting-title">
                  <h3>TEST</h3>
                </div>
                <div className="nft-rand-contener">
                  <div className="nft_rand"></div>
                  <div className="question"></div>
                </div>
                <MintLogic />
              </div>
            </div>
            <div className="world-container">
              <div className="world-container-img"></div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default App;
