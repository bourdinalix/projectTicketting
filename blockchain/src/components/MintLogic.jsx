import React from "react";
import "../App.scss";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
// import NFT from "../Ticket.json";
import Loader from "./Loader";

/** DATA */
const NFTaddress = "0xcDA299240614779b46728Dd2C970dd30f7bC6167";
const blockchaineId = "0x3";

const MintLogic = () => {
  const [miningStatus, setMiningStatus] = useState(null);
  const [loadingState, setLoadingState] = useState(0);
  const [error, setError] = useState(null);
  const [errorCode, setErrorCode] = useState(null);
  const [errorReverted, setErrorReverted] = useState(null);
  const [data, setData] = useState({});
  const [nftNumber, setNftNumber] = useState(1);
  const [correctNetwork, setCorrectNetwork] = useState(false);
  const [currentAccount, setCurrentAccount] = useState("");

  useEffect(() => {
    checkIfWalletIsConnected();
    checkCorrectNetwork();
    fetchData();
  }, []);

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (ethereum) {
      console.log("Got the ethereum object: ", ethereum);
    } else {
      console.log("No Wallet found. Connect Wallet");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      console.log("Found authorized Account: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } else {
      console.log("No authorized account found");
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const ethereumId = blockchaineId;

      if (chainId !== ethereumId) {
        alert("You are not connected to the Ethereum network!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log("Error connecting to metamask", err);
    }
  };

  const checkCorrectNetwork = async () => {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });
    console.log("Connected to chain:" + chainId);

    const ethereumId = blockchaineId;

    if (chainId !== ethereumId) {
      setCorrectNetwork(false);
    } else {
      setCorrectNetwork(true);
    }
  };

  async function fetchData() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(NFTaddress, NFT.abi, provider);
      try {
        const cost = await contract.salePrice();
        const totalSupply = await contract.totalSupply();
        const object = {
          cost: cost,
          totalSupply: totalSupply.toNumber(),
        };
        setData(object);
        setMiningStatus(1);
      } catch (err) {
        console.log({ err });
      }
    }
  }

  async function mint() {
    const { ethereum } = window;
    let chainId = await ethereum.request({ method: "eth_chainId" });

    if (chainId !== blockchaineId) {
      setCorrectNetwork(false);
      return;
    }
    if (typeof window.ethereum !== "undefined") {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(NFTaddress, NFT.abi, signer);
      try {
        let overrides = {
          from: accounts[0],
          value: data.cost.mul(nftNumber),
        };
        console.log(nftNumber);
        const transaction = await contract.saleMint(nftNumber, overrides);
        console.log("Mining....");
        setMiningStatus(0);
        await transaction.wait();
        setLoadingState(1);
        console.log("Mined!");
        localStorage.setItem("isMinted", "true");
        fetchData();
      } catch (err) {
        setError(null);
        setErrorReverted(null);
        setErrorCode(null);
        setError(err.message);
        setErrorCode(err.code);
        if (err.error) {
          setErrorReverted(err.error.message);
        }
        console.log({ err });
      }
    }
  }

  const MintInferface = () => {
    return (
      <>
        <button className="minting-button" onClick={mint}>
          MINT
        </button>
        {loadingState === 0 ? (
          miningStatus === 0 ? (
            error === null ? (
              <Loader />
            ) : (
              <div></div>
            )
          ) : (
            <div></div>
          )
        ) : (
          <div className="minting-text6">Minting done!</div>
        )}
      </>
    );
  };

  return (
    <div>
      <h3 className="minting-text3">
        {(data.cost / 10 ** 18) * nftNumber} ETH
      </h3>
      <h3 className="minting-text4">{data.totalSupply - 100}</h3>
      <div className="plus_less">
        <button
          onClick={() => {
            if (nftNumber > 1) setNftNumber(nftNumber - 1);
            setError(null);
          }}
          className="plus_less_btn"
        >
          -
        </button>
        <p className="plus_less_num">{nftNumber}</p>
        <button
          onClick={() => {
            if (nftNumber < 5) setNftNumber(nftNumber + 1);
            setError(null);
          }}
          className="plus_less_btn"
        >
          +
        </button>
      </div>
      {currentAccount === "" ? (
        <button className="minting-button" onClick={connectWallet}>
          Connect Wallet
        </button>
      ) : correctNetwork ? (
        <MintInferface />
      ) : (
        <p className="ethereum-text">
          Please connect to the Ethereum network and reload the page
        </p>
      )}
    </div>
  );
};

export default MintLogic;
