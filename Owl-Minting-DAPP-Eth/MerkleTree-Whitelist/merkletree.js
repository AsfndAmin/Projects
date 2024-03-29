const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');

let whitelistAddresses = [
  "0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2",
  "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
  "0x78731D3Ca6b7E34aC0F824c42a7cC18A495cabaB",
  "0x617F2E2fD72FD9D5503197092aC168c91465E7f2",
  "0x17F6AD8Ef982297579C203069C1DbfFE4348c372",
];


const leafNodes = whitelistAddresses.map(addr => keccak256(addr));
const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true});
const rootHash = merkleTree.getRoot();
console.log('Whitelist Merkle Tree\n', merkleTree.toString());
console.log("Root Hash: ", rootHash);
const claimingAddress = leafNodes[1];
const hexProof = merkleTree.getHexProof(claimingAddress);
console.log(hexProof);
console.log(merkleTree.verify(hexProof, claimingAddress, rootHash));