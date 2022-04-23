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
