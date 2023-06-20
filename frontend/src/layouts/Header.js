import { useContext, useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core'
import { useCookies } from "react-cookie";
import { copy } from "../utils/msTime";
import { ModalContext } from "../contexts/ModalContextProvider";
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const loc = useLocation();
  const [cookies, setCookie] = useCookies(["accept", "user"])
  const { setOpenConnectModal } = useContext(ModalContext);
  const { account } = useWeb3React();
  const [copiedCode, setCopiedCode] = useState(false);

  useMemo(() => {
    if (account && cookies.accept === "true")
      setCookie("user", account)
  }, [account, cookies.accept, setCookie])

  return (
    <div className="flex justify-end 2xl:justify-between space-x-[96.91px] items-center w-full flex-wrap px-6 lg:pl-[32.64px] lg:pr-[13.16px]">
      <div className="hidden 2xl:flex flex-1 justify-between items-center space-x-[45.13px]">
        {loc.pathname.includes("/lottery") ?
          <Link to="/">
            <svg width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.3744 7.01419H5.93211L9.40728 3.53902C9.70365 3.24266 9.84356 2.88912 9.84356 2.50099C9.84356 1.76082 9.23202 0.996582 8.33915 0.996582C7.93974 0.996582 7.59147 1.14176 7.30112 1.43286L1.3151 7.41888C1.06837 7.6656 0.817139 7.97024 0.817139 8.5186C0.817139 9.06695 1.027 9.33098 1.30306 9.60703L7.30112 15.6043C7.59147 15.8954 7.93974 16.0406 8.33915 16.0406C9.23277 16.0406 9.84356 15.2764 9.84356 14.5362C9.84356 14.1481 9.70365 13.7945 9.40728 13.4982L5.93211 10.023H20.3744C21.2048 10.023 21.8788 9.34903 21.8788 8.5186C21.8788 7.68817 21.2048 7.01419 20.3744 7.01419Z" fill="white" />
            </svg>
          </Link>
          :
          <div className="flex flex-col space-y-[4.34px]">
            <span className="font-medium text-[20.96px] leading-[26.21px]">Immortal Lottery</span>
            <span className="font-light text-[12.61px] leading-[15.76px] text-grey1">The first fully transparent DAPP with a verifiable on-chain randomness</span>
          </div>
        }
        {/* <div className="w-[355.89px] px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
          <div className="flex items-center space-x-[17.69px] px-[17.39px] py-[15.46px] bg-inputInner rounded-sm">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.9068 12.4308L11.0023 9.52624C11.6024 8.62175 11.9537 7.53877 11.9537 6.37455C11.9537 3.22 9.38725 0.653564 6.2327 0.653564C3.07815 0.653564 0.511719 3.22 0.511719 6.37455C0.511719 9.5291 3.07815 12.0955 6.2327 12.0955C7.39692 12.0955 8.47991 11.7443 9.38439 11.1441L12.2889 14.0487C12.7352 14.4955 13.4606 14.4955 13.9068 14.0487C14.3536 13.6019 14.3536 12.8776 13.9068 12.4308ZM2.22801 6.37455C2.22801 4.16625 4.0244 2.36986 6.2327 2.36986C8.441 2.36986 10.2374 4.16625 10.2374 6.37455C10.2374 8.58285 8.441 10.3792 6.2327 10.3792C4.0244 10.3792 2.22801 8.58285 2.22801 6.37455Z" fill="white" />
            </svg>
            <input className="w-full font-light text-[12.61px] leading-[15.76px] text-white placeholder-white" placeholder="Search anything here..." />
          </div>
        </div> */}
      </div>
      {account ?
        <div className="flex items-center 1xl:pr-[73.53px]">
          {/* <svg className="hidden md:block cursor-pointer" width="22" height="17" viewBox="0 0 22 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M2.69362 16.1806H19.2715C20.2368 16.1806 21.0342 15.3831 21.0342 14.4179V2.58253C21.0342 1.61724 20.2368 0.819824 19.2715 0.819824H2.69362C1.72833 0.819824 0.930908 1.61724 0.930908 2.58253V14.4179C0.930908 15.3831 1.72833 16.1806 2.69362 16.1806ZM2.08204 2.38932C2.14519 2.13196 2.36859 1.95299 2.65165 1.95299H19.2295C19.5008 1.95299 19.7172 2.11735 19.7904 2.35755L12.6404 9.50752C11.7171 10.4308 10.1642 10.4308 9.24091 9.50752L2.08204 2.38932ZM2.06408 3.96748V12.9491L6.55488 8.45829L2.06408 3.96748ZM2.08181 14.5262L7.3523 9.2557L8.4435 10.3469C9.11501 11.0184 9.99636 11.3961 10.9197 11.3961C11.843 11.3961 12.7244 11.0184 13.3959 10.3469L14.4871 9.2557L19.7904 14.559C19.7172 14.7991 19.5007 14.9635 19.2295 14.9635H2.65165C2.36825 14.9635 2.14465 14.784 2.08181 14.5262ZM19.8171 12.9909V3.9257L15.2845 8.45829L19.8171 12.9909Z" fill="white" />
          </svg>
          <svg className="hidden md:block cursor-pointer ml-[36.97px]" width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M11.2161 1.81354C11.1368 1.37274 10.9201 0.962852 10.5909 0.642112C10.169 0.230975 9.59669 0 8.99995 0C8.40322 0 7.83093 0.230975 7.40897 0.642112C7.0765 0.966058 6.85883 1.38094 6.78145 1.82677C5.82174 2.15221 4.94064 2.68767 4.21107 3.40331C2.95493 4.63547 2.24995 6.30172 2.24999 8.03846V11.875C1.55489 12.3466 0.987222 12.9751 0.595426 13.7067C0.203631 14.4384 -0.000656163 15.2516 1.58329e-06 16.0769C1.58329e-06 16.2707 0.079019 16.4566 0.219671 16.5937C0.360322 16.7307 0.551086 16.8077 0.749998 16.8077H6.09522C6.22809 17.309 6.49649 17.7715 6.87864 18.1439C7.44125 18.692 8.20431 19 8.99995 19C9.7956 19 10.5587 18.692 11.1213 18.1439C11.5034 17.7715 11.7718 17.309 11.9047 16.8077H17.2499C17.4488 16.8077 17.6396 16.7307 17.7802 16.5937C17.9209 16.4566 17.9999 16.2707 17.9999 16.0769C18.0048 15.2548 17.8063 14.4437 17.4211 13.7123C17.036 12.9808 16.4756 12.3506 15.7874 11.875V8.03846C15.7874 6.29415 15.0763 4.62129 13.8104 3.38787C13.0736 2.66997 12.184 2.13517 11.2161 1.81354ZM8.99996 2.92308C7.60758 2.92308 6.27222 3.46202 5.28766 4.42134C4.3031 5.38066 3.74998 6.68178 3.74998 8.03846V12.2769C3.75051 12.4057 3.7161 12.5323 3.65025 12.644C3.5844 12.7556 3.48944 12.8483 3.37498 12.9127C2.91532 13.1711 2.51718 13.5217 2.20689 13.9412C1.8966 14.3606 1.68122 14.8395 1.57499 15.3462H6.74997H11.2499H16.4249C16.3187 14.8395 16.1033 14.3606 15.793 13.9412C15.4827 13.5217 15.0846 13.1711 14.6249 12.9127C14.5105 12.8483 14.4155 12.7556 14.3497 12.644C14.2838 12.5323 14.2494 12.4057 14.2499 12.2769V8.03846C14.2499 6.68178 13.6968 5.38066 12.7122 4.42134C11.7277 3.46202 10.3923 2.92308 8.99996 2.92308ZM10.2974 16.8077H7.70246C7.83432 17.0292 8.02358 17.213 8.25129 17.3408C8.479 17.4686 8.73717 17.5359 8.99995 17.5359C9.26274 17.5359 9.52091 17.4686 9.74862 17.3408C9.97633 17.213 10.1656 17.0292 10.2974 16.8077Z" fill="white" />
          </svg> */}
          <img className="md:ml-[58.7px]" src="/images/avatar.png" alt="" />
          <div className="flex items-center ml-[13.71px]">
            <span className="font-medium text-[16.46px] max-w-[128px] truncate">{account}</span>
            <div className="relative">
              <svg className="-mt-1 cursor-pointer" width="20" height="20" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.7125 8.28752L21.7125 3.28752C21.522 3.10179 21.266 2.99852 21 3.00002H11C10.4696 3.00002 9.96086 3.21073 9.58579 3.5858C9.21071 3.96088 9 4.46958 9 5.00002V7.00002H7C6.46957 7.00002 5.96086 7.21073 5.58579 7.5858C5.21071 7.96088 5 8.46958 5 9.00002V27C5 27.5305 5.21071 28.0392 5.58579 28.4142C5.96086 28.7893 6.46957 29 7 29H21C21.5304 29 22.0391 28.7893 22.4142 28.4142C22.7893 28.0392 23 27.5305 23 27V25H25C25.5304 25 26.0391 24.7893 26.4142 24.4142C26.7893 24.0392 27 23.5305 27 23V9.00002C27.0015 8.73397 26.8982 8.47802 26.7125 8.28752ZM17 24H11C10.7348 24 10.4804 23.8947 10.2929 23.7071C10.1054 23.5196 10 23.2652 10 23C10 22.7348 10.1054 22.4804 10.2929 22.2929C10.4804 22.1054 10.7348 22 11 22H17C17.2652 22 17.5196 22.1054 17.7071 22.2929C17.8946 22.4804 18 22.7348 18 23C18 23.2652 17.8946 23.5196 17.7071 23.7071C17.5196 23.8947 17.2652 24 17 24ZM17 20H11C10.7348 20 10.4804 19.8947 10.2929 19.7071C10.1054 19.5196 10 19.2652 10 19C10 18.7348 10.1054 18.4804 10.2929 18.2929C10.4804 18.1054 10.7348 18 11 18H17C17.2652 18 17.5196 18.1054 17.7071 18.2929C17.8946 18.4804 18 18.7348 18 19C18 19.2652 17.8946 19.5196 17.7071 19.7071C17.5196 19.8947 17.2652 20 17 20ZM25 23H23V13C23.0015 12.734 22.8982 12.478 22.7125 12.2875L17.7125 7.28752C17.522 7.10179 17.266 6.99852 17 7.00002H11V5.00002H20.5875L25 9.41252V23Z" fill="white" onClick={() => {
                  copy(account)
                  setCopiedCode(true)
                  setTimeout(() => setCopiedCode(false), 2000)
                }} />
              </svg>
              {copiedCode && <span className="absolute top-[calc(100%+10px)] left-1/2 -translate-x-1/2 w-max text-[12px]">Copied</span>}
            </div>
          </div>
        </div>
        :
        <button className="flex justify-center items-center px-3 sm:px-6 h-[32.36px] rounded-tiny sm:rounded-sm bg-green1 disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => setOpenConnectModal(true)}>Connect wallet</button>
      }
    </div>
  );
};

export default Header;
