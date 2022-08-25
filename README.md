# NFTDoor

NFTDoor is dynamic NFT launchpad powered by Chainlink VRF v2, creators can create and sell dynamic NFT very easily.

## Inspiration

[Aavegocchi as Dynamic NFT](https://chain.link/case-studies/aavegotchi)

[NFTLaunch as NFT Launchpad](https://www.nftlaunch.network/)

## Contract

![contracts-architecture](./docs/contracts-architecture.jpg)

We implement twe contracts

- Dynamic NFT Minter
- Dynamic NFT Registry

### Dynamic NFT Minter

- buying user can request minting NFT

  - this process calls request random number to Chainlink VRF v2

- Chainlink VRF v2 can send call back

  - this process mint NFT to buying user

### Dynamic NFT Registry

- define rarity condition
- it stores NFT metadata to each rarity

* this part may move to server less function

## Frontend

this is mock frontend, these pictures replaced when implemented

![mint-page](./docs/app-mint-page.png)

![registry-page](./docs/app-registry-page.png)

## Business Model

![business-model](./docs/business-model.jpg)

## Packages

We are working in team, so devide package to work and define output

### App

This part is going to be implemented via Nextjs,

- Expected output

  - Working frontend and serverless functions code

  - Should be deployed so that users can try it out

### Contracts

- Expected output

  - Should be deployed to Chainlink VRFv2 available network

  - Contract address and ABI to access it from frontend

  - Unit testing if possible
