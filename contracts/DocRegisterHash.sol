pragma solidity ^0.6.7;
pragma experimental ABIEncoderV2;
// Import Ownable from the OpenZeppelin Contracts library
import "../node_modules/@openzeppelin/contracts/access/AccessControl.sol";
import "../node_modules/@openzeppelin/upgrades/contracts/Initializable.sol";
// import "../node_modules/@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";
// import "../node_modules/@openzeppelin/contracts-ethereum-package/contracts/access/Ownable.sol";

contract DocRegisterHash is Initializable, AccessControl {
    struct Post {
        string ipfsHash;
        string title;
        string description;
        address author;
        bool isVisible;
        uint creationTime;
        uint lastUpdateTime;
    }

    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    string public blogName;
    uint public version;
    uint public totalPosts;
    string public ipfsHashTemplate;

    mapping (uint => Post) postHashes;
    mapping (uint => mapping(string => string)) public metadata;
    mapping (string => uint) hashToIndex;

    event logHash(uint index, string ipfsHash, string title, address author, bool _isVisible, uint creationTime, uint lastUpdateTime);

    function initialize(string memory _blogName, uint _version) initializer public {
        _setupRole(ADMIN_ROLE, msg.sender);
        blogName = _blogName;
        version = _version;
        totalPosts = 0;
    }

    function registerHash(uint _index, string memory _ipfsHash, string memory _title, string memory _description, bool _isVisible) public returns (uint postIndex){
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");

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

    function setMetadata(uint _id, string memory _key, string memory _value) public returns (uint){
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");

        bytes memory testIpfsHash = bytes(postHashes[_id].ipfsHash);
        if (testIpfsHash.length == 0) revert("post not found");
        metadata[_id][_key] = _value;
    }

    function setTemplate(string memory _ipfsHashTemplate) public returns (string memory _hash) {
        require(hasRole(ADMIN_ROLE, msg.sender), "Caller is not an admin");
        require(keccak256(abi.encodePacked(_ipfsHashTemplate)) != keccak256(abi.encodePacked(ipfsHashTemplate)), "Same ipfs hash");

        ipfsHashTemplate = _ipfsHashTemplate;
        return (ipfsHashTemplate);
    }

    function getPost(uint _id) public view returns (uint _index, string memory _ipfsHash, string memory _title, string memory _description, address author, bool _isVisible, uint creationTime, uint lastUpdateTime) {
        Post memory post = postHashes[_id];
        return (_id, post.ipfsHash, post.title, post.description, post.author, post.isVisible, post.creationTime, post.lastUpdateTime);
    }

    function getStruct(uint _id) public view returns (uint _index, Post memory) {
        return (_id, postHashes[_id]);
    }

    function getPostByHash(string memory _ipfsHash) public view returns (uint _index, Post memory){
        _index = hashToIndex[_ipfsHash];
        return (_index, postHashes[_index]);
    }
}
