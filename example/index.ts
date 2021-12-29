// import Koa = require('koa')
// import createRouter = require('koa-router')
// import koaBody = require('koa-body')

// const router = createRouter()
// const app = new Koa()
// app.use(koaBody())

// router.post('/test', async (ctx, next) => {
//   console.log(ctx)
//   ctx.body = 'hello test!'
// })

// const port = 8111

// app.use(router.routes())
// app.listen(port)
// console.log(`app listen at port ${port}`)

import { init } from '../src/index'
import { AController } from '../example/controller/AController'
import { BController } from '../example/controller/BController'

const { app } = init([AController, BController])
const port = 8111
app.listen(port)
console.log(`app listen at port ${port}`)