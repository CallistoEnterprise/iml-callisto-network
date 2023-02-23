import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import { change } from "../utils/web3React";
import { connections, connectorLocalStorageKey } from "../pages/entry";

const Connect = () => {
  const { login: signin } = useAuth();

  const nav = useNavigate()

  const [walletId, setWalletId] = useState(2000)

  const handleConnect = async () => {
    if (walletId % 2 === 0) {
      if (window.ethereum) {
        await window.ethereum.enable();
        window.web3 = new Web3(window.ethereum);

        const _chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (_chainId !== "0x1") await change();
        else {
          await signin(connections[walletId % 2].connectorId);
          window.localStorage.setItem(connectorLocalStorageKey, connections[walletId % 2].connectorId);
          nav("/")
        }
      } else alert("Install metamask");
    }
    if (walletId % 2 === 1) {
      await signin(connections[walletId % 2].connectorId);
      window.localStorage.setItem(connectorLocalStorageKey, connections[walletId % 2].connectorId);
      nav("/")
    }
  };
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("chainChanged", function (networkId) {
        document.location.reload()
      });
    }
  }, [])

  return (
    <div className="fixed top-1/2 -translate-y-1/2 w-full flex justify-center items-center gap-[125.5px]">
      <div className="flex flex-col items-start w-[354.41px]">
        <img src="images/logo.svg" alt="" />
        <div className="mt-[27.22px] text-[20.96px] leading-[26.21px] text-white">Connect Wallet</div>
        <div className="mt-[4.7px] text-[12.61px] leading-[15.76px] text-grey1">
          Pulvinar varius nulla maecenas
        </div>
        <div className="flex flex-col items-start mt-[30.51px] w-full">
          <div className="w-full h-[192.36px] mt-2 px-[1px] py-[1px] bg-inputOuter rounded-sm relative">
            <div className="flex justify-center items-center h-full px-[23.34px] py-[14.08px] bg-inputInner rounded-sm">
              <img src={connections[walletId % 2].image} alt="" />
            </div>
            <img className="absolute top-1/2 -translate-y-1/2 left-[-20px] cursor-pointer" src="images/arrow-left.svg" alt="" onClick={() => setWalletId(x => x -= 1)} />
            <img className="absolute top-1/2 -translate-y-1/2 right-[-20px] cursor-pointer" src="images/arrow-right.svg" alt="" onClick={() => setWalletId(x => x += 1)} />
          </div>
          <div className="mt-[12.56px] text-[12.61px] leading-[15.76px] text-grey1">
            {connections[walletId % 2].name}
          </div>
        </div>
        <button className="flex justify-center w-full py-[13.17px] mt-[26.48px] bg-green1 rounded-sm text-[15px] leading-[18.75px]" onClick={handleConnect}>
          CONNECT
        </button>
      </div>
      <img src="images/auth-side.png" alt="" />
    </div>
  );
};

export default Connect;
