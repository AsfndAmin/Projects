const SHA256 = require('crypto-js/sha256');

 export const generateHashPass=(password: string)=> {
    return JSON.stringify(SHA256(password).words);
};