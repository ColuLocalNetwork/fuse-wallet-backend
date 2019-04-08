const Osseus = require('@colucom/osseus')
const Web3 = require('web3')
const cwd = process.cwd()

const main = async () => {
  try {
    const osseus = await Osseus.init()
    osseus.cwd = cwd

    if (osseus.config.debug) console.time('FUSE WALLET BACKEND')

    osseus.web3 = new Web3(new Web3.providers.HttpProvider(osseus.config.web3_provider))

    await require('./modules/utils').init(osseus)
    await require('./app/errors').init(osseus)

    if (osseus.config.debug) console.timeEnd('FUSE WALLET BACKEND')

    osseus.logger.info('FUSE WALLET BACKEND IS RUNNING :)')
  } catch (err) {
    console.error('BOOTSTRAP ERROR!', err.stack || err)
    process.exit(1)
  }
}

main()
