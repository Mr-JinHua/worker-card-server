const Koa = require('koa')
const xlsx = require('node-xlsx')
const fs = require('fs')
const router = require('koa-router')()
const cors = require('koa2-cors')
const path = require('path')
const statics = require('koa-static')

const app = new Koa()

const honorData = xlsx.parse("./mes/honor.xlsx")[0].data
const mesData = xlsx.parse("./mes/message.xlsx")[0].data
const bugData = xlsx.parse("./mes/bug.xlsx")[0].data
const depData = xlsx.parse("./mes/departments.xls")[0].data
const awardData = xlsx.parse("./mes/honor.xlsx")[0].data

const staticPath = './static'

app.use(statics(
	path.join(__dirname, staticPath)
))

app.use(cors({
    origin: function (ctx) {
        if (ctx.url === '/test') {
            return "*"; // 允许来自所有域名请求
        }
        return 'http://localhost:8080'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    },
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))

function queryHonor(name) {
	let newHonor = []
	if(!name) return {data: null}
	honorData.forEach((item)=>{
		if(item[1] == name){
			newHonor.push(item)
		}
	})
	newHonor = Array.from(new Set(newHonor))
	return newHonor
}

function queryBug(name) {
	let bugD = null;
	let bugC = null;
	console.log(bugData)
	bugData.forEach((item) => {
		// 第一个是提交bug数，第二个是修改bug数
		if(item[0]) {
			if(item[0] === name)
				bugC = item[1]
		}
		if(item[2]) {
			if(item[2] === name)
				bugD = item[3]
		}
	})
	if(bugD>10 || bugC>10) {
		if(!bugD) {
			console.log(`提交了${bugC}个bug`)
			return `提交了${bugC}+个bug`
		}
		if(!bugC) {
			console.log(`修改了${bugD}个bug`)
			return `修改了${bugD}+个bug`
		}
		if(bugD > bugC){
			console.log(`修改了${bugD}个bug`)
			return `修改了${bugD}+个bug`
		}else{
			console.log(`提交了${bugC}个bug`)
			return `提交了${bugC}+个bug`
		}
	}
}

function queryDep(name){
	let newData = []
	let nowdep = null;
	for(let i = 0;i < mesData.length; i++) {
		if(mesData[i][1] === name) {
			nowdep = mesData[i][1]
		}
	}
	depData.forEach((item) => {
		if(item[1] === name && !(newData.includes(item[2]))) {
			newData.push(item[2])
		}
	})
	return newData;
}

function queryAward(name) {
	let newData = {
		honornum: 0,
		honor: [],
		self: []
	}
	for(let i = 0; i < awardData.length; i++) {
		if(awardData[i][2] === '荣耀') {
			if(awardData[i][1] === name && awardData[i][3]) {
				newData.honor.push(awardData[i][3]);
			}
		}
		if(awardData[i][2] === '个人荣誉') {
			if(awardData[i][1] === name && awardData[i][3]) {
				newData.self.push(awardData[i][3]);
			}
		}
	}
	return newData
}

router.get('/honor', async(ctx, next) => {
	// 废弃的请求头 甚至跨域
	// ctx.set("Access-Control-Allow-Origin", "*")
	// ctx.set("Access-Control-Allow-Headers", "X-Requested-With")
	// ctx.set("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS")
	// ctx.set("Content-Type", "application/json;charset=utf-8")
	console.log(ctx.query)
	let honorRes = await queryHonor({name: ctx.query.name})
	ctx.body = honorRes
})

router.get('/mes', async(ctx, next) => {
	ctx.body = mesData
})

router.get('/bug', async(ctx, next) => {
	let honorBug = await queryBug(ctx.query.name)
	ctx.body = honorBug
})

router.get('/dep', async(ctx, next) => {
	console.log(ctx.query.name)
	let depData = await queryDep(ctx.query.name)
	console.log(depData)
	ctx.body = depData
})

router.get('/awa', async(ctx, next) => {
	console.log(ctx.query.name)
	let depData = await queryAward(ctx.query.name)
	console.log(depData)
	ctx.body = depData
})

app.use(router.routes())
app.listen(3000)
