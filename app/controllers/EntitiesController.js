const axios = require('axios')

module.exports = (osseus) => {
  return {
    get: async (req, res, next) => {
      try {
        const resp = await axios.get(`${osseus.config.explorer_api}?module=contract&action=getabi&address=${req.params.contract_address}`)
        if (!resp || !resp.data || !resp.data.result) {
          return next(new Error(`Could not get contract ${req.params.contract_address} ABI`))
        }
        const abi = JSON.parse(resp.data.result)
        const Contract = new osseus.web3.eth.Contract(abi, req.params.contract_address)
        const nEntities = await Contract.methods.count().call()
        const promises = []
        for (let i = 0; i < nEntities; i++) {
          promises.push(new Promise(async (resolve, reject) => {
            try {
              let hash = await Contract.methods.getEntity(i).call()
              let resp = await axios.get(`${osseus.config.ipfs_proxy_api}/metadata/${hash}`)
              if (!resp || !resp.data) {
                return reject(new Error(`Could not get metadata for ${hash}`))
              }
              resolve(resp.data)
            } catch (err) {
              reject(err)
            }
          }))
        }
        Promise.all(promises).then(results => { res.send(results) }).catch(err => { next(err) })
      } catch (err) {
        next(err)
      }
    }
  }
}
