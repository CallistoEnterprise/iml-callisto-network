import React, { useState } from "react";
import { changeChain } from "../utils/web3React";

const chains = [
  {
    id: "0x334",
    name: "Callisto Network",
    summary: "Etiam arcu parttitor id.",
    symbol: "CLO",
    decimals: 18,
    rpc: "https://rpc.callisto.network"
  },
  {
    id: "0x1",
    name: "Ethereum",
    summary: "Etiam arcu parttitor id.",
    symbol: "CLO",
    decimals: 18,
    rpc: "https://mainnet.infura.io/v3/a47cfbd514324d3f866b5610325b047e",
  },
  {
    id: "0x1",
    name: "Ethereum Classic",
    summary: "Etiam arcu parttitor id.",
    symbol: "CLO",
    decimals: 18,
    rpc: "https://mainnet.infura.io/v3/a47cfbd514324d3f866b5610325b047e",
  },
  {
    id: "0x1",
    name: "Ethereum Classic",
    summary: "Etiam arcu parttitor id.",
    symbol: "CLO",
    decimals: 18,
    rpc: "https://mainnet.infura.io/v3/a47cfbd514324d3f866b5610325b047e",
  },
]

const Network = () => {
  
  const [chain, setChain] = useState(-1);

  return (
    <div className="fixed top-1/2 -translate-y-1/2 w-full flex justify-center items-center gap-[125.5px]">
      <div className="flex flex-col items-center w-[355.77px]">
        <img className="h-[69px]" src="images/network/logo.png" alt="" />
        <div className="mt-[37px] text-[20.96px] leading-[26.21px] text-white">Select network</div>
        <div className="flex flex-col items-start mt-[57.87px] w-full">
          <div className="w-full px-[1px] py-[1px] bg-inputOuter rounded-sm">
            <div className="flex flex-col items-start max-h-[288.05px] px-[16.8px] py-[12.07px] bg-inputInner rounded-sm overflow-auto">
              <span className="mt-[4.7px] text-[12.61px] leading-[15.76px]">
                Network Selection
              </span>
              <div className="flex flex-col mt-[14.63px] space-y-[9.62px] w-full">
                {chains.map((x, i) =>
                  <button className={`w-full px-[1px] py-[1px] rounded-sm${chain === i ? " bg-inputOuter" : ""}`} onClick={() => setChain(i)} key={i}>
                    <div className={`flex items-center h-full px-[12.13px] pt-[12.6px] pb-[11.81px] rounded-sm space-x-[14.01px]${chain === i ? " bg-inputInner" : ""}`}>
                      <div className="w-[42.18px] h-[42.18px] bg-green1 rounded-full" />
                      <div className="flex flex-col items-start space-y-[1.98px]">
                        <span className="font-medium text-[16.46px] leading-[20.57px]">{x.name}</span>
                        <span className="font-light text-[10.6px] leading-[13.25px] text-grey2">{x.summary}</span>
                      </div>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        <button className="flex justify-center w-full py-[13.17px] mt-[27.95px] bg-green1 rounded-sm text-[15px] leading-[18.75px] disabled:opacity-50 disabled:cursor-not-allowed" disabled={chain === -1} onClick={() => changeChain(chains[chain].id, chains[chain].name, chains[chain].symbol, chains[chain].decimals, chains[chain].rpc)}>
          CONNECT
        </button>
      </div>
      <img className="hidden w-[500px] xl:w-auto lg:block" src="images/auth-side.png" alt="" />
    </div>
  );
};

export default Network;
