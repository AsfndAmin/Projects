export const changeNetwork = async (chainId: number) => {
  try {
    console.log('change network')
    if (chainId !== 1) {
      await (window as any).ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }],
      })
    }
  } catch (err) {
    console.log('Error', err)
  }
}

export const onAccountChange = async () => {
    
}
