const Web3 = require("web3");
const { CONTRACT_ADDRESS, CONTRACT_ABI } = require("../contract");
const { environment } = require('../../environment')

const rpcUrl = environment.RPC_URL;
const web3 = new Web3(rpcUrl);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);


export { contract };  
