import { useMemo, useState } from "react";
import { Tooltip, Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
import { ethers } from "ethers";

const Card = ({ address }) => {
	const [total, setTotal] = useState()

	useMemo(async () => {
		if (address?.length > 0) {
			const provider = new ethers.providers.JsonRpcProvider("https://rpc.callisto.network");
			const _total = await provider.getBalance(address)
			setTotal(_total);
		}
	}, [address])

	return (
		<Link className="w-full px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden" to={"/lottery/" + address}>
			<div className="flex bg-inputInner rounded-sm">
				<div className="flex flex-col items-start flex-1 px-[19px] py-[9px] sm:pt-[21.58px] sm:px-[33.4px] sm:pb-[16.84px]">
					<a className="font-medium text-[8.49px] sm:text-[15px] leading-[10.61px] sm:leading-[18.75px]" href={"https://explorer.callisto.network/address/" + address} target="_blank" rel="noreferrer">{address}</a>
					<span className="mt-[2.92px] sm:mt-[5.6px] font-light text-[8px] sm:text-[11px] leading-[8px] sm:leading-[13.75px] tracking-[-0.02em] text-grey1">Contract address</span>
					<div className="flex items-center space-x-2 mt-5 font-medium text-[15px] leading-[18.75px]">
						<span>10</span>
						<div className="w-3 h-3 rounded-[2px] bg-green2" />
					</div>
					<span className="mt-1 text-[11px] leading-[13.75px] tracking-[-0.02em] text-grey1">Deposit to enter the lottery</span>
				</div>
				<Tooltip title="This shows total mount of funds locked in this pool.">
					<div className="px-[1px] py-[1px] bg-inputOuter rounded-sm overflow-hidden">
						<div className="flex flex-col justify-between items-center bg-poolInner rounded-sm pt-5 sm:pt-[24.05px] pb-3 sm:pb-[28.03px] px-[22px] md:px-[50px] h-full">
							<img className="w-[27.24px] h-[27.24px] sm:w-auto sm:h-auto" src="/images/dollar.svg" alt="" />
							<span className="mt-2 font-medium text-[20.26px] sm:text-[28.26px] leading-[25.32px] sm:leading-[35.32px] whitespace-nowrap">{total ? (total.toString() / Math.pow(10, 18)).toFixed(3) : <Skeleton variant="text" width={50} sx={{ bgcolor: 'grey.800' }} />}</span>
							<span className="mt-2 font-light text-[8.22px] sm:text-[13px] leading-[7.78px] sm:leading-[14px] tracking-[-0.02em] text-center whitespace-nowrap">Round Reward Pool</span>
						</div>
					</div>
				</Tooltip>
			</div>
		</Link>
	)
}

export default Card;