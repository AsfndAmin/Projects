/*********** import starts ***********/
const http = require('http');
const socketio = require('socket.io')
const { web3CronJob } = require('./app/utilities/cronJob')
require('dotenv').config();
"use strict";
const koa = require("koa");
var bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const cron = require("node-cron");
const { router } = require('./app/routes/routes')
const { channel } = require('./app/socket.io')
// mongoose Connection
const { connectDB } = require("./app/db");
const {environment} = require ('./environment')

connectDB(); 
const PORT = "8080";

const app = new koa();
app.use(cors());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods())


cron.schedule(" */1 * * * *", async function () {
   web3CronJob();
});

const server= app.listen(PORT, () => console.log(`Server has started. http://localhost:${PORT}`));
//const server = app.listen(PORT);
const io = socketio(server, {
   cors: {
      origin: environment.FRONTEND_BASE_URL,
      methods: ["GET", "POST"]
   }
});
channel(io)
exports.io= io

 