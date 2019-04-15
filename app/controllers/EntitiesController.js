const fetch = require('node-fetch')

module.exports = (osseus) => {
  return {
    get: async (req, res, next) => {
      try {
        const Contract = new osseus.web3.eth.Contract(osseus.config.simple_list_abi, req.params.contract_address)
        const nEntities = await Contract.methods.count().call()
        const promises = []
        for (let i = 0; i < nEntities; i++) {
          promises.push(new Promise(async (resolve, reject) => {
            try {
              let hash = await Contract.methods.getEntity(i).call()
              let request = await fetch(`${osseus.config.ipfs_proxy_api}/metadata/${hash}`)
              let resp = await request.json()
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
