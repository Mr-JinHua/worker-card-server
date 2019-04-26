const Koa = require('koa')
const xlsx = require('node-xlsx')
const fs = require('fs')
const router = require('koa-router')()

const app = new Koa()

const honorData = xlsx.parse("./mes/honor.xlsx")[0].data
const mesData = xlsx.parse("./mes/message.xlsx")[0].data

function queryHonor({
	name
}) {
	let newHonor = []
	if(!name) return {data: null}
	honorData.forEach((item)=>{
		if(item[1] == name){
			newHonor.push(item)
		}
	})
	return newHonor
}

router.get('/honor', async(ctx, next) => {
	ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "X-Requested-With")
  ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
	ctx.set("Content-Type", "application/json;charset=utf-8")
	console.log(ctx.query)
	let honorRes = await queryHonor({name: ctx.query.name})
	ctx.body = honorRes
})

router.get('/mes', async(ctx, next) => {
	ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "X-Requested-With")
  ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
	ctx.set("Content-Type", "application/json;charset=utf-8")
	console.log(ctx.query)
	// let honorRes = await queryHonor({name: ctx.query.name})
	ctx.body = mesData
})

app.use(router.routes())
app.listen(3000)
