import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import { mineNext } from './helpers'
import { formatEther, parseEther } from 'ethers/lib/utils'

const provider = ethers.provider
const _entropy_hash = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256" ], [ parseEther("500"), 46 ]))

export default describe('Lottery', function () {
  before(async function () {
    const [owner] = await ethers.getSigners()
    this.owner = owner

    this.lottery = await (await ethers.getContractFactory('Lottery')).deploy()
    this.entropy = await (await ethers.getContractFactory('Entropy')).deploy()

    this.entropyAddress = this.entropy.address
    this.lotteryAddress = this.lottery.address

    this.timeout(0)
    await owner.sendTransaction({
      to: this.lotteryAddress,
      value: parseEther('7000'),
    })
  })

  it('set entropy address of lottery contract', async function () {
    mineNext()
    await this.lottery.set_entropy_contract(this.entropyAddress)

    mineNext()
    expect(await this.lottery.entropy_contract()).to.equal(this.entropyAddress)
  })

  it('set lottery address of entropy contract', async function () {
    mineNext()
    await this.entropy.set_lottery_contract(this.lotteryAddress)

    mineNext()
    expect(await this.entropy.lottery_contract()).to.equal(this.lotteryAddress)
  })

  it('start new round', async function () {
    mineNext()
    await this.lottery.start_new_round({ value: parseEther('1001').toString() })
    console.log('Deposited 1001 CLO')
    await this.lottery.deposit({ value: parseEther('1001').toString() })
    console.log('Deposited 1001 CLO')
    
    mineNext()
    console.log('🏆 Round', (await this.lottery.get_round()).toString())
    
    // Use entropy
    await this.lottery.new_round_entropy()
    await this.entropy.submit_entropy(_entropy_hash, {value: parseEther("100")})
    mineNext()
    console.log('entropy_hash:', (await this.entropy.entropy_providers(this.owner.address)).entropy_hash)
    
    mineNext()
    await this.entropy.reveal_entropy(parseEther("500"), 46)

    mineNext()
    console.log('entropy:', await this.entropy.get_entropy())
  })

  it('finish round', async function () {
    mineNext()
    console.log('round_reward:', formatEther(await this.lottery.round_reward()))

    mineNext()
    let balance = await this.owner.getBalance()
    console.log('balance of winner(1):', formatEther(balance))

    mineNext()
    await this.lottery.finish_round(this.owner.address)

    mineNext()
    balance = await this.owner.getBalance()
    console.log('balance of winner(2):', formatEther(balance))
  })
})
