const fetch = require('node-fetch')
const EthUtil = require('ethereumjs-util')
const EthTx = require('ethereumjs-tx')
const Web3Utils = require('web3-utils')

const add0xPrefix = (s) => s.indexOf('0x') === 0 ? s : `0x${s}`

const privateKeyToAddress = (privateKey) => this.osseus.web3.eth.accounts.privateKeyToAccount(add0xPrefix(privateKey)).address

const toBufferStripPrefix = str => Buffer.from(EthUtil.stripHexPrefix(str), 'hex')

const sendRawTx = async ({ data, nonce, to, privateKey, url, value }) => {
  try {
    const rawTx = {
      nonce,
      gasPrice: Web3Utils.toHex(this.osseus.config.gas_price_wei || 1000000000),
      gasLimit: Web3Utils.toHex(this.osseus.config.gas_limit_wei || 5000000),
      to,
      data,
      value
    }

    const tx = new EthTx(rawTx)
    tx.sign(privateKey)
    const serializedTx = tx.serialize()
    const txHash = await sendNodeRequest(
      url,
      'eth_sendRawTransaction',
      `0x${serializedTx.toString('hex')}`
    )
    this.osseus.logger.debug(`pending txHash ${JSON.stringify(txHash)}`)
    const receipt = await getReceipt(txHash, url)
    return receipt
  } catch (e) {
    throw e
  }
}

const sendNodeRequest = async (url, method, signedData) => {
  const request = await fetch(url, {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method,
      params: [signedData],
      id: 1
    })
  })
  const json = await request.json()
  if (method === 'eth_sendRawTransaction') {
    if (json.result && json.result.length !== 66) {
      throw new Error(`Tx wasn't send ${json.result.transactionHash}`)
    }
  }
  if (json.result && json.result.status === '0x0') {
    throw new Error(`Tx failed ${json.result.transactionHash}`)
  }
  return json.result
}

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms))

const getReceipt = async (txHash, url) => {
  await timeout(2000)
  let receipt = await sendNodeRequest(url, 'eth_getTransactionReceipt', txHash)
  if (receipt === null || receipt.blockNumber === null) {
    receipt = await getReceipt(txHash, url)
  }
  return receipt
}

const init = (osseus) => {
  this.osseus = osseus
  return new Promise((resolve, reject) => {
    osseus.utils = {
      privateKeyToAddress: privateKeyToAddress,
      toBufferStripPrefix: toBufferStripPrefix,
      sendRawTx: sendRawTx,
      sendNodeRequest: sendNodeRequest,
      getReceipt: getReceipt
    }
    osseus.logger.info(`Utils ready`)
    return resolve()
  })
}

module.exports = {
  init: init
}
