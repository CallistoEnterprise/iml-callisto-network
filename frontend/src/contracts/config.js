import ENTROPY_ABI from './ENTROPY_ABI.json'
import LOTTERY_ABI from './LOTTERY_ABI.json'
import LOTTERY_MULTICALL_ABI from './LOTTERY_MULTICALL_ABI.json'

export const ROUTERS = {
    ENTROPY: {
        abi: ENTROPY_ABI,
        address: '0xad4e8434649BDa8bD2fF27e2e3E5a49BC3d5A661'
    },
    LOTTERY: {
        abi: LOTTERY_ABI,
        address: '0x97434C6863F4512d2630AA2c809E01DBf99d824B'
    },
    LOTTERY_MULTICALL: {
        abi: LOTTERY_MULTICALL_ABI,
        address: '0x97434C6863F4512d2630AA2c809E01DBf99d824B'
    }
}