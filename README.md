# Tokenverse

Tokenverse project consists of two repositories:

- frontend repo (tokenverse_frontend)
- backend repo ([tokenverse_backend](https://github.com/gitHubAndyLee2020/tokenverse_backend))

---

> Features Implemented on the Backend and Smart Contract

NFT Features (refer to [contract code](https://github.com/gitHubAndyLee2020/tokenverse_frontend/tree/main/contracts)):

- Fetching NFTs based on their tokenId or itemId
- Minting NFT
- Editing NFT metadata
- Putting NFT on the market
- Buying / Selling NFT
- Gifting NFT
- Burning NFT

Additional Features:

- Fetching users and collections
- Editing user information
- Editing collection information
- Creating a review post

---

> Features Implemented on the Frontend

NFT Features:

- Fetching and display NFTs
- Minting NFT

Additional Features:

- Fetching and displaying users and collections information
- Editting users and collections information

---

> Starting the Project Locally

Front-end:

```bash
git clone https://github.com/gitHubAndyLee2020/tokenverse_frontend.git
npm install
touch .infuraid
touch .secret
echo 'YOUR_INFURAID' > .infuraid
echo 'YOUR_METADATAMASK_PRIVATE_KEY' > .secret
```

Back-end:

```bash
git clone https://github.com/gitHubAndyLee2020/tokenverse_backend.git
npm install
touch .env
echo 'DATABASE_URL="YOUR_POSTGRES_DB_URL"' > .env
```

---

> Deploying the project locally

Front-end:

```bash
npm run dev
```

Back-end:

```bash
npm run dev
```

---

> Smart Contract:

The smart contract is deployed on Polygon Testnet  
Import MATIC from [Polygon Website](https://faucet.polygon.technology/) to your MetaMask account to mint NFTs on the Polygon Testnet

---

## Project Achievements

Acceptence into [Eigenspace Start-Up Program](https://eigenspace.com/)

---

## Project Timeline

- Late December - Project planning and front-end coding
- January - Front-end development / Smart Contract development
- February - Back-end development / Refractoring
- March - Refractoring / Eigenspace Start-Up Program Applying + Acceptance
- April - Wrap Up

---

## Deployment Issues

Local deployment was successful on all three aspects of the app (front-end / back-end / smart contract). However, there were many issues when the app was being deployed to the web.

> Smart Contract

Successfully deployed to Polygon Testnet.  
Could also be deployed to Polygon Mainnet if desired.

> Front-end / Back-end

Front-end deployment was attempted to Netlify. However, there were too many issues during the deployment in the code. Thus, deployment was cancelled.

Back-end deployment was attemped to Heroku. However, there were internal server issues that prevented the GitHub repo from being connected.

---
