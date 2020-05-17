$(document).ready(function () {
});

var goerliContractAddress = '<insert goerli smart-contract address>'; // Goerli
var goerliAccount = '<insert goerli account>'; // Goerli

var ganacheContractAddress = '<insert local ganache smart-contract address>'; // local
var ganacheAccount = '<insert local ganache account[0] address>'; // local (default: 0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1)

var ipfsHost = '<host>'; // default: localhost
var ipfsPort = '<port>'; // default: 5001 | 5003

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

var DocRegisterHash = '';

// ethereun web3 initialize

// * uncomment the lines below when going live (not local)
// * after uncommenting the lines below, you will be able to use your metamask or 
// * another web3 wallet to register your document

// if (window.ethereum) {
//     window.web3 = new Web3(ethereum);
//     try {
//         // Request account access if needed
//         console.log("ethereum injected on web browser");
//         ethereum.enable();
//         var contractAddress = goerliContractAddress;
//         var walletAddress = goerliAccount; // goerli
//     } catch (error) {
//         // User denied account access...
//     }
// }
// else if (window.web3) {
//     web3 = new Web3(web3.currentProvider);
//     console.log("web3 injected on web browser");
//     var contractAddress = goerliContractAddress;
//     var walletAddress = goerliAccount; // goerli
// } 
// else {
// set the provider you want from Web3.providers if local
web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // using ganache-cli
console.log("web3 using local connection (ganache-cli)");
var contractAddress = ganacheContractAddress;
var walletAddress = ganacheAccount; // ganache-cli

// };

// Loading smart-contract
DocRegisterHash = new web3.eth.Contract(ABI, contractAddress);

async function initializeIpfs() {

	ipfs = new window.IpfsHttpClient(ipfsHost, ipfsPort, { protocol: 'http' }); // local

	ipfs.id(function (err, res) {
		if (err) throw err
		console.log("Connected to IPFS node!", res.id, res.agentVersion, res.protocolVersion);
	});
}

// upload file
async function initializeUpload() {
	$("#file-upload").change(function () {
		//source:https://stackoverflow.com/questions/29805909/jquery-how-to-check-if-uploaded-file-is-an-image-without-checking-extensions
		var file = this.files[0];
		var postIndex = $("#postIndex")[0].value;
		if (postIndex == '') postIndex = 0;

		var postTitle = $("#postTitle")[0].value;
		var postDescription = $("#postDescription")[0].value;

		var postIsVisible = ($('#postIsVisible').is(":checked")) ? true : false;

		var fileType = file["type"];
		var ValidImageTypes = ["text/plain", "text/markdown"];

		if ($.inArray(fileType, ValidImageTypes) < 0) {
			window.alert("you didn't choose a valid document");
		} else {
			$("#loader").show();
			var reader = new FileReader();
			reader.onload = function () {

				mybuffer = buffer.Buffer(this.result);

				// ipfs add file
				ipfs.add(mybuffer, function (err, result) {
					if (err) {
						console.log("Error loading file to IPFS");
					}
					else {
						ipfsHash = result[0].hash;

						// if upload is sucessfull, register the hash
						console.log();
						DocRegisterHash.methods.registerHash(postIndex, ipfsHash, postTitle, postDescription, postIsVisible).send({ from: walletAddress, gas: 400000, gasPrice: 1e6 })
							.on('transactionHash', function (hash) {
								console.log("TX: " + hash);
							})
							.on('confirmation', function (confirmationNumber, receipt) {
								listAllPosts(DocRegisterHash);
								//console.log(confirmationNumber, receipt)
							})
							.on('receipt', function (receipt) {
								console.log(receipt);

								// when sucessful, ipfs pin file
								ipfs.pin.add(ipfsHash, function (err) {
									if (err) {
										console.log("cannot pin");
									}
									else {
										console.log("pin ok");
									}
								});

								// update datails on page
								$("#loader").hide();
								$("#ipfshash").html("IPFS Hash: " + ipfsHash + "<br>TX: " + receipt.transactionHash);
								$("#imgdiv").html("<img src=https://gateway.ipfs.io/ipfs/" + ipfsHash + " width='400'>");
								$("#postId").html("Post Index: " + receipt.events.logHash.returnValues.index);
								listAllPosts(DocRegisterHash);
								buildRss();
							})
							.on('error', function (error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
								console.log(error, receipt);
							})
					}
				});
			}
			reader.readAsArrayBuffer(this.files[0]);
		}
	});
}

async function listAllPosts(DocRegisterHash) {


	// Retrieve the total number of posts
	await DocRegisterHash.methods.totalPosts().call()
		.then(total => {

			console.log("Total Posts: " + total);
			var html = '';
			// LIFO
			for (var i = total; i >= 1; i--) {
				var newHtml = new Promise((resolve, reject) => {
					DocRegisterHash.methods.getPost(i).call()
						.then(result => {
							if (result['_isVisible'] == true) {
								resolve({ 'index': result['_index'], 'ipfsHash': result['_ipfsHash'], 'title': result['_title'], 'description': result['description'], 'creationTime': result['creationTime'], 'lastUpdateTime': result['lastUpdateTime'] });
							}
						})
				})
				newHtml.then((result) => {
					// markdown reader: https://ipfs.io/ipfs/QmVUFoAk2ZUxh12GXA2qLDHgTNzJgiZeZoaaM2s2pjgJxe
					var lastUpdateTime = new Date(result.lastUpdateTime * 1000).toLocaleDateString("en-GB");
					html += '<a target=_blank href="https://gateway.ipfs.io/ipfs/QmZeD4AnU4REifNFRhSN5hTuyMeMBAgz8F8SsACBnnagwq#/ipfs/' + result.ipfsHash + '" class="list-group-item list-group-item-action">' + '[' + lastUpdateTime + '] ' + result.index + ': ' + result.title + '</a>'
					$("#arrayContent").html(html);
				});

			};

		})
}

async function buildRss() {
	var xmlFolder = '/RSS-eddieoz.crypto';
	var rssFile = xmlFolder + '/rss.xml';
	var sitemapFile = xmlFolder + '/sitemap.xml';


	// Retrieve the total number of posts
	await DocRegisterHash.methods.totalPosts().call()
		.then((total) => {
			var rssItems = '';
			var sitemapLinks = '';
			var i = 0;
			// LIFO
			var rssBuild = new Promise((resolve, reject) => {
				for (i = total; i >= 1; i--) {
					var newHtml = new Promise((resolve, reject) => {
						DocRegisterHash.methods.getPost(i).call()
							.then(result => {
								if (result['_isVisible'] == true) {
									resolve({ 'index': result['_index'], 'ipfsHash': result['_ipfsHash'], 'title': result['_title'], 'description': result['_description'], 'creationTime': result['creationTime'], 'lastUpdateTime': result['lastUpdateTime'] });
								}
							})
					})
					newHtml.then((result) => {
						var lastUpdateTime = new Date(result.lastUpdateTime * 1000);
						rssItems += '<item>\n'
						rssItems += '<title>' + result.title + '</title>\n'
						rssItems += '<description>' + result.description + '</description>\n'
						rssItems += '<link>' + 'https://gateway.ipfs.io/ipfs/QmVUFoAk2ZUxh12GXA2qLDHgTNzJgiZeZoaaM2s2pjgJxe#/ipfs/' + result.ipfsHash + '</link>\n'
						rssItems += '<guid isPermaLink="false">' + result.ipfsHash + '</guid>\n'
						rssItems += '<pubDate>' + lastUpdateTime + '</pubDate>\n'
						rssItems += '</item>\n'

						sitemapLinks += '<url>\n'
						sitemapLinks += '<loc>\n'
						sitemapLinks += 'https://gateway.ipfs.io/ipfs/QmVUFoAk2ZUxh12GXA2qLDHgTNzJgiZeZoaaM2s2pjgJxe#/ipfs/' + result.ipfsHash + "\n"
						sitemapLinks += '</loc>\n'
						sitemapLinks += '<lastmod>' + lastUpdateTime + '</lastmod>\n'
						sitemapLinks += '</url>\n'
						if (result.index == 1) {
							resolve([rssItems, sitemapLinks]);
						}

					})
				};
			})
			rssBuild.then((result) => {
				var rssItems = result[0];
				var sitemapLinks = result[1];

				var lastBuildDate = Date(Date.now());

				var rssHeader = '<?xml version="1.0" encoding="UTF-8" ?>\n';
				rssHeader += '<rss version="2.0">\n';
				rssHeader += '<channel>\n';
				rssHeader += '<title>eddieoz.crypto</title>\n';
				rssHeader += '<description>Decentralised and Unstoppable Blog</description>\n'
				rssHeader += '<link>https://eddieoz.crypto</link>\n'
				rssHeader += '<lastBuildDate>' + lastBuildDate + '</lastBuildDate>\n'
				rssHeader += '<pubDate>Mon, 11 May 2020 15:23:00 +0300</pubDate>\n'
				rssHeader += '<ttl>1800</ttl>\n'

				var rssFooter = '</channel>\n'
				rssFooter += '</rss>\n'

				var sitemapHeader = '<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemap.org/schemas/sitemap/0.9 http://www.sitemap.org/schemas/sitemap/0.9/sitemap.xsd">\n'
				var sitemapFooter = '</urlset>\n'

				var rss = rssHeader + rssItems + rssFooter;
				var sitemap = sitemapHeader + sitemapLinks + sitemapFooter;


				// https://openbase.io/js/ipfs-api
				ipfs.files.stat(rssFile, function (err, res) {
					console.log(res);
					ipfs.pin.rm(res.hash, function (err) {
						if (err) {
							console.log("cannot pin");
						}
						else {
							console.log("remove pin ok");
						}
					});
				})
				ipfs.files.stat(sitemapFile, function (err, res) {
					console.log(res);
					ipfs.pin.rm(res.hash, function (err) {
						if (err) {
							console.log("cannot pin");
						}
						else {
							console.log("remove pin ok");
						}
					});
				})
				ipfs.files.write(rssFile, buffer.Buffer(rss), { 'create': true }, function (err, res) {
					ipfs.files.stat(rssFile, function (err, res) {
						ipfs.pin.add(res.hash, function (err) {
							if (err) {
								console.log("cannot pin");
							}
							else {
								console.log("pin ok");
							}
						});
					});
				});

				ipfs.files.stat(xmlFolder, function (err, res) {
					ipfs.pin.add(res.hash, function (err) {
						if (err) {
							console.log("cannot pin");
						}
						else {
							console.log("pin ok");
						}
					});
					ipfs.name.publish('/ipfs/' + res.hash, function (err, res) {
						//console.log(res);
						console.log(`RSS: https://gateway.ipfs.io/ipns/${res.name}/rss.xml`);
						$("#rss").html(`RSS: https://gateway.ipfs.io/ipns/${res.name}/rss.xml`);
						console.log(`Sitemap: https://gateway.ipfs.io/ipns/${res.name}/sitemap.xml`);
						$("#sitemap").html(`Sitemap: https://gateway.ipfs.io/ipns/${res.name}/sitemap.xml`);
					});

				});

			})

		})
}

initializeIpfs();
initializeUpload();
buildRss(); // small blog, build rss when opening the manager
listAllPosts(DocRegisterHash);
