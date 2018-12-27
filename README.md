[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

# Fuse Wallet Backend

The Fuse Wallet Backend is an [osseus](https://github.com/colucom/osseus) based server implementation which acts as backend for the Fuse Wallet.

## Dependencies

To make sure that the following instructions work, please install the following dependencies
on you machine:

- [Node.js (comes with a bundled npm)](https://nodejs.org/en/)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

## Installation

To get the source of `fuse-wallet-backend`, clone the git repository via:

````
$ git clone https://github.com/ColuLocalNetwork/fuse-wallet-backend
````

This will clone the complete source to your local machine.

Navigate to the project folder and install all needed dependencies via **npm**:

````
$ npm install
````

This commands installs everything which is required for building and testing the project.

## Developing
### Run locally: `npm run dev`
This task will run the application and start listening on port `3000`.

Under the hood, we use a complete [osseus](https://github.com/colucom/osseus) stack.

You will find the local configuration at [LOCAL.js](https://github.com/ColuLocalNetwork/fuse-wallet-backend/blob/master/config/LOCAL.js).

## Configuration
See [tutorial](https://github.com/ColuLocalNetwork/fuse-wallet-backend/blob/master/CONFIGURATION.md).

## Source linting
`npm run lint` performs a lint for all source code using [standard js](https://standardjs.com/).

## Contributing
Please see [contributing guidelines](https://github.com/ColuLocalNetwork/fuse-wallet-backend/blob/master/.github/CONTRIBUTING.md).

## License
Code released under the [MIT License](https://github.com/ColuLocalNetwork/fuse-wallet-backend/blob/master/LICENSE).