import { useMemo, useState } from "react";
import { Tooltip, Skeleton, LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import { Contract, Provider, setMulticallAddress } from "ethers-multicall";
import { ROUTERS } from "../contracts/config";
import { Help } from "@mui/icons-material";

const Card = ({ address }) => {
	const [total, setTotal] = useState()
	const [maxDepositPool, setMaxDepositPool] = useState()
	const [status, setStatus] = useState("-1")
	const [roundId, setRoundId] = useState()
	const [minAllowedBet, setMinAllowedBet] = useState()

	useMemo(async () => {
		if (address?.length > 0) {
			const provider = new ethers.providers.JsonRpcProvider("https://rpc.callisto.network");
			const _total = await provider.getBalance(address)
			setTotal(_total);

			const ethcallProvider = new Provider(provider);
			setMulticallAddress(820, "0x914D4b9Bb542077BeA48DE5E3D6CF42e7ADfa1aa");
			await ethcallProvider.init();
			const _lotteryContract = new Contract(address, ROUTERS.LOTTERY_MULTICALL.abi);
			const _tmp = await ethcallProvider.all([
				_lotteryContract.get_phase(),
				_lotteryContract.max_deposit_pool_threshold(),
				_lotteryContract.current_round(),
				_lotteryContract.min_allowed_bet(),
			]);
			setStatus(_tmp[0])
			setMaxDepositPool(_tmp[1])
			setRoundId(_tmp[2].toNumber())
			setMinAllowedBet(ethers.utils.formatEther(_tmp[3]))
		}
	}, [address])

	return (
		<Link className="w-full px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden" to={"/lottery/" + address}>
			<div className="flex bg-inputInner rounded-sm">
				<div className="flex flex-col items-start flex-1 px-[19px] py-[9px] sm:pt-[21.58px] sm:px-[33.4px] sm:pb-[16.84px]">
					<a className="font-medium text-[8.49px] sm:text-[15px] leading-[10.61px] sm:leading-[18.75px]" href={"https://explorer.callisto.network/address/" + address} target="_blank" rel="noreferrer">{address}</a>
					<span className="mt-[2.92px] sm:mt-[5.6px] font-light text-[8px] sm:text-[11px] leading-[8px] sm:leading-[13.75px] tracking-[-0.02em] text-grey1">Contract address</span>
					<div className="flex items-center space-x-1 mt-3 sm:mt-[21.91px]">
						<span className="font-medium text-[8.49px] sm:text-[15px] leading-[10.61px] sm:leading-[18.75px]">Round {roundId}</span>
						<Tooltip title="This shows number of round.">
							<Help className="-mt-1" fontSize="small" />
						</Tooltip>
					</div>
					<div className="flex items-center space-x-2 mt-5 font-medium text-[15px] leading-[18.75px]">
						{minAllowedBet ?
							<>
								<span>{minAllowedBet}</span>
								<div className="w-3 h-3 rounded-[2px] bg-green2" />
							</>
							:
							<Skeleton variant="text" width={100} sx={{ bgcolor: 'grey.800' }} />
						}
					</div>
					<span className="mt-1 text-[11px] leading-[13.75px] tracking-[-0.02em] text-grey1">Deposit to enter the lottery</span>
					{status >= 0 ?
						<div className="mt-3 font-light text-[14px] sm:text-[21px] leading-[110%] tracking-[-0.02em] text-green1 max-w-[400px] bg-inputOuter p-[1px] rounded-sm">
							<div className="bg-inputInner rounded-sm p-3">
								Status:
								{status === 0 && " The round is finished and reward is already paid and we can start a new round"}
								{status === 1 && " The round is ongoing (and it is in Deposit phase)"}
								{status === 2 && " The round is ongoing (and its Reveal phase)"}
								{status === 3 && " The round is finished and reward must be paid"}
							</div>
						</div>
						:
						<div className="mt-3">
							<Skeleton variant="text" width={100} sx={{ bgcolor: 'grey.800' }} />
						</div>
					}
				</div>
				<Tooltip title="This shows total mount of funds locked in this pool.">
					<div className="px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
						<div className="flex flex-col justify-between items-center bg-poolInner rounded-sm pt-5 sm:pt-[24.05px] pb-3 sm:pb-[28.03px] px-[22px] md:px-[50px] h-full">
							<span className="mt-2 font-light text-[8.22px] sm:text-[13px] leading-[7.78px] sm:leading-[14px] tracking-[-0.02em] text-center whitespace-nowrap">Current Deposit</span>
							<span className="mt-2 font-medium text-[20.26px] sm:text-[28.26px] leading-[25.32px] sm:leading-[35.32px] whitespace-nowrap">{total ? (total.toString() / Math.pow(10, 18)).toFixed(3) : <Skeleton variant="text" width={50} sx={{ bgcolor: 'grey.800' }} />}</span>
							<span className="mt-6 font-light text-[8.22px] sm:text-[13px] leading-[7.78px] sm:leading-[14px] tracking-[-0.02em] text-center whitespace-nowrap text-green2">Max Deposit</span>
							<span className="mt-2 font-medium text-[20.26px] sm:text-[28.26px] leading-[25.32px] sm:leading-[35.32px] whitespace-nowrap text-green2">{maxDepositPool ? (maxDepositPool.toString() / Math.pow(10, 18)).toFixed(3) : <Skeleton variant="text" width={50} sx={{ bgcolor: 'grey.800' }} />}</span>
							<div className="mt-6 w-full">
								{total && maxDepositPool ?
									<LinearProgress variant="determinate" className="progress" value={total / maxDepositPool * 100 > 100 ? 100 : total / maxDepositPool * 100} />
									:
									<Skeleton variant="text" sx={{ bgcolor: 'grey.800' }} />
								}
							</div>
							<span className="mt-2 font-light text-[8.22px] sm:text-[13px] leading-[7.78px] sm:leading-[14px] tracking-[-0.02em] text-center whitespace-nowrap">Round Reward Pool</span>
						</div>
					</div>
				</Tooltip>
			</div>
		</Link>
	)
}

export default Card;