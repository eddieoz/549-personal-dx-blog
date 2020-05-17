pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
// Import Ownable from the OpenZeppelin Contracts library
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/upgrades/contracts/Initializable.sol";

contract DocRegisterHash is Ownable, Initializable {
    struct Post {
        string ipfsHash;
        string title;
        string description;
        address author;
        bool isVisible;
        uint creationTime;
        uint lastUpdateTime;
    }
    
    string public blogName;
    uint public version;
    uint public totalPosts;
    
    mapping (uint => Post) postHashes;
    mapping (uint => mapping(string => string)) public metadata;
    mapping (string => uint) hashToIndex;

    event logHash(uint index, string ipfsHash, string title, address author, bool _isVisible, uint creationTime, uint lastUpdateTime);

    function initialize(string memory _blogName, uint _version) public initializer {
        blogName = _blogName;
        version = _version;
        totalPosts = 0;
    }

    function registerHash(uint _index, string memory _ipfsHash, string memory _title, string memory _description, bool _isVisible) public onlyOwner returns (uint postIndex){
        uint creationTime; 
        uint lastUpdateTime;
        address _author = msg.sender;

        if (_index == 0 ){
            totalPosts+=1;
            postIndex = totalPosts;
            creationTime = now;
            lastUpdateTime = now;
        } else {
            require(_author == postHashes[_index].author);
            postIndex = _index;
            lastUpdateTime = now;
            creationTime = postHashes[postIndex].creationTime;
        }
        postHashes[postIndex] = Post(_ipfsHash, _title, _description, _author, _isVisible, creationTime, lastUpdateTime);
        hashToIndex[_ipfsHash] = postIndex;

        emit logHash(postIndex, _ipfsHash, _title, _author, _isVisible, creationTime, lastUpdateTime);

    }

    function getPost(uint _id) public view returns (uint _index, string memory _ipfsHash, string memory _title, string memory _description, address author, bool _isVisible, uint creationTime, uint lastUpdateTime) {
        Post memory post = postHashes[_id];
        return (_id, post.ipfsHash, post.title, post.description, post.author, post.isVisible, post.creationTime, post.lastUpdateTime);
    }

    function getStruct(uint _id) public view returns (uint _index, Post memory) {
        return (_id, postHashes[_id]);
    }
    
    function setMetadata(uint _id, string memory _key, string memory _value) public onlyOwner returns (uint){
        bytes memory testIpfsHash = bytes(postHashes[_id].ipfsHash);
        if (testIpfsHash.length == 0) revert( "post not found"); 
        metadata[_id][_key] = _value;
    }
    
    function getPostByHash(string memory _ipfsHash) public view returns (uint _index, Post memory){
        _index = hashToIndex[_ipfsHash];
        return (_index, postHashes[_index]);
    }
}
