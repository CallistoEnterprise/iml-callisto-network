import React, { useState } from "react";
import { Link } from "react-router-dom";

const Auth = () => {
  const [remember, setRemember] = useState(false);
  return (
    <div className="fixed top-1/2 -translate-y-1/2 w-full flex justify-center items-center gap-[125.5px]">
      <div className="flex flex-col items-center w-[354.41px]">
        <img className="h-[69px]" src="images/network/logo.png" alt="" />
        <div className="mt-[33px] text-[20.96px] leading-[26.21px] text-white">Welcome Back</div>
        <div className="flex flex-col items-start mt-[70px] w-full">
          <div className="ml-[23.34px] text-[15px] leading-[18.75px] text-grey1">Email</div>
          <div className="w-full mt-2 px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
            <div className="px-[23.34px] py-[14.08px] bg-inputInner rounded-sm">
              <input className="text-[15px] leading-[18.75px] text-white w-full" placeholder="Your Email" />
            </div>
          </div>
          <div className="mt-[14.15px] ml-[23.34px] text-[15px] leading-[18.75px] text-grey1">
            Password
          </div>
          <div className="w-full mt-2 px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
            <div className="px-[23.34px] py-[14.08px] bg-inputInner rounded-sm">
              <input
                className="text-[15px] leading-[18.75px] text-white w-full"
                placeholder="Your Password"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-[10.03px] mt-[18.03px] self-start">
          {/* Switch box */}
          <button className={`relative w-[35.77px] h-[18.67px] ${remember ? "bg-green1" : "bg-grey1"} rounded-full transition-colors`} onClick={() => setRemember(!remember)}>
            <div className={`absolute ${remember ? "left-[calc(100%-3.16px-16.04px)]" : "left-[3.16px]"} top-1/2 -translate-y-1/2 w-[16.04px] h-[15.86px] rounded-full bg-white transition-all`}></div>
          </button>
          <div className="text-[12.92px] leading-[16.15px] text-grey1">Remember me</div>
        </div>
        <Link to="/" className="flex justify-center w-full py-[13.17px] mt-[15.96px] bg-green1 rounded-sm text-[15px] leading-[18.75px]">
          SIGN IN
        </Link>

        <div className="flex items-center space-x-[3.21px] mt-8 text-[12.5px] leading-[15.63px] self-start">
          <span>Don’t have an account?</span>
          <a className="text-green1" href="/">Sign up</a>
        </div>
      </div>

      <img className="hidden w-[500px] xl:w-auto lg:block" src="images/auth-side.png" alt="" />
    </div>
  );
};

export default Auth;
