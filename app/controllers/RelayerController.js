module.exports = (osseus) => {
  return {
    transmit: async (req, res, next) => {
      try {
        osseus.logger.debug(`RelayerController.transmit ${JSON.stringify(req.body, null, '\t')}`)

        // delegate account
        const delegatePrivateKey = osseus.config.sender_pkey
        if (!delegatePrivateKey) {
          osseus.logger.error(`SENDER_PKEY missing in config`)
          return next(`Internal error`)
        }
        osseus.logger.debug(`delegatePrivateKey: ${delegatePrivateKey}`)
        const delegate = osseus.utils.privateKeyToAddress(delegatePrivateKey)
        osseus.logger.debug(`delegate: ${delegate}`)
        const delegateNonce = await osseus.web3.eth.getTransactionCount(delegate)
        osseus.logger.debug(`delegateNonce: ${delegateNonce}`)

        // validations
        if (!osseus.web3.utils.isAddress(req.body.token_address)) {
          return next('Validation error - token_address is invalid')
        }
        if (!osseus.web3.utils.isAddress(req.body.from_account)) {
          return next('Validation error - from_account is invalid')
        }
        if (!osseus.web3.utils.isAddress(req.body.to_account)) {
          return next('Validation error - to_account is invalid')
        }
        req.body.amount_wei = osseus.web3.utils.toBN(req.body.amount_wei)

        // init token
        const Token = new osseus.web3.eth.Contract(osseus.config.erc677_bridge_token_abi, req.body.token_address)

        // init tx and send
        const transferPreSignedData = await Token.methods.transferPreSigned(
          req.body.sig,
          req.body.to_account,
          req.body.amount_wei,
          osseus.web3.utils.toBN(osseus.config.fee_wei || 0),
          req.body.timestamp
        ).encodeABI({
          from: delegate
        })
        osseus.logger.debug(`transferPreSignedData: ${JSON.stringify(transferPreSignedData)}`)

        const receipt = await osseus.utils.sendRawTx({
          data: transferPreSignedData,
          nonce: delegateNonce,
          to: req.body.token_address,
          privateKey: osseus.utils.toBufferStripPrefix(delegatePrivateKey),
          url: osseus.config.web3_provider
        })

        res.send({
          blockHash: receipt.blockHash,
          transactionHash: receipt.transactionHash
        })
      } catch (err) {
        next(err)
      }
    },

    monitor: async (req, res, next) => {
      try {
        // delegate account
        const delegatePrivateKey = osseus.config.sender_pkey
        if (!delegatePrivateKey) {
          osseus.logger.error(`SENDER_PKEY missing in config`)
          return next(`Internal error`)
        }
        osseus.logger.debug(`delegatePrivateKey: ${delegatePrivateKey}`)
        const delegate = osseus.utils.privateKeyToAddress(delegatePrivateKey)
        osseus.logger.debug(`delegate: ${delegate}`)

        // get balance
        const balanceWei = await osseus.web3.eth.getBalance(delegate)
        const balance = osseus.web3.utils.fromWei(balanceWei)
        res.send({balance})
      } catch (err) {
        next(err)
      }
    }
  }
}
