import ENTROPY_ABI from './ENTROPY_ABI.json'
import LOTTERY_ABI from './LOTTERY_ABI.json'
import LOTTERY_MULTICALL_ABI from './LOTTERY_MULTICALL_ABI.json'

export const ROUTERS = {
    ENTROPY: {
        abi: ENTROPY_ABI,
    },
    LOTTERY: {
        abi: LOTTERY_ABI,
    },
    LOTTERY_MULTICALL: {
        abi: LOTTERY_MULTICALL_ABI,
    }
}