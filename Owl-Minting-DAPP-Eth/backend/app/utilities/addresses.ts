const { MerkleTree } = require('merkletreejs');
const keccak256 = require('keccak256');
const environment = require('../../environment')


export const whiteListAddress = async (addresses: Array<string>) => {
    try {
        const leafNodes = addresses.map(addr => keccak256(addr));
        const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
        const rootHash = merkleTree.getRoot().toString('hex');


        const proofed = leafNodes.map(async (node, i) => {
            const hexProof = await merkleTree.getHexProof(node);

            return {
                address: addresses[i].toLocaleLowerCase().trim(),
                proof: hexProof
            }
        })

        return Promise.all(proofed).then(values => {
            return {
                addresses: values,
                root_hash: `0x${rootHash}`
            }
        })
    }
    catch (error) {
        console.log(error, "error from merkle")
        return { error }
    }

}