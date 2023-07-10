import { useMemo } from "react"
import { Contract } from "@ethersproject/contracts"
import { useWeb3React as useWeb3ReactCore } from '@web3-react/core'
import { ROUTERS } from "../contracts/config"
import { ethers } from "ethers"
import Web3 from "web3"

export const useActiveWeb3React = () => {
    const context = useWeb3ReactCore();
    const contextNetwork = useWeb3ReactCore('NETWORK')
    return context.active ? context : contextNetwork
}

export const useContract = (address, ABI, withSignerIfPossible = true) => {
    window.web3 = new Web3(window.ethereum);
    return useMemo(() => {
        if (!address || !ABI) {
            return null
        }
        try {
            const provider = new ethers.providers.JsonRpcProvider("https://rpc.callisto.network");
            return new Contract(address, ABI, provider)
        } catch (error) {
            console.error('Failed to get contract', error)
            return null
        }
    }, [address, ABI])
}


export const useEntropy = (address) => {
    return useContract(address, ROUTERS.ENTROPY.abi, true)
}

export const useLottery = (address) => {
    return useContract(address, ROUTERS.LOTTERY.abi, true)
}