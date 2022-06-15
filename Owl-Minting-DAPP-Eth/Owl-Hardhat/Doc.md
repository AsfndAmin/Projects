ILLUMINATI OWL

Write Functions

setHootWhitelistMerkleRoot (onlyOwner)
bytes32 merkleRoot
Merkleroot for the hoot whitelisted users.

setPublicWhitelistMerkleRoot (onlyOwner)
bytes32 merkleRoot
Merkleroot for the public whitelisted users.

setHootMintTime (onlyOwner)
uint256 _startTime, uint256 _endTime
User should provide start and end time before using the hoot mint function and start time should not be greater than end time and user also need to add the mint limit before using the function which is explained in the next step.

setHootMintLimit (onlyOwner)
uint256 _limit
This is the limit of hoot mints allowed by the owner and need to set before using the hoot mint function.

hootMint (onlyHootWhitelisted)
uint256 quantity, bytes32[] proof
Users need to provide its merkle whitelist proof and quantity for hootmint function, quantity should not be more than 3 and one user can mint max 3 hoot nfts.

setMintingFee (onlyOwner)
uint256 fee
This is the fee for the public mint and whitelist mint function owner should set the fee before using these functions.

setWlMintTime (onlyOwner)
Uint256 _startTime
Owner will set the start time of the whitelist sale and the end time will automatically be set after 2 hours and public mint sale will start at the end of whitelist sale.

whitelistMint (onlyPublicWhitelisted)(payable)
uint256 quantity, bytes32[] proof
User need to give the quantity of nfts he wants to mint and his merkle proof for publicWhitelist mint and need to send ether according to the price of nft.


publicMint (payable)
uint256 quantity
Users need to send quantity and ether according to price.

safeTransferFrom
address from, address to uint256 tokenId.

safeTransferFrom 
address from, address to uint256 tokenId, bytes _data.

setApprovalForAll 
address operator, bool approved.

setBaseURI (onlyOwner)
string _baseUri.

renounceOwner 

approve
address to, uint256 tokenId

Read Functions

_maxSupply

_mintFee

balanceOf

getApproved

hootEndTime

hootStartTime

hootWhitelistMerkleRoot

isApprovedFor

name

owner

ownerOf
publicStartTime

publicWhitelistMerkleRoot

symbol

tokenURI

totalHootLimit

totalHootMint

totalSupply

wlEndTime

wlStartTime


