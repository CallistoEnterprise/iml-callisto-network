import '@nomiclabs/hardhat-ethers'
import { ethers } from 'hardhat'
import { expect } from 'chai'
import { mineNext } from './helpers'
import { formatEther, parseEther } from 'ethers/lib/utils'

// function random(uint256 to) public returns (uint) {
//   uint randomnumber = uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, nonce))) % to;
//   nonce++;
//   return randomnumber;
// }

const _entropy_hash1 = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256" ], [ parseEther("100"), 12 ]))
const _entropy_hash2 = ethers.utils.sha256(ethers.utils.defaultAbiCoder.encode([ "uint256", "uint256" ], [ parseEther("200"), 34 ]))

export default describe('Lottery', function () {
  before(async function () {
    const [owner, challenger] = await ethers.getSigners()
    this.owner = owner
    this.challenger = challenger

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
    await this.lottery.start_new_round({ value: parseEther('0.2').toString() })
    console.log('User A deposited 0.2 CLO')
    await this.lottery.deposit({ value: parseEther('0.2').toString() })
    console.log('User A deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    await this.lottery.connect(this.challenger).deposit({ value: parseEther('0.2').toString() })
    console.log('User B deposited 0.2 CLO')
    
    mineNext()
    console.log('\n🏆 Round', (await this.lottery.get_round()).toString())
    
    // Use entropy
    await this.lottery.new_round_entropy()
    await this.entropy.submit_entropy(_entropy_hash1, {value: parseEther("0.2")})
    await this.entropy.connect(this.challenger).submit_entropy(_entropy_hash2, {value: parseEther("0.2")})
    mineNext()
    console.log('User A entropy_hash:', (await this.entropy.entropy_providers(this.owner.address)).entropy_hash)
    console.log('User B entropy_hash:', (await this.entropy.entropy_providers(this.challenger.address)).entropy_hash)
    
    mineNext()
    await this.entropy.reveal_entropy(parseEther("100"), 12)
    await this.entropy.connect(this.challenger).reveal_entropy(parseEther("200"), 34)
    await this.entropy.connect(this.challenger).reveal_entropy(parseEther("200"), 34)

    mineNext()
    console.log('entropy:', formatEther(await this.entropy.get_entropy()))
  })

  it('finish round', async function () {
    mineNext()
    console.log('round_reward:', formatEther(await this.lottery.round_reward()))

    mineNext()
    const lastBalanceA = await this.owner.getBalance()
    const lastBalanceB = await this.challenger.getBalance()

    mineNext()
    await this.lottery.connect(this.owner).finish_round(this.owner.address)
    await this.lottery.connect(this.challenger).finish_round(this.challenger.address)

    mineNext()
    const balanceA = await this.owner.getBalance()
    const balanceB = await this.challenger.getBalance()
    console.log(`User A: ${formatEther(lastBalanceA)} -> ${formatEther(balanceA)}`)
    console.log(`User B: ${formatEther(lastBalanceB)} -> ${formatEther(balanceB)}`)
  })
})
