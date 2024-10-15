import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import Contract from "./config/Contract.json";

// Context oluşturma
export const WalletContext = createContext();

// Provider bileşeni
export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [signer, setSigner] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const contractAddress = Contract.contractAddress;
  const abi = Contract.abi;

  useEffect(() => {
    const initialize = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const userAddress = await signer.getAddress();

          const contractInstance = new ethers.Contract(
            contractAddress,
            abi,
            signer
          );
          setContract(contractInstance);
          setSigner(signer);
          setAccount(userAddress);
          setIsConnected(true);
        } catch (error) {
          console.error("Error connecting to MetaMask:", error);
        }
      }
    };

    initialize();
  }, []);

  // Cüzdanı bağlamak için fonksiyon
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });

        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();

        // Contract'ı başlat
        const contractInstance = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        setContract(contractInstance);
        setSigner(signer);
        setAccount(userAddress);
        setIsConnected(true); // Cüzdan bağlantısını güncelle
      } catch (error) {
        console.error("Failed to connect wallet:", error);
      }
    } else {
      console.error("MetaMask is not installed. Please install it to connect.");
    }
  };

  return (
    <WalletContext.Provider
      value={{ account, contract, signer, isConnected, connectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};
