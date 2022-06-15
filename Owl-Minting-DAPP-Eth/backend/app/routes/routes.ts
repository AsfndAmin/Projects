const koaRouter = require('koa-router');

const { saveAddresses, checkAddress,generateMerkleRoot } = require('../controller/whiteListAddressController')
const {getFee} = require('../controller/getFeeController')
const {addnft, mintRandomNft,getNftByTokenId} = require('../controller/nftController')
const {updatePassword, updateUserName, createCredentials} = require('../controller/admin')
const { addStory,storyUpdate,getStory, removeStory } = require('../controller/categoryStory')
const {adminLogin, checkAuth} = require('../auth')
const { validate } = require('../validation/customValidator')
const { validateToken } = require("../validation/tokenValidator")


const router = new koaRouter()

//addresses routes
router.get("/check-address", checkAddress)
router.post("/save-addresses",validateToken, saveAddresses)
router.post('/generate-merkle-root', validateToken, generateMerkleRoot)

//web3 routes
router.get("/fee", getFee)

//nft routes
router.post('/add-nft', addnft )
router.put('/mint-random-nfts', mintRandomNft)
router.post('/nfts-by-token-id', getNftByTokenId)

//admin routes
router.post("/insert-credentials", createCredentials)
router.post("/login", (ctx: any, next: any) => validate(ctx, next, ["username", "password"]), adminLogin)
router.put("/update-password", validateToken, (ctx: any, next: any) => validate(ctx, next, ["new_password", "current_password"]), updatePassword)
router.put("/update-username", validateToken, (ctx: any, next: any) => validate(ctx, next, ["username"]), updateUserName)
router.get("/auth", validateToken, checkAuth)

//story routes
router.post("/add-story",validateToken, (ctx: any, next: any) => validate(ctx, next, ["category", "story"]), addStory)
router.get("/get-story", getStory)
router.put("/update-story", validateToken, (ctx: any, next: any) => validate(ctx, next, ["category", "story", "id"]), storyUpdate)
router.delete("/remove-story", validateToken, removeStory)

export { router }
