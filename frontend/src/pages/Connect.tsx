import React from "react";

const Connect: React.FC = () => {
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
              <img src="images/metamask.svg" alt="" />
            </div>
            <img className="absolute top-1/2 -translate-y-1/2 left-[-20px]" src="images/arrow-left.svg" alt="" />
            <img className="absolute top-1/2 -translate-y-1/2 right-[-20px]" src="images/arrow-right.svg" alt="" />
          </div>
          <div className="mt-[12.56px] text-[12.61px] leading-[15.76px] text-grey1">
            Metamask
          </div>
        </div>
        <button className="flex justify-center w-full py-[13.17px] mt-[26.48px] bg-green1 rounded-sm text-[15px] leading-[18.75px]">
          CONNECT
        </button>
      </div>
      <img src="images/auth-side.png" alt="" />
    </div>
  );
};

export default Connect;
