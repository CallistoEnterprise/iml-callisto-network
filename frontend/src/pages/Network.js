import React from "react";

const Network = () => {
  return (
    <div className="fixed top-1/2 -translate-y-1/2 w-full flex justify-center items-center gap-[125.5px]">
      <div className="flex flex-col items-start w-[355.77px]">
        <img src="images/logo.svg" alt="" />
        <div className="mt-[27.22px] text-[20.96px] leading-[26.21px] text-white">Select network</div>
        <span className="mt-[4.7px] text-[12.61px] leading-[15.76px] text-grey1">
          Pulvinar varius nulla maecenas
        </span>
        <div className="flex flex-col items-start mt-[30.51px] w-full">
          <div className="w-full px-[1px] py-[1px] bg-inputOuter rounded-sm">
            <div className="flex flex-col items-start max-h-[288.05px] px-[16.8px] py-[12.07px] bg-inputInner rounded-sm overflow-auto">
              <span className="mt-[4.7px] text-[12.61px] leading-[15.76px]">
                Recent Expenses
              </span>
              <div className="flex flex-col mt-[14.63px] space-y-[9.62px] w-full">
                <div className="w-full px-[1px] py-[1px] bg-inputOuter rounded-sm">
                  <div className="flex items-center h-full px-[12.13px] pt-[12.6px] pb-[11.81px] bg-inputInner rounded-sm space-x-[14.01px]">
                    <div className="w-[42.18px] h-[42.18px] bg-green1 rounded-full" />
                    <div className="flex flex-col items-start space-y-[1.98px]">
                      <span className="font-medium text-[16.46px] leading-[20.57px]">Callisto Network</span>
                      <span className="font-light text-[10.6px] leading-[13.25px]">Etiam arcu parttitor id.</span>
                    </div>
                  </div>
                </div>
                <div className="w-full px-[1px] py-[1px] rounded-sm">
                  <div className="flex items-center h-full px-[12.13px] pt-[12.6px] pb-[11.81px] rounded-sm space-x-[14.01px]">
                    <div className="w-[42.18px] h-[42.18px] bg-black1 rounded-full" />
                    <div className="flex flex-col items-start space-y-[1.98px]">
                      <span className="font-medium text-[16.46px] leading-[20.57px]">Ethereum</span>
                      <span className="font-light text-[10.6px] leading-[13.25px]">Etiam arcu parttitor id.</span>
                    </div>
                  </div>
                </div>
                <div className="w-full px-[1px] py-[1px] rounded-sm">
                  <div className="flex items-center h-full px-[12.13px] pt-[12.6px] pb-[11.81px] rounded-sm space-x-[14.01px]">
                    <div className="w-[42.18px] h-[42.18px] bg-black1 rounded-full" />
                    <div className="flex flex-col items-start space-y-[1.98px]">
                      <span className="font-medium text-[16.46px] leading-[20.57px]">Ethereum Classic</span>
                      <span className="font-light text-[10.6px] leading-[13.25px]">Etiam arcu parttitor id.</span>
                    </div>
                  </div>
                </div>
                <div className="w-full px-[1px] py-[1px] rounded-sm">
                  <div className="flex items-center h-full px-[12.13px] pt-[12.6px] pb-[11.81px] rounded-sm space-x-[14.01px]">
                    <div className="w-[42.18px] h-[42.18px] bg-black1 rounded-full" />
                    <div className="flex flex-col items-start space-y-[1.98px]">
                      <span className="font-medium text-[16.46px] leading-[20.57px]">Ethereum Classic</span>
                      <span className="font-light text-[10.6px] leading-[13.25px]">Etiam arcu parttitor id.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button className="flex justify-center w-full py-[13.17px] mt-[27.95px] bg-green1 rounded-sm text-[15px] leading-[18.75px]">
          CONNECT
        </button>
      </div>
      <img src="images/auth-side.png" alt="" />
    </div>
  );
};

export default Network;
