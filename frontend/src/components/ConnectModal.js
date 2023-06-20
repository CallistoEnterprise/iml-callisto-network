import React, { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import { connections, connectorLocalStorageKey } from "../pages/entry";
import { ModalContext } from "../contexts/ModalContextProvider";
import useAuth from "../hooks/useAuth";

const Connect = () => {
  const { login: signin } = useAuth();
  const { setOpenConnectModal } = useContext(ModalContext);
  const [walletId, setWalletId] = useState(2000)

  const handleConnect = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x334" }],
      });
      if (walletId % 2 === 0) {
        if (window.ethereum) {
          await window.ethereum.enable();
          window.web3 = new Web3(window.ethereum);

          await signin(connections[walletId % 2].connectorId);
          window.localStorage.setItem(connectorLocalStorageKey, connections[walletId % 2].connectorId);
          setOpenConnectModal(false);
        } else alert("Install metamask");
      }
      if (walletId % 2 === 1) {
        await signin(connections[walletId % 2].connectorId);
        window.localStorage.setItem(connectorLocalStorageKey, connections[walletId % 2].connectorId);
        setOpenConnectModal(false);
      }
    } catch (e) {
      if (e.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x334",
                chainName: "Callisto Network",
                rpcUrls: ["https://rpc.callisto.network/"],
                nativeCurrency: {
                  name: "CLO",
                  symbol: "CLO",
                  decimals: 18,
                }
              },
            ],
          });
        } catch (e) {
          console.log(e);
        }
      }
    }
  };
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", function (networkId) {
        if (networkId !== "0x334") document.location.reload()
      });
    }
  }, [])

  return (
    <div className="fixed w-full h-full top-0 left-0 bg-grey9 z-[1]">
      <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-center items-center gap-[125.5px]">
        <div className="flex flex-col items-center w-[354.41px]">
          <img className="h-[69px]" src="/images/network/logo.png" alt="" />
          <div className="mt-[37px] text-[20.96px] leading-[26.21px] text-white">Select Your Wallet</div>
          <div className="flex flex-col items-start mt-[57.87px] w-full">
            <div className="w-full h-[192.36px] mt-2 px-[1px] py-[1px] bg-inputOuter rounded-sm relative">
              <div className="flex justify-center items-center h-full px-[23.34px] py-[14.08px] bg-inputInner rounded-sm">
                <img src={connections[walletId % 2].image} alt="" />
              </div>
              <img className="absolute top-1/2 -translate-y-1/2 left-[-20px] cursor-pointer" src="/images/arrow-left.svg" alt="" onClick={() => setWalletId(x => x -= 1)} />
              <img className="absolute top-1/2 -translate-y-1/2 right-[-20px] cursor-pointer" src="/images/arrow-right.svg" alt="" onClick={() => setWalletId(x => x += 1)} />
            </div>
            <div className="mt-[12.56px] text-[12.61px] leading-[15.76px] text-grey1">
              {connections[walletId % 2].name}
            </div>
          </div>
          <button className="flex justify-center w-full py-[13.17px] mt-[26.48px] bg-green1 rounded-sm text-[15px] leading-[18.75px]" onClick={handleConnect}>
            CONNECT
          </button>
        </div>
        <img className="hidden w-[500px] xl:w-auto lg:block" src="/images/auth-side.png" alt="" />
      </div>
    </div>
  );
};

export default Connect;
