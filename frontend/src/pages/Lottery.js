import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import DownloadIcon from '@mui/icons-material/Download';
import { useWeb3React } from '@web3-react/core'
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { useParams } from "react-router-dom";
import { Skeleton, Tooltip } from "@mui/material";
import { ethers } from "ethers";
import { useEntropy, useLottery } from "../hooks/useContract";
import { ROUTERS } from "../contracts/config";
import { secondsToDhms, sumPercent, toast } from "../utils/msTime";
import { parseEther } from "ethers/lib/utils";
import { ModalContext } from "../contexts/ModalContextProvider";

const Lottery = () => {
  const { key } = useParams();
  const { setOpenConnectModal } = useContext(ModalContext);
  const [total, setTotal] = useState()
  const [payload, setPayload] = useState(Math.floor(Math.random() * 90000000000).toString())
  const [payloadForReveal, setPayloadForReveal] = useState(Math.floor(Math.random() * 90000000000).toString())
  const [doing, setDoing] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [minAllowedBet, setMinAllowedBet] = useState(0)
  const [roundId, setRoundId] = useState(0), [, setRoundRewardPaid] = useState()
  const [depositData, setDepositData] = useState([])
  const [balance, setBalance] = useState(0)
  const [status, setStatus] = useState("-1")
  const [, setCurrentRound] = useState()
  const [salt, setSalt] = useState(Math.floor(Math.random() * 90000000000).toString())
  const [saltForReveal, setSaltForReveal] = useState(Math.floor(Math.random() * 90000000000).toString())
  const [amount, setAmount] = useState(1000)
  const [[dys1, hrs1, mins1, secs1], setTime1] = useState([0, 0, 0, 0])
  const [[dys2, hrs2, mins2, secs2], setTime2] = useState([0, 0, 0, 0])

  const lotteryContract = useLottery(key), entropyContract = useEntropy()
  const { account } = useWeb3React();
  let timerId1 = useRef()
  let timerId2 = useRef()
  const handleStartRound = async () => {
    setDoing(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await (await lotteryContract.connect(provider.getSigner()).start_new_round({ value: minAllowedBet })).wait()
      await getData()
      toast("Round is started")
    } catch (e) {
      toast(e.reason, "danger")
    }
    setDoing(false)
  }
  const handleDeposit = async () => {
    setDoing(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await (await lotteryContract.connect(provider.getSigner()).deposit({ value: minAllowedBet })).wait()
      await getData()
      toast("Deposited 10 CLO")
    } catch (e) {
      toast(e.reason, "danger")
    }
    setDoing(false)
  }
  const handleSubmitEntropy = async () => {
    setDoing(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const entropyHash = await entropyContract.connect(provider.getSigner()).test_hash(payload, salt)
      await (await entropyContract.connect(provider.getSigner()).submit_entropy(entropyHash, { value: parseEther(amount.toString()).toString() })).wait()
      await getData()
      toast("Entropy is submitted")
    } catch (e) {
      toast(e.reason, "danger")
    }
    setDoing(false)
  }
  const download = async () => {
    const fileData = "payload: " + payload + "\nsalt   : " + salt;
    const blob = new Blob([fileData], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "payload & salt.txt";
    link.href = url;
    link.click();
  }
  const handleGenerateSalt = async () => setSalt(Math.floor(Math.random() * 90000000000).toString())
  const handleGenerateEntropy = async () => setPayload(Math.floor(Math.random() * 90000000000).toString())
  const handleRevealEntropy = async () => {
    setDoing(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await (await entropyContract.connect(provider.getSigner()).reveal_entropy(payloadForReveal, saltForReveal)).wait()
      await getData()
      toast("Entropy is revealed")
    } catch (e) {
      toast(e.reason, "danger")
    }
    setDoing(false)
  }
  const handleFinishRound = async () => {
    setDoing(true)
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await (await lotteryContract.connect(provider.getSigner()).finish_round(account)).wait()
      await getData()
      toast("Round is finished")
    } catch (e) {
      toast(e.reason, "danger")
    }
    setDoing(false)
  }
  const tick1 = async () => {
    if (dys1 === 0 && hrs1 === 0 && mins1 === 0 && secs1 === 0) {
      if (status > 0) {
        setDoing(true);
        clearInterval(timerId1.current);
        await getData();
        setDoing(false);
      }
    } else if (hrs1 === 0 && mins1 === 0 && secs1 === 0) {
      setTime1([dys1 - 1, 23, 59, 59]);
    } else if (mins1 === 0 && secs1 === 0) {
      setTime1([dys1, hrs1 - 1, 59, 59]);
    } else if (secs1 === 0) {
      setTime1([dys1, hrs1, mins1 - 1, 59]);
    } else {
      setTime1([dys1, hrs1, mins1, secs1 - 1]);
    }
  }
  const tick2 = async () => {
    if (dys2 === 0 && hrs2 === 0 && mins2 === 0 && secs2 === 0) {
      if (status > 0) {
        setDoing(true);
        clearInterval(timerId2.current);
        await getData();
        setDoing(false);
      }
    } else if (hrs2 === 0 && mins2 === 0 && secs2 === 0) {
      setTime2([dys2 - 1, 23, 59, 59]);
    } else if (mins2 === 0 && secs2 === 0) {
      setTime2([dys2, hrs2 - 1, 59, 59]);
    } else if (secs2 === 0) {
      setTime2([dys2, hrs2, mins2 - 1, 59]);
    } else {
      setTime2([dys2, hrs2, mins2, secs2 - 1]);
    }
  }
  const getData = async () => {
    console.log("Getting lottery data")
    const provider = new ethers.providers.JsonRpcProvider("https://rpc.callisto.network");
    const ethcallProvider = new Provider(provider);
    const _total = await provider.getBalance(key)
    setMulticallAddress(820, "0x914D4b9Bb542077BeA48DE5E3D6CF42e7ADfa1aa");
    await ethcallProvider.init();
    const _lotteryContract = new Contract(key, ROUTERS.LOTTERY_MULTICALL.abi);
    const _tmp = await ethcallProvider.all([
      _lotteryContract.min_allowed_bet(),
      _lotteryContract.current_round(),
      _lotteryContract.get_phase(),
      _lotteryContract.current_round(),
      _lotteryContract.round_reward_paid(),
      _lotteryContract.round_start_timestamp(),
      _lotteryContract.deposits_phase_duration(),
      _lotteryContract.entropy_phase_duration(),
    ]);
    const multiResult = (_tmp.map(x => x._isBigNumber ? x.toString() : x))
    const roundStartData = await lotteryContract.queryFilter(lotteryContract.filters.NewRound(multiResult[1]));
    const data = await lotteryContract.queryFilter(lotteryContract.filters.Deposit());
    const _depositData = data.filter(x => x.blockNumber >= roundStartData[0].blockNumber).map(x => {
      const tmp = x.decode(x.data, x.topics)
      return {
        amount_credited: ethers.utils.formatEther(tmp["amount_credited"]),
        amount_deposited: ethers.utils.formatEther(tmp["amount_deposited"]),
        depositor: tmp["depositor"],
      }
    })
    let sum = 0; _depositData.forEach(x => sum += parseFloat(x.amount_deposited));
    const _depositDataWithPercent = _depositData.map(x => {
      return { ...x, amount_deposited: parseFloat(x.amount_deposited), percent: x.amount_deposited / sum * 100 }
    })
    setTotal(_total)
    setMinAllowedBet(multiResult[0])
    setRoundId(multiResult[1])
    setStatus(multiResult[2])
    setCurrentRound(multiResult[3])
    setRoundRewardPaid(multiResult[4])
    const d1 = new Date((parseInt(multiResult[5]) + parseInt(multiResult[6])) * 1000)
    const d2 = new Date((parseInt(multiResult[5]) + parseInt(multiResult[6]) + parseInt(multiResult[7])) * 1000)
    if (multiResult[2] === 0) {
      setTime1([0, 1, 0, 0])
      setTime2([0, 1, 0, 0])
    }
    if (multiResult[2] === 1) {
      setTime1([secondsToDhms(new Date(), d1).dDisplay, secondsToDhms(new Date(), d1).hDisplay, secondsToDhms(new Date(), d1).mDisplay, secondsToDhms(new Date(), d1).sDisplay])
      setTime2([0, 1, 0, 0])
    }
    if (multiResult[2] === 2) {
      setTime1([0, 0, 0, 0])
      setTime2([secondsToDhms(new Date(), d2).dDisplay, secondsToDhms(new Date(), d2).hDisplay, secondsToDhms(new Date(), d2).mDisplay, secondsToDhms(new Date(), d2).sDisplay])
    }
    if (multiResult[2] === 3) {
      setTime1([0, 0, 0, 0])
      setTime2([0, 0, 0, 0])
    }
    setDepositData(sumPercent(_depositDataWithPercent))
    setBalance(await window.web3.eth.getBalance(account))
    setLoaded(true)
  }

  useMemo(async () => {
    if (account && doing === false) {
      setBalance(await window.web3.eth.getBalance(account))
    }
  }, [account, doing])

  useEffect(() => {
    if (status === 1) {
      timerId1.current = setInterval(() => tick1(), 1000)
      return () => clearInterval(timerId1.current);
    }
  })

  useEffect(() => {
    if (status === 2) {
      timerId2.current = setInterval(() => tick2(), 1000)
      return () => clearInterval(timerId2.current);
    }
  })

  useMemo(async () => {
    const init = async () => {
      console.log("Getting lottery data")
      const provider = new ethers.providers.JsonRpcProvider("https://rpc.callisto.network");
      const ethcallProvider = new Provider(provider);
      const _total = await provider.getBalance(key)
      setMulticallAddress(820, "0x914D4b9Bb542077BeA48DE5E3D6CF42e7ADfa1aa");
      await ethcallProvider.init();
      const _lotteryContract = new Contract(key, ROUTERS.LOTTERY_MULTICALL.abi);
      const _tmp = await ethcallProvider.all([
        _lotteryContract.min_allowed_bet(),
        _lotteryContract.current_round(),
        _lotteryContract.get_phase(),
        _lotteryContract.current_round(),
        _lotteryContract.round_reward_paid(),
        _lotteryContract.round_start_timestamp(),
        _lotteryContract.deposits_phase_duration(),
        _lotteryContract.entropy_phase_duration(),
      ]);
      const multiResult = (_tmp.map(x => x._isBigNumber ? x.toString() : x))
      const roundStartData = await lotteryContract.queryFilter(lotteryContract.filters.NewRound(multiResult[1]));
      const data = await lotteryContract.queryFilter(lotteryContract.filters.Deposit());
      const _depositData = data.filter(x => x.blockNumber >= roundStartData[0].blockNumber).map(x => {
        const tmp = x.decode(x.data, x.topics)
        return {
          amount_credited: ethers.utils.formatEther(tmp["amount_credited"]),
          amount_deposited: ethers.utils.formatEther(tmp["amount_deposited"]),
          depositor: tmp["depositor"],
        }
      })
      let sum = 0; _depositData.forEach(x => sum += parseFloat(x.amount_deposited));
      const _depositDataWithPercent = _depositData.map(x => {
        return { ...x, amount_deposited: parseFloat(x.amount_deposited), percent: x.amount_deposited / sum * 100 }
      })
      setTotal(_total)
      setMinAllowedBet(multiResult[0])
      setRoundId(multiResult[1])
      setStatus(multiResult[2])
      setCurrentRound(multiResult[3])
      setRoundRewardPaid(multiResult[4])
      const d1 = new Date((parseInt(multiResult[5]) + parseInt(multiResult[6])) * 1000)
      const d2 = new Date((parseInt(multiResult[5]) + parseInt(multiResult[6]) + parseInt(multiResult[7])) * 1000)
      if (multiResult[2] === 0) {
        setTime1([0, 1, 0, 0])
        setTime2([0, 1, 0, 0])
      }
      if (multiResult[2] === 1) {
        setTime1([secondsToDhms(new Date(), d1).dDisplay, secondsToDhms(new Date(), d1).hDisplay, secondsToDhms(new Date(), d1).mDisplay, secondsToDhms(new Date(), d1).sDisplay])
        setTime2([0, 1, 0, 0])
      }
      if (multiResult[2] === 2) {
        setTime1([0, 0, 0, 0])
        setTime2([secondsToDhms(new Date(), d2).dDisplay, secondsToDhms(new Date(), d2).hDisplay, secondsToDhms(new Date(), d2).mDisplay, secondsToDhms(new Date(), d2).sDisplay])
      }
      if (multiResult[2] === 3) {
        setTime1([0, 0, 0, 0])
        setTime2([0, 0, 0, 0])
      }
      setDepositData(sumPercent(_depositDataWithPercent))
      setLoaded(true)
    }
    init()
  }, [lotteryContract, key])

  return (
    <div className="flex flex-col-reverse lg:flex-row items-start gap-y-[30px] lg:space-x-[30.26px] gap:space-y-0 mt-[30.89px] w-full overflow-auto lg:pl-[32.64px] lg:pr-[13.16px]">
      <div className="flex flex-col space-y-[15.56px] w-full lg:w-auto px-6 lg:px-0">
        <div className="w-full px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
          <div className="flex bg-inputInner rounded-sm">
            <div className="flex flex-col flex-1 px-[19px] py-[9px] sm:pt-[21.58px] sm:px-[33.4px] sm:pb-[16.84px]">
              <a className="font-medium text-[8.49px] sm:text-[15px] leading-[10.61px] sm:leading-[18.75px]" href={"https://explorer.callisto.network/address/"+key} target="_blank" rel="noreferrer">{key}</a>
              <span className="mt-[2.92px] sm:mt-[5.6px] font-light text-[8px] sm:text-[11px] leading-[8px] sm:leading-[13.75px] tracking-[-0.02em] text-grey1">Contract address</span>
              {loaded ?
                <span className="mt-3 sm:mt-[21.91px] font-medium text-[8.49px] sm:text-[15px] leading-[10.61px] sm:leading-[18.75px]">Round {roundId}</span>
                :
                <div className="mt-3 sm:mt-[21.91px]">
                  <Skeleton variant="text" width={100} sx={{ bgcolor: 'grey.800' }} />
                </div>
              }
              <div className="flex flex-col items-start space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-7 md:space-y-0">
                  <Tooltip title="The lottery is awaiting deposit to start a new round. It will remain in idle state until the next round starts">
                    <div className="flex items-center space-x-[14px] sm:space-x-9 invisible">
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Days</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Hours</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Min</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Sec</span>
                      </div>
                    </div>
                  </Tooltip>
                  <span className="text-[16px]">Idle</span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-7 md:space-y-0">
                  <Tooltip title="Users can deposit funds to participate in the lottery. Anyone can become an entropy provider and submit entropy during this phase as well">
                    <div className={"flex items-center space-x-[14px] sm:space-x-9" + (status !== 1 ? " opacity-10" : "")}>
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{dys1}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Days</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{hrs1}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Hours</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{mins1}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Min</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{secs1}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Sec</span>
                      </div>
                    </div>
                  </Tooltip>
                  <span className="text-[16px]">Deposit phase</span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-7 md:space-y-0">
                  <Tooltip title="The lottery is awaiting for entropy to be revealed by entropy providers. Deposits are not accepted.">
                    <div className={"flex items-center space-x-[14px] sm:space-x-9" + (status !== 2 ? " opacity-10" : "")}>
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{dys2}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Days</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{hrs2}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Hours</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{mins2}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Min</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{secs2}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Sec</span>
                      </div>
                    </div>
                  </Tooltip>
                  <span className="text-[16px]">Reveal phase</span>
                </div>
                <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-x-7 md:space-y-0">
                  <Tooltip title="Winner must be calculated and the reward must be delivered before the next round will start.">
                    <div className="flex items-center space-x-[14px] sm:space-x-9 invisible">
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Days</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Hours</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Min</span>
                      </div>
                      <div className="w-[1.8611px] h-[34.09px] bg-grey5" />
                      <div className="flex flex-col items-center">
                        <span className="font-light text-[19.2px] sm:text-[23.26px] leading-[24px] sm:leading-[29px]">{0}</span>
                        <span className="font-light text-[9px] sm:text-[10.2361px] leading-[11.25px] sm:leading-[13px] text-grey1">Sec</span>
                      </div>
                    </div>
                  </Tooltip>
                  <span className="text-[16px]">Winner calculation</span>
                </div>
              </div>
              {status >= 0 ?
                <span className="mt-3 font-light text-[14px] sm:text-[21px] leading-[100%] tracking-[-0.02em] text-green1">
                  Status:
                  {status === 0 && " The round is finished and reward is already paid and we can start a new round"}
                  {status === 1 && " The round is ongoing (and it is in Deposit phase)"}
                  {status === 2 && " The round is ongoing (and its Reveal phase)"}
                  {status === 3 && " The round is finished and reward must be paid"}
                </span>
                :
                <div className="mt-3">
                  <Skeleton variant="text" sx={{ bgcolor: 'grey.800' }} />
                </div>
              }
              {loaded && account &&
                <div className="flex justify-end items-center space-x-3 mt-[19.3px] font-light text-[8px] sm:text-[12px] leading-[8px] sm:leading-[15px] tracking-[0.02em]">
                  {status === 0 && <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-blue2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleStartRound} disabled={doing}>Start New Round</button>}
                  {status === 1 &&
                    <div className="flex flex-col w-full">
                      <div className="flex space-x-3 justify-end">
                        <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-green2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleDeposit} disabled={doing}>Deposit</button>
                      </div>
                      <span className="mt-5 font-light text-[12.61px] leading-[15.76px] text-white">Become Entropy Provider</span>
                      <div className="mt-2 flex-1 px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
                        <div className="flex items-center space-x-[17.69px] px-[17.39px] py-2.5 bg-inputInner rounded-sm overflow-hidden">
                          <input className="w-full font-light text-[12.61px] leading-[15.76px] placeholder-grey1" placeholder="Entropy" type="number" value={payload} onChange={e => setPayload(e.target.value)} />
                        </div>
                      </div>
                      <div className="mt-2 flex-1 px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
                        <div className="flex items-center space-x-[17.69px] px-[17.39px] py-2.5 bg-inputInner rounded-sm overflow-hidden">
                          <input className="w-full font-light text-[12.61px] leading-[15.76px] placeholder-grey1" placeholder="Salt" type="number" value={salt} onChange={e => setSalt(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-end items-center space-x-3 mt-2">
                        <button className="flex justify-center items-center space-x-1 px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-green2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={download} disabled={doing}>
                          <DownloadIcon fontSize="small" />
                          <span>Download</span>
                        </button>
                        <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-blue2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleGenerateSalt} disabled={doing}>Generate Salt</button>
                        <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-green2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleGenerateEntropy} disabled={doing}>Generate Entropy</button>
                      </div>
                      <span className="mt-2 font-light text-[12.61px] leading-[15.76px] text-red1">Remember payload, salt value for entropy!</span>
                      <div className="flex items-center space-x-3 mt-6">
                        <div className="flex-1 px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
                          <div className="flex items-center space-x-[17.69px] px-[17.39px] py-2.5 bg-inputInner rounded-sm overflow-hidden">
                            <input className="w-full font-light text-[12.61px] leading-[15.76px] text-white placeholder-grey1" placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} type="number" />
                          </div>
                        </div>
                        <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-green2 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleSubmitEntropy} disabled={doing}>Submit Entropy</button>
                      </div>
                      <span className="mt-2 font-light text-[12.61px] leading-[15.76px] text-red1">Do not change it unless you know what you are doing</span>
                    </div>
                  }
                  {status === 2 &&
                    <div className="flex flex-col space-y-2 w-full">
                      <div className="flex-1 px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
                        <div className="flex items-center space-x-[17.69px] px-[17.39px] py-2.5 bg-inputInner rounded-sm overflow-hidden">
                          <input className="w-full font-light text-[12.61px] leading-[15.76px] text-white placeholder-grey1" placeholder="Entropy" type="number" value={payloadForReveal} onChange={e => setPayloadForReveal(e.target.value)} />
                        </div>
                      </div>
                      <div className="px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden w-full">
                        <div className="flex items-center space-x-[17.69px] px-[17.39px] py-2.5 bg-inputInner rounded-sm overflow-hidden">
                          <input className="w-full font-light text-[12.61px] leading-[15.76px] text-white placeholder-grey1" placeholder="Salt" type="number" value={saltForReveal} onChange={(e) => setSaltForReveal(e.target.value)} />
                        </div>
                      </div>
                      <div className="flex justify-end items-center space-x-3 mt-2">
                        <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-red1 disabled:opacity-50 disabled:cursor-not-allowed" onClick={handleRevealEntropy} disabled={doing}>Reveal Entropy</button>
                      </div>
                    </div>
                  }
                  {status === 3 && <button className="flex justify-center items-center px-3 sm:px-6 h-6 sm:h-[32.36px] rounded-tiny sm:rounded-sm bg-red1 disabled:opacity-50 disabled:cursor-not-allowed" disabled={doing} onClick={handleFinishRound}>Finish Current Round</button>}
                </div>
              }
            </div>
            <Tooltip title="This shows total mount of funds locked in this pool.">
              <div className="px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
                <div className="flex flex-col justify-between items-center bg-poolInner rounded-sm pt-5 sm:pt-[24.05px] pb-3 sm:pb-[28.03px] px-[22px] md:px-[50px] h-full">
                  <img className="w-[27.24px] h-[27.24px] sm:w-auto sm:h-auto" src="/images/dollar.svg" alt="" />
                  <span className="mt-2 font-medium text-[20.26px] sm:text-[28.26px] leading-[25.32px] sm:leading-[35.32px] whitespace-nowrap">{total ? total.toString() / Math.pow(10, 18) : <Skeleton variant="text" width={50} sx={{ bgcolor: 'grey.800' }} />}</span>
                  <span className="mt-2 font-light text-[8.22px] sm:text-[13px] leading-[7.78px] sm:leading-[14px] tracking-[-0.02em] text-center whitespace-nowrap">Round Reward Pool</span>
                </div>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:hidden w-full">
        <div className="flex justify-center items-center space-x-[45px]">
          <div className="flex flex-col items-center space-y-3 font-light text-[11px] leading-[13.75px] text-green1">
            <div className="flex justify-center items-center rounded-full transition cursor-pointer">
              <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="4.07593" cy="4.00952" r="2.83813" stroke="currentColor" />
                <circle cx="4.07593" cy="14.1965" r="2.83813" stroke="currentColor" />
                <rect x="10.6753" y="1.17139" width="7.86589" height="15.8633" rx="3.93295" stroke="currentColor" />
              </svg>
            </div>
            <span>Main</span>
          </div>
          <div className="flex flex-col items-center space-y-3 font-light text-[11px] leading-[13.75px] text-grey1 hover:text-white">
            <div className="flex justify-center items-center rounded-full transition cursor-pointer" onClick={() => setOpenConnectModal(true)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.1753 19.8276C4.80582 19.8276 0.449463 15.4713 0.449463 10.1018C0.449463 4.73234 4.80582 0.375977 10.1753 0.375977C15.5448 0.375977 19.9011 4.73234 19.9011 10.1018C19.9011 15.4713 15.5448 19.8276 10.1753 19.8276ZM10.1753 1.59171C5.47447 1.59171 1.66519 5.40099 1.66519 10.1018C1.66519 14.8026 5.47447 18.6119 10.1753 18.6119C14.8761 18.6119 18.6854 14.8026 18.6854 10.1018C18.6854 5.40099 14.8761 1.59171 10.1753 1.59171Z" fill="currentColor" />
                <path d="M9.14386 9.12291L6.58323 13.4336C6.49516 13.5819 6.66209 13.7502 6.81108 13.6634L11.1391 11.1402C11.1639 11.1258 11.1845 11.1052 11.199 11.0804L13.7412 6.75133C13.8286 6.60263 13.6608 6.43516 13.5122 6.52276L9.20265 9.06431C9.17843 9.07859 9.15821 9.09875 9.14386 9.12291Z" stroke="currentColor" strokeWidth="1.2" />
              </svg>
            </div>
            <span>Wallet</span>
          </div>
          <div className="flex flex-col items-center space-y-3 font-light text-[11px] leading-[13.75px] text-grey1 hover:text-white">
            <div className="flex justify-center items-center rounded-full transition cursor-pointer">
              <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15.4499 4.90039C15.4499 4.90039 4.99865 4.90039 3.10445 4.90039C1.83863 4.90039 1.04688 6.13493 1.04688 6.95796V15.7578C1.04688 16.8071 1.89706 17.6573 2.94642 17.6573H15.6079C16.6568 17.6573 17.5074 16.8071 17.5074 15.7578V6.89459C17.5074 5.84646 16.4988 4.90039 15.4499 4.90039Z" stroke="currentColor" strokeWidth="1.4" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14.2153 3.66573V2.29045C14.2153 0.919698 13.9195 0.524232 12.2187 0.972783C10.9693 1.30241 3.65876 3.32911 3.65876 3.32911C1.40736 4.17766 1.06375 4.89986 1.06375 6.54551L1.04688 7.55578" stroke="currentColor" strokeWidth="1.3" strokeMiterlimit="10" strokeLinejoin="round" />
                <path d="M14.8336 12.3076C14.2653 12.3076 13.804 11.8475 13.804 11.2792C13.804 10.7109 14.2653 10.25 14.8336 10.25C15.4002 10.25 15.8615 10.7109 15.8615 11.2792C15.8615 11.8475 15.4002 12.3076 14.8336 12.3076Z" fill="currentColor" />
              </svg>
            </div>
            <span>Message</span>
          </div>
          <div className="flex flex-col items-center space-y-3 font-light text-[11px] leading-[13.75px] text-grey1 hover:text-white">
            <div className="flex justify-center items-center rounded-full transition cursor-pointer">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.76823 21.1826C4.87926 21.1826 4.98901 21.1589 5.09013 21.1131C5.19124 21.0672 5.28139 21.0002 5.35452 20.9167L7.84355 18.0725C8.84579 18.3305 9.87668 18.4605 10.9116 18.4594C13.6707 18.4594 16.275 17.561 18.2405 15.9329C20.2466 14.2712 21.3517 12.046 21.3517 9.67066C21.3517 7.29536 20.2445 5.0717 18.2405 3.40889C16.275 1.78087 13.6707 0.884033 10.9116 0.884033C8.15253 0.884033 5.54822 1.78087 3.58421 3.40889C1.57814 5.07066 0.473581 7.29588 0.473581 9.67066C0.473581 12.2059 1.74951 14.5833 3.98927 16.2513V20.4057C3.98927 20.6123 4.07134 20.8104 4.21742 20.9565C4.3635 21.1026 4.56163 21.1847 4.76823 21.1847V21.1826ZM7.5813 16.4112C7.47027 16.4112 7.36051 16.4349 7.2594 16.4808C7.15828 16.5266 7.06813 16.5936 6.995 16.6771L5.54718 18.3311V15.8509C5.54704 15.724 5.51588 15.599 5.45642 15.4869C5.39695 15.3747 5.31099 15.2788 5.206 15.2075C3.18694 13.8266 2.02942 11.8086 2.02942 9.67066C2.02942 5.685 6.013 2.44195 10.9095 2.44195C15.806 2.44195 19.7896 5.685 19.7896 9.67066C19.7896 13.6563 15.8081 16.9014 10.9116 16.9014C9.86036 16.9038 8.81456 16.7505 7.80823 16.4465C7.73476 16.4236 7.65827 16.4117 7.5813 16.4112Z" fill="currentColor" />
                <path d="M13.6972 11.8123C13.7227 11.8123 13.7491 11.8123 13.7735 11.8086C13.798 11.805 13.8255 11.8019 13.8494 11.7972C13.8733 11.7925 13.9013 11.7858 13.9231 11.7785C13.9449 11.7712 13.9719 11.7624 13.9953 11.7525C14.0187 11.7427 14.0415 11.7318 14.0638 11.7198C14.0865 11.708 14.1085 11.695 14.1298 11.6809C14.1506 11.6669 14.1713 11.6518 14.1911 11.6357C14.2108 11.6196 14.23 11.6019 14.2482 11.5838C14.2664 11.5656 14.2835 11.5464 14.3001 11.5266C14.3167 11.5069 14.3313 11.4861 14.3453 11.4654C14.3594 11.4441 14.3724 11.422 14.3842 11.3994C14.3964 11.3769 14.4073 11.3541 14.417 11.3309C14.4267 11.3074 14.4352 11.2835 14.4424 11.2592C14.4502 11.2349 14.4564 11.2101 14.4611 11.1849C14.4664 11.1601 14.4702 11.135 14.4725 11.1096C14.4752 11.0841 14.4766 11.0585 14.4767 11.0328C14.4766 11.0073 14.4752 10.9818 14.4725 10.9564C14.4674 10.9056 14.4573 10.8553 14.4424 10.8064C14.4352 10.7821 14.4267 10.7581 14.417 10.7347C14.4069 10.7115 14.396 10.6887 14.3842 10.6662C14.3724 10.6435 14.3594 10.6215 14.3453 10.6002C14.3313 10.5794 14.3162 10.5587 14.3001 10.5389C14.284 10.5192 14.2664 10.5 14.2482 10.4818C14.23 10.4636 14.2108 10.4465 14.1911 10.4299C14.1713 10.4133 14.1506 10.3987 14.1298 10.3847C14.1086 10.3704 14.0866 10.3574 14.0638 10.3457C14.0413 10.334 14.0185 10.3231 13.9953 10.313C13.9717 10.3031 13.9476 10.2944 13.9231 10.2871C13.8992 10.2798 13.8743 10.2736 13.8494 10.2684C13.8244 10.2632 13.7974 10.2595 13.7735 10.2569C13.7226 10.2518 13.6713 10.2518 13.6204 10.2569C13.5954 10.2595 13.5684 10.2637 13.5451 10.2684C13.5217 10.273 13.4931 10.2798 13.4708 10.2871C13.4465 10.2945 13.4226 10.3032 13.3991 10.313C13.3758 10.3229 13.3524 10.3338 13.3301 10.3457C13.3076 10.3575 13.2857 10.3705 13.2646 10.3847C13.2434 10.3987 13.223 10.4138 13.2034 10.4299C13.1836 10.446 13.1644 10.4636 13.1462 10.4818C13.1281 10.5 13.1109 10.5192 13.0943 10.5389C13.0777 10.5587 13.0631 10.5794 13.0491 10.6002C13.035 10.6215 13.022 10.6435 13.0102 10.6662C12.9984 10.6887 12.9875 10.7115 12.9775 10.7347C12.9676 10.7581 12.9593 10.7825 12.9515 10.8064C12.9437 10.8303 12.938 10.8583 12.9328 10.8806C12.9226 10.9307 12.9176 10.9817 12.9177 11.0328C12.9176 11.0585 12.9189 11.0841 12.9214 11.1096C12.9239 11.1349 12.9277 11.1601 12.9328 11.1849C12.938 11.2099 12.9442 11.2369 12.9515 11.2592C12.9588 11.2815 12.9676 11.3075 12.9775 11.3309C12.9873 11.3542 12.9982 11.3771 13.0102 11.3994C13.022 11.422 13.035 11.4441 13.0491 11.4654C13.0631 11.4861 13.0782 11.5069 13.0943 11.5266C13.1104 11.5464 13.1281 11.5656 13.1462 11.5838C13.1644 11.6019 13.1836 11.6191 13.2034 11.6357C13.223 11.6518 13.2434 11.6669 13.2646 11.6809C13.2861 11.6947 13.3079 11.7077 13.3301 11.7198C13.3524 11.7318 13.3758 11.7427 13.3991 11.7525C13.4225 11.7624 13.4469 11.7707 13.4708 11.7785C13.4947 11.7863 13.5201 11.792 13.5451 11.7972C13.57 11.8024 13.597 11.806 13.6204 11.8086C13.6437 11.8112 13.6707 11.8123 13.6972 11.8123Z" fill="currentColor" />
                <path d="M7.93235 11.8122C7.95784 11.8123 7.98332 11.8111 8.00869 11.8086C8.03413 11.806 8.06062 11.8019 8.0845 11.7972C8.10839 11.7925 8.13643 11.7858 8.15825 11.7785C8.18006 11.7712 8.20654 11.7624 8.22991 11.7525C8.25328 11.7427 8.27665 11.7317 8.29898 11.7198C8.34376 11.6958 8.38619 11.6676 8.42569 11.6357C8.44542 11.6196 8.46463 11.6019 8.48229 11.5837C8.50055 11.5656 8.51789 11.5465 8.53422 11.5266C8.55032 11.5069 8.5659 11.4861 8.57992 11.4653C8.59401 11.444 8.607 11.422 8.61887 11.3994C8.63064 11.3769 8.64154 11.354 8.65158 11.3308C8.66093 11.3075 8.66976 11.2831 8.67703 11.2592C8.68478 11.2348 8.69102 11.21 8.69573 11.1849C8.70574 11.1348 8.71096 11.0839 8.7113 11.0328C8.71121 11.0071 8.70983 10.9814 8.70715 10.9559C8.70461 10.9306 8.7008 10.9055 8.69573 10.8806C8.69102 10.8555 8.68478 10.8307 8.67703 10.8063C8.66976 10.7825 8.66093 10.758 8.65158 10.7347C8.64224 10.7113 8.63081 10.6885 8.61887 10.6661C8.607 10.6435 8.59401 10.6215 8.57992 10.6002C8.5659 10.5794 8.55032 10.5586 8.53422 10.5389C8.51789 10.519 8.50055 10.4999 8.48229 10.4818C8.46463 10.4641 8.44542 10.4465 8.42569 10.4298C8.38602 10.3979 8.34342 10.3697 8.29846 10.3457C8.27613 10.3338 8.25328 10.3229 8.22939 10.313C8.2055 10.3031 8.18213 10.2948 8.15773 10.287C8.13332 10.2793 8.10891 10.2735 8.08399 10.2683C8.05906 10.2632 8.03205 10.2595 8.00817 10.2569C7.95635 10.2521 7.90419 10.2521 7.85237 10.2569C7.82745 10.2595 7.80044 10.2637 7.77708 10.2683C7.75371 10.273 7.72514 10.2798 7.70281 10.287C7.68048 10.2943 7.65452 10.3031 7.63115 10.313C7.60778 10.3229 7.58441 10.3338 7.56208 10.3457C7.53975 10.3577 7.51794 10.3706 7.49665 10.3847C7.47538 10.3985 7.45492 10.4136 7.43537 10.4298C7.41564 10.4459 7.39643 10.4636 7.37825 10.4818C7.36007 10.5 7.34294 10.5192 7.32632 10.5389C7.3097 10.5586 7.29516 10.5794 7.28114 10.6002C7.26688 10.6215 7.25371 10.6435 7.24167 10.6661C7.23025 10.6885 7.21882 10.7113 7.20948 10.7347C7.1996 10.7581 7.19093 10.782 7.18351 10.8063C7.17624 10.8308 7.17001 10.8583 7.16482 10.8806C7.15962 10.9029 7.15599 10.9325 7.15339 10.9559C7.15088 10.9814 7.14967 11.0071 7.14976 11.0328C7.14966 11.0583 7.15087 11.0837 7.15339 11.1091C7.15599 11.1345 7.16014 11.161 7.16482 11.1849C7.16949 11.2088 7.17624 11.2368 7.18351 11.2592C7.19093 11.2835 7.1996 11.3074 7.20948 11.3308C7.21882 11.3542 7.23025 11.3771 7.24167 11.3994C7.25371 11.422 7.26688 11.444 7.28114 11.4653C7.29516 11.4861 7.31022 11.5069 7.32632 11.5266C7.34242 11.5464 7.36007 11.5656 7.37825 11.5837C7.39643 11.6019 7.41564 11.6191 7.43537 11.6357C7.45492 11.6519 7.47538 11.667 7.49665 11.6809C7.51777 11.6947 7.53958 11.7077 7.56208 11.7198C7.58441 11.7317 7.60778 11.7427 7.63115 11.7525C7.65452 11.7624 7.67893 11.7707 7.70281 11.7785C7.7267 11.7863 7.75215 11.792 7.77708 11.7972C7.802 11.8024 7.82901 11.806 7.85237 11.8086C7.87895 11.8112 7.90564 11.8124 7.93235 11.8122Z" fill="currentColor" />
                <path d="M10.8145 11.8123C11.021 11.8118 11.219 11.7299 11.3655 11.5843C11.3838 11.5662 11.4011 11.5471 11.4175 11.5272C11.4336 11.5075 11.4486 11.4867 11.4632 11.4659C11.4777 11.4452 11.4902 11.4228 11.5021 11.4C11.5141 11.3777 11.5248 11.3549 11.5343 11.3314C11.5442 11.308 11.5528 11.2841 11.5603 11.2598C11.5675 11.2354 11.5738 11.2078 11.579 11.1855C11.584 11.1606 11.5878 11.1355 11.5904 11.1102C11.5954 11.0584 11.5954 11.0062 11.5904 10.9544C11.5878 10.9291 11.584 10.904 11.579 10.8791C11.5738 10.8542 11.5675 10.8272 11.5603 10.8049C11.5528 10.7805 11.5442 10.7566 11.5343 10.7332C11.5248 10.7098 11.5141 10.6869 11.5021 10.6647C11.4902 10.6418 11.4767 10.62 11.4632 10.5987C11.4497 10.5774 11.4336 10.5572 11.4175 10.5374C11.4011 10.5175 11.3838 10.4984 11.3655 10.4803C11.2838 10.3992 11.1852 10.3371 11.0768 10.2983C10.9684 10.2595 10.8528 10.2451 10.7382 10.256C10.7128 10.2586 10.6863 10.2627 10.6624 10.2674C10.6385 10.2721 10.6131 10.2788 10.5886 10.2861C10.5642 10.2933 10.5403 10.3022 10.517 10.312C10.4936 10.3219 10.4702 10.3328 10.4479 10.3448C10.4029 10.3687 10.3603 10.3969 10.3207 10.4289C10.3009 10.445 10.2817 10.4626 10.2641 10.4808C10.2458 10.499 10.2285 10.518 10.2121 10.5379C10.196 10.5577 10.1805 10.5784 10.1664 10.5992C10.1524 10.6205 10.1394 10.6425 10.1275 10.6652C10.1157 10.6877 10.1048 10.7105 10.0948 10.7337C10.0854 10.7571 10.0766 10.7815 10.0693 10.8054C10.0616 10.8297 10.0553 10.8545 10.0506 10.8796C10.0456 10.9045 10.0418 10.9297 10.0392 10.9549C10.0335 11.0067 10.0335 11.059 10.0392 11.1107C10.0418 11.136 10.0456 11.1611 10.0506 11.186C10.0553 11.2111 10.0616 11.2359 10.0693 11.2603C10.0766 11.2842 10.0854 11.3086 10.0948 11.332C10.1041 11.3553 10.1156 11.3782 10.1275 11.4005C10.1394 11.4231 10.1524 11.4451 10.1664 11.4665C10.1805 11.4872 10.196 11.508 10.2121 11.5277C10.2285 11.5476 10.2458 11.5667 10.2641 11.5849C10.2817 11.6025 10.3009 11.6197 10.3207 11.6368C10.3603 11.6688 10.4029 11.6969 10.4479 11.7209C10.4702 11.7329 10.4936 11.7438 10.517 11.7536C10.5403 11.7635 10.5642 11.7718 10.5886 11.7796C10.6131 11.7874 10.6406 11.7931 10.6624 11.7983C10.6842 11.8035 10.7143 11.8071 10.7382 11.8097C10.7636 11.8119 10.7891 11.8127 10.8145 11.8123Z" fill="currentColor" />
              </svg>
            </div>
            <span>History</span>
          </div>
        </div>
        <div className="mt-5 w-full h-[1px] bg-grey8" />
      </div>
      <div className="flex flex-col space-y-5 flex-1">
        <div className="lg:px-[1px] lg:py-[1px] lg:bg-inputOuter rounded-sm px-6 lg:px-0">
          <div className="flex flex-col items-start lg:bg-inputInner rounded-sm lg:pl-[23.05px] lg:pr-[23.31px] lg:py-[18.77px]">
            <span className="font-medium text-[20px] leading-[25px]">Details</span>
            <div className="flex flex-col space-y-[13px] mt-[10px] w-full px-[1px] py-[1px] overflow-hidden">
              <div className="bg-inputOuter p-[1px] rounded-sm">
                <Tooltip title="This shows balance of your wallet, a pool of funds that you can use to recharge and deposit.">
                  <div className="flex flex-col items-start flex-1 px-[17px] py-[15px] rounded-sm bg-pp bg-cover backdrop-blur h-full">
                    <span className="font-medium text-[11px] lg:text-[14px] leading-[13.75px] lg:leading-[17.5px]">Wallet Balance</span>
                    <span className="flex items-center font-medium text-[22px] lg:text-[23.26px] leading-[27.5px] lg:leading-[29.08px] mt-[7.74px]">
                      {account ? (balance / Math.pow(10, 18)).toFixed(2) : <Skeleton variant="text" width={50} sx={{ bgcolor: 'grey.700' }} />}
                      <span className="ml-2">CLO</span>
                    </span>
                  </div>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
        {(status === 1 || status === 2 || status === 3) &&
          <div className="lg:px-[1px] lg:py-[1px] lg:bg-inputOuter rounded-sm px-6 lg:px-0">
            <div className="flex flex-col items-start lg:bg-inputInner rounded-sm lg:pl-[23.05px] lg:pr-[23.31px] lg:py-[18.77px]">
              <span className="font-medium text-[20px] leading-[25px]">Participants</span>
              <div className="flex flex-col space-y-[13px] mt-[10px] w-full px-[1px] py-[1px] overflow-hidden text-black3 font-normal text-[12px]">
                {loaded ?
                  (depositData.length > 0 ?
                    depositData.map((x, i) =>
                      <span key={i}>{x.depositor} : {x.amount_deposited} CLO : chance to win {x.percent}%</span>
                    )
                    :
                    <span>There are no participants.</span>
                  )
                  :
                  <span>The info is loading...</span>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default Lottery;