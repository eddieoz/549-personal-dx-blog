$(document).ready(function () {
});

var contractAddress = '<insert your smart-contract address>';
var ABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "index",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "title",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "_isVisible",
				"type": "bool"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "creationTime",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "lastUpdateTime",
				"type": "uint256"
			}
		],
		"name": "logHash",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isVisible",
				"type": "bool"
			}
		],
		"name": "registerHash",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "postIndex",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "blogName",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getPost",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_ipfsHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_title",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "_isVisible",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "creationTime",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "lastUpdateTime",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getStruct",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "string",
						"name": "ipfsHash",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "title",
						"type": "string"
					},
					{
						"internalType": "bool",
						"name": "isVisible",
						"type": "bool"
					},
					{
						"internalType": "uint256",
						"name": "creationTime",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "lastUpdateTime",
						"type": "uint256"
					}
				],
				"internalType": "struct DocRegisterHash.Post",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalPosts",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
var DocRegisterHash;

async function initializeEth() {

	// web3 = new Web3(new Web3.providers.HttpProvider("https://goerli.infura.io/v3/<insert your Infura api key")); // using infura
	web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // using local ganache
	web3.eth.defaultAccount = web3.eth.accounts[0];
	DocRegisterHash = new web3.eth.Contract(ABI, contractAddress);

}

async function listAllPosts() {

	await DocRegisterHash.methods.totalPosts().call()
		.then(total => {
			var html = '';
			for (var i = total; i >= 1; i--) {
				var newHtml = new Promise((resolve, reject) => {
					DocRegisterHash.methods.getPost(i).call()
						.then(result => {
							//console.log(result);
							if (result['_isVisible'] == true) {
								resolve({ 'index': result['_index'], 'ipfsHash': result['_ipfsHash'], 'title': result['_title'], 'creationTime': result['creationTime'], 'lastUpdateTime': result['lastUpdateTime'] });
							}
						})
				})
				newHtml.then((result) => {
					var lastUpdateTime = new Date(result.lastUpdateTime * 1000).toLocaleDateString("en-GB");
					html += '<li><a href="https://gateway.ipfs.io/ipfs/QmZeD4AnU4REifNFRhSN5hTuyMeMBAgz8F8SsACBnnagwq#/ipfs/' + result.ipfsHash + '" class="list-group-item list-group-item-action">' + '[' + lastUpdateTime + '] ' + result.index + ': ' + result.title + '</a></li>'
					$("#arrayContent").html(html);
				});

			};

		})
}

initializeEth();
listAllPosts();
