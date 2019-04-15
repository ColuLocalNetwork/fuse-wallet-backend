module.exports = {
  OSSEUS_LOGGER_LOG_LEVEL: 'debug',
  OSSEUS_LOGGER_NO_CONSOLE_OVERRIDE: true,
  OSSEUS_SERVER_DEPENDENCIES: ['logger'],
  OSSEUS_SERVER_PORT: 3000,
  OSSEUS_SERVER_MORGAN_FORMAT: ':date[iso] method=":method", url=":url", statusCode=":status", route=":route", host=":host", client-ip=":client-ip", user-agent=":user-agent", httpVersion=":http-version", responseTime=":response-time"',
  OSSEUS_SERVER_ADD_HEALTHCHECK: true,
  OSSEUS_SERVER_ADD_IS_RUNNING: true,
  OSSEUS_ROUTER_DEPENDENCIES: ['logger', 'server'],
  OSSEUS_ROUTER_ROUTES_PATH: '/app/routes',
  OSSEUS_ROUTER_CONTROLLERS_PATH: '/app/controllers',
  OSSEUS_ROUTER_POLICY_PATH: '/app/middlewares',
  OSSEUS_ROUTER_URL_PREFIX: '/api',
  WEB3_PROVIDER: 'https://rpc.fuse.io',
  ERC677_BRIDGE_TOKEN_ABI: require('./abi/ERC677BridgeToken'),
  SENDER_PKEY: '0x56...42C',
  /* to be removed */
  SIMPLE_LIST_ABI: require('./abi/SimpleList'),
  IPFS_PROXY_API: 'https://ipfs-proxy-qa.fuse.io/api'
}
