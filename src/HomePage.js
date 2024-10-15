import React, { useState, useEffect, useContext } from "react";
import { Home, Book, User } from "lucide-react";
import ProfilePage from "./pages/ProfilePage";
import "./App.css";
import { Button } from "@chakra-ui/react";
import { Wallet } from "lucide-react";
import { WalletContext } from "./WalletContext"; // WalletContext'i içe aktar
import { useNavigate } from "react-router-dom"; // useNavigate'i içe aktar

export default function HomePage() {
  const { account, contract, isConnected, connectWallet } =
    useContext(WalletContext); // WalletContext'ten bilgileri al
  const [activeTab, setActiveTab] = useState("home");
  const [userInfo, setUserInfo] = useState(null);
  const [userName, setUserName] = useState("");
  const navigate = useNavigate(); // navigate fonksiyonunu tanımla

  useEffect(() => {
    const initialize = async () => {
      if (contract && account) {
        await switchNetwork();
        await checkUserRegistration();
      }
    };

    initialize();
  }, [contract, account]);

  const networks = {
    REETA: {
      chainId: "0x27E0",
      chainName: "REETA",
      nativeCurrency: {
        name: "REETA",
        symbol: "REETA",
        decimals: 18,
      },
      rpcUrls: ["https://evm.average-moth-69.telebit.io"],
      blockExplorerUrls: [""],
    },
  };

  const switchNetwork = async () => {
    if (account.length > 0) {
      try {
        await changeNetwork("REETA");
      } catch (error) {
        console.error("Failed to switch network:", error);
      }
    } else {
      console.log("Wallet not connected.");
    }
  };
  const changeNetwork = async (networkName) => {
    if (!window.ethereum) throw new Error("No crypto wallet found");
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{ ...networks[networkName] }],
    });
  };
  // Kullanıcı kaydını kontrol etme fonksiyonu
  const checkUserRegistration = async () => {
    if (contract && account) {
      try {
        const userInfo = await contract.getUserInfo(account);
        console.log(userInfo);
        if (userInfo.name === "") {
          setUserInfo(null); // Kullanıcı kaydolmamış
        } else {
          setUserInfo(userInfo); // Kullanıcı kayıtlı
        }
      } catch (error) {
        setUserInfo(null);
        console.error("Error fetching user info:", error);
      }
    }
  };
  const registerUser = async () => {
    try {
      await contract.registerUser(userName);
      // Kayıttan sonra kullanıcı bilgilerini tekrar kontrol et
      checkUserRegistration();
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };
  const goToLessons = () => {
    navigate("/lessons"); // userInfo'yu state içinde gönder
  };

  <ProfilePage userInfo={userInfo} />;
  const renderContent = () => {
    if (isConnected && userInfo === null) {
      // Kullanıcı kayıtlı değilse formu göster
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h2 className="text-2xl font-bold mb-4">
            Register to start learning!
          </h2>
          <input
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="p-2 border border-gray-300 rounded mb-4"
          />
          <Button
            onClick={registerUser}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Register
          </Button>
        </div>
      );
    } else if (isConnected && userInfo) {
      // Kullanıcı kayıtlıysa ders listesi veya diğer içerikleri göster
      switch (activeTab) {
        case "profile":
          return <ProfilePage userInfo={userInfo} />;
        default:
          return (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-green-500 mb-4">
                Welcome to the REETA's LESSONS
              </h1>
              <p className="text-xl text-gray-600">
                Start learning English today!
              </p>
              <Button
                onClick={goToLessons} // "Go to Lessons" butonuna tıklandığında LessonList'e git
                className="bg-green-500 text-black px-4 py-2 rounded mt-4"
              >
                See the Lessons
              </Button>
            </div>
          );
      }
    } else {
      return (
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-4xl font-bold text-green-500 mb-4">
            Welcome to REETA's LESSONS
          </h1>
          <p className="text-xl text-gray-600">Start learning English today!</p>
          <Button
            onClick={connectWallet}
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 transform hover:scale-105 transition-all duration-200"
          >
            {account ? (
              <span className="flex items-center">
                <Wallet className="mr-2" />
                {account}
              </span>
            ) : (
              <span className="flex items-center">
                <Wallet className="mr-2" />
                Connect MetaMask
              </span>
            )}
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">{renderContent()}</div>

      {/* Navigation Tabs */}
      <div className="bg-white border-t border-gray-200">
        <div className="flex justify-around">
          <TabButton
            icon={<Home />}
            label="Home"
            isActive={activeTab === "home"}
            onClick={() => setActiveTab("home")}
          />

          <TabButton
            icon={<User />}
            label="Profile"
            isActive={activeTab === "profile"}
            onClick={() => setActiveTab("profile")}
          />
        </div>
      </div>
    </div>
  );
}

function TabButton({ icon, label, isActive, onClick }) {
  return (
    <button
      className={`flex flex-col items-center justify-center py-2 px-4 ${
        isActive ? "text-green-500" : "text-gray-500"
      }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </button>
  );
}
