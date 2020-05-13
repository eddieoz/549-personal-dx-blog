# 549-personal-blog
Decentralised, unstoppable and censor-proof blog.

### Pre-requisites

```
node v10.20.1 
npm v6.14.4
```

###  Environment setup

```
$ npm install
(optional) $ npm audit fix 
$ npx openzeppelin init
$ cp secrets.json-config secrets.json
```

### Smart-contract compile and deploy

Open another window
```
$ npx ganache-cli --deterministic
```
Return to the previous window
Note the mnemonic and update `secrets.json` 

```
$ npx oz compile
$ npx oz deploy
```
 > Regular > Development > DocRegisterHash
 
Take a note of the smart-contract address (i.e: 0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab)

### Configure project files with smart-contract address

Update the smart-contract address on 3 places: 

on `src/blog/js/dxblog.js`
update `var contractAddress = '<your smart-contract address>'`

on `src/ipfs-uploader/549.js`
update `var ganacheContractAddress = '<your smart-contract address>'` 

on `src/md-reader/lib/dxblog.js`
update `var contractAddress = '<your smart-contract address>'`

### IPFS Setup

Install ipfs browser extension: IPFS Companion 
- https://chrome.google.com/webstore/detail/ipfs-companion/nibjojkomfdiaoajekhjakgkdhaomnch


### Configure project files to IPFS

#### Post Uploader
on `src/ipfs-uploader/549.js`
update 
```
var ipfsHost = '<host>'; // default localhost
var ipfsPort = '<port>'; // default port 5001
```

Open IPFS dashboard:
On browser extension, open `Web-UI > Files`
Click on `+Add > Folder` and upload the entire folder `ipfs-uploader` 
Right-click over the uploaded folder, select `Share > Copy` then open a new tab with the address:
- it should open **549 IPFS File Uploader** page.

---

[to-do] Readme Blog Template and Home

---
LICENSE: MIT


