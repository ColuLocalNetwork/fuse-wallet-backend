const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '.', '.env')
})
const Web3 = require('web3')
const fetch = require('node-fetch')
const EthUtil = require('ethereumjs-util')
const TOKEN_ABI = require(path.join(__dirname, '../../config/abi/ERC677BridgeToken.json'))

const {
  HOME_RPC_URL,
  TOKEN_ADDRESS,
  FROM_ACCOUNT,
  FROM_ACCOUNT_PKEY,
  TO_ACCOUNT,
  FEE_WEI,
  AMOUNT_WEI,
  RELAYER_API_URL
} = process.env

const web3 = new Web3(new Web3.providers.HttpProvider(HOME_RPC_URL))

async function main () {
  const toBufferStripPrefix = str => Buffer.from(EthUtil.stripHexPrefix(str), 'hex')

  const token = new web3.eth.Contract(TOKEN_ABI, TOKEN_ADDRESS)

  const nonce = await token.methods.getNextNonceForAddress(FROM_ACCOUNT).call()
  console.log('nonce', nonce)
  console.log(`=====================================`)

  const fromBalanceBefore = await web3.eth.getBalance(FROM_ACCOUNT)
  const toBalanceBefore = await web3.eth.getBalance(TO_ACCOUNT)
  console.log(`fromBalanceBefore: ${fromBalanceBefore}, toBalanceBefore: ${toBalanceBefore}`)

  const fromTokenBalanceBefore = await token.methods.balanceOf(FROM_ACCOUNT).call()
  const toTokenBalanceBefore = await token.methods.balanceOf(TO_ACCOUNT).call()
  console.log(`fromTokenBalanceBefore: ${fromTokenBalanceBefore}, toTokenBalanceBefore: ${toTokenBalanceBefore}`)

  console.log(`=====================================`)

  const amountWei = web3.utils.toBN(AMOUNT_WEI)
  const feeWei = web3.utils.toBN(FEE_WEI)

  const msg = await token.methods.getTransferPreSignedHash(TOKEN_ADDRESS, TO_ACCOUNT, amountWei, feeWei, nonce).call()
  console.log('msg', msg)
  const vrs = EthUtil.ecsign(toBufferStripPrefix(msg), toBufferStripPrefix(FROM_ACCOUNT_PKEY))
  const sig = EthUtil.toRpcSig(vrs.v, vrs.r, vrs.s)
  console.log('sig', sig)

  console.log(`=====================================`)

  const request = await fetch(RELAYER_API_URL, {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      token_address: TOKEN_ADDRESS,
      from_account: FROM_ACCOUNT,
      to_account: TO_ACCOUNT,
      amount_wei: amountWei,
      nonce: nonce,
      sig: sig
    })
  })
  const json = await request.json()
  console.log('json', json)

  console.log(`=====================================`)

  const fromBalanceAfter = await web3.eth.getBalance(FROM_ACCOUNT)
  const toBalanceAfter = await web3.eth.getBalance(TO_ACCOUNT)
  console.log(`fromBalanceAfter: ${fromBalanceAfter}, toBalanceAfter: ${toBalanceAfter}`)

  const fromTokenBalanceAfter = await token.methods.balanceOf(FROM_ACCOUNT).call()
  const toTokenBalanceAfter = await token.methods.balanceOf(TO_ACCOUNT).call()
  console.log(`fromTokenBalanceAfter: ${fromTokenBalanceAfter}, toTokenBalanceAfter: ${toTokenBalanceAfter}`)
}

main().catch(err => console.error(err))
