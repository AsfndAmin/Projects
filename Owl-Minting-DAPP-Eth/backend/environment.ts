const environment = {
    FRONTEND_BASE_URL: "http://localhost:3000",
    ADMIN_TOKEN: "_secuReOwl@walLetMintingon&apI2coNnect_4",
    MONGOOSE_URL: "mongodb://test:test123@cluster0-shard-00-00.1cezz.mongodb.net:27017,cluster0-shard-00-01.1cezz.mongodb.net:27017,cluster0-shard-00-02.1cezz.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-yvux9g-shard-0&authSource=admin&retryWrites=true&w=majority",
    RPC_URL: "https://speedy-nodes-nyc.moralis.io/482892835df3520a7ee8bb72/eth/rinkeby"
 };

/*if(process.env.REACT_APP_ENV==="development"){
       environment.BACKEND_BASE_URL= "http://localhost:8080"
   }
   
   
   if(process.env.REACT_APP_ENV==="production"){
       environment.BACKEND_BASE_URL= "https://owlnew.buildmydapp.co"
   }
   
   
   if(process.env.REACT_APP_ENV==="staging"){
       environment.BACKEND_BASE_URL= "https://api.illuminatiowls.com"
   }
   
   */
export { environment }