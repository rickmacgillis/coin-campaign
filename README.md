# Coin Campaign

Coin Campaign is an open source fundraising platform that's provably fair. Unlike KickStarter and other platforms, Coin Campaign allows contributers to vote on payment requests from the campaign manager. The payment requests get sent directly to the vendor providing the products or services that further the goals of the campaign.

# Technologies Used

This project uses Ethereum's Solidity to build the contracts on the blockchain. It also uses Next.js and React.js for the front end environment. To mesh the two together, the project uses Web3 from Ethereum.

# Usage
Configure your configuration files in `/config`. Dotenv only works server-side, and the fact that not all variables should appear on the browser-side, means that we need to use one configuration file for the private (server) side data, and one for the public (browser) side. Copy the respective files to remove `.sample` from the file name and edit them as appropriate.

Please note that this project uses the Metamask wallet for your browser, and the Infura API. You're free to customize that functionality as you see fit, and that's done in the `/contracts/web3-adapter.js` file.

# Important!

Please note that you'll need to do your own security review, as well as comply with any government regulations for your market. This project is provided as-is, and without any warranty of fitness for any purpose. See the included license file.
