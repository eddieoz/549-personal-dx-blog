pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;
// Import Ownable from the OpenZeppelin Contracts library
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/upgrades/contracts/Initializable.sol";


contract DocRegisterHash is Ownable, Initializable {
    struct Post {
        string ipfsHash;
        string title;
        bool isVisible;
        uint creationTime;
        uint lastUpdateTime;
    }
    string public blogName;
    uint public totalPosts;
    mapping (uint => Post) postHashes;

    event logHash(uint index, string ipfsHash, string title, bool _isVisible, uint creationTime, uint lastUpdateTime);

    function initialize(string memory _blogName) initializer public {
        blogName = _blogName;
        totalPosts = 0;
    }

    function registerHash(uint _index, string memory _ipfsHash, string memory _title, bool _isVisible) public onlyOwner returns (uint postIndex){
        uint creationTime;
        uint lastUpdateTime;
        if (_index == 0 ){
            totalPosts += 1;
            postIndex = totalPosts;
            creationTime = now;
            lastUpdateTime = now;
        } else {
            postIndex = _index;
            lastUpdateTime = now;
            creationTime = postHashes[postIndex].creationTime;
        }
        postHashes[postIndex] = Post(_ipfsHash, _title, _isVisible,creationTime,lastUpdateTime);

        emit logHash(postIndex, _ipfsHash, _title, _isVisible, creationTime, lastUpdateTime);
    }

    function getPost(uint _id) public view returns (uint _index, string memory _ipfsHash, string memory _title, bool _isVisible, uint creationTime, uint lastUpdateTime) {
        Post memory post = postHashes[_id];
        return (_id, post.ipfsHash, post.title, post.isVisible, post.creationTime, post.lastUpdateTime);
    }

    function getStruct(uint _id) public view returns (uint _index, Post memory) {
        return (_id, postHashes[_id]);
    }
}
