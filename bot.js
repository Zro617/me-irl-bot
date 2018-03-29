const Discordie = require('discordie')
const request   = require('request')
const fs        = require('fs')
const notifier  = require('node-notifier')
const Jimp      = require('jimp')
const {token}   = require('./auth.json')

const OOF = `
▒██████╗▒   ▒██████╗▒   ███████╗
██╔═══██╗   ██╔═══██╗   ██╔════╝
██║▒▒▒██║   ██║▒▒▒██║   █████╗▒▒
██║▒▒▒██║   ██║▒▒▒██║   ██╔══╝▒▒
╚██████╔╝   ╚██████╔╝   ██║▒▒▒▒▒
▒╚═════╝▒   ▒╚═════╝▒   ╚═╝▒▒▒▒▒`;

const YKIHTDITT =
`⠀⠀⠀⠀⣠⣦⣤⣀
⠀⠀⠀⠀⢡⣤⣿⣿
⠀⠀⠀⠀⠠⠜⢾⡟
⠀⠀⠀⠀⠀⠹⠿⠃⠄
⠀⠀⠈⠀⠉⠉⠑⠀⠀⠠⢈⣆
⠀⠀⣄⠀⠀⠀⠀⠀⢶⣷⠃⢵
⠐⠰⣷⠀⠀⠀⠀⢀⢟⣽⣆⠀⢃
⠰⣾⣶⣤⡼⢳⣦⣤⣴⣾⣿⣿⠞
⠀⠈⠉⠉⠛⠛⠉⠉⠉⠙⠁
⠀⠀⡐⠘⣿⣿⣯⠿⠛⣿⡄
⠀⠀⠁⢀⣄⣄⣠⡥⠔⣻⡇
⠀⠀⠀⠘⣛⣿⣟⣖⢭⣿⡇
⠀⠀⢀⣿⣿⣿⣿⣷⣿⣽⡇
⠀⠀⢸⣿⣿⣿⡇⣿⣿⣿⣇
⠀⠀⠀⢹⣿⣿⡀⠸⣿⣿⡏
⠀⠀⠀⢸⣿⣿⠇⠀⣿⣿⣿
⠀⠀⠀⠈⣿⣿⠀⠀⢸⣿⡿
⠀⠀⠀⠀⣿⣿⠀⠀⢀⣿⡇
⠀⣠⣴⣿⡿⠟⠀⠀⢸⣿⣷
⠀⠉⠉⠁⠀⠀⠀⠀⢸⣿⣿⠁
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈`;

const THINKING = 
`⠀⠰⡿⠿⠛⠛⠻⠿⣷
⠀⠀⠀⠀⠀⠀⣀⣄⡀⠀⠀⠀⠀⢀⣀⣀⣤⣄⣀⡀
⠀⠀⠀⠀⠀⢸⣿⣿⣷⠀⠀⠀⠀⠛⠛⣿⣿⣿⡛⠿⠷
⠀⠀⠀⠀⠀⠘⠿⠿⠋⠀⠀⠀⠀⠀⠀⣿⣿⣿⠇
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠁

⠀⠀⠀⠀⣿⣷⣄⠀⢶⣶⣷⣶⣶⣤⣀
⠀⠀⠀⠀⣿⣿⣿⠀⠀⠀⠀⠀⠈⠙⠻⠗
⠀⠀⠀⣰⣿⣿⣿⠀⠀⠀⠀⢀⣀⣠⣤⣴⣶⡄
⠀⣠⣾⣿⣿⣿⣥⣶⣶⣿⣿⣿⣿⣿⠿⠿⠛⠃
⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄
⢸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡁
⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠁
⠀⠀⠛⢿⣿⣿⣿⣿⣿⣿⡿⠟
⠀⠀⠀⠀⠀⠉⠉⠉`;

const LOSS = 
`⠀⠀⠀⣴⣴⡤
⠀⣠⠀⢿⠇⡇⠀⠀⠀⠀⠀⠀⠀⢰⢷⡗
⠀⢶⢽⠿⣗⠀⠀⠀⠀⠀⠀⠀⠀⣼⡧⠂⠀⠀⣼⣷⡆
⠀⠀⣾⢶⠐⣱⠀⠀⠀⠀⠀⣤⣜⣻⣧⣲⣦⠤⣧⣿⠶
⠀⢀⣿⣿⣇⠀⠀⠀⠀⠀⠀⠛⠿⣿⣿⣷⣤⣄⡹⣿⣷
⠀⢸⣿⢸⣿⠀⠀⠀⠀⠀⠀⠀⠀⠈⠙⢿⣿⣿⣿⣿⣿
⠀⠿⠃⠈⠿⠆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠹⠿⠿⠿

⠀⢀⢀⡀⠀⢀⣤⠀⠀⠀⠀⠀⠀⠀⡀⡀
⠀⣿⡟⡇⠀⠭⡋⠅⠀⠀⠀⠀⠀⢰⣟⢿
⠀⣹⡌⠀⠀⣨⣾⣷⣄⠀⠀⠀⠀⢈⠔⠌
⠰⣷⣿⡀⢐⢿⣿⣿⢻⠀⠀⠀⢠⣿⡿⡤⣴⠄⢀⣀⡀
⠘⣿⣿⠂⠈⢸⣿⣿⣸⠀⠀⠀⢘⣿⣿⣀⡠⣠⣺⣿⣷
⠀⣿⣿⡆⠀⢸⣿⣿⣾⡇⠀⣿⣿⣿⣿⣿⣗⣻⡻⠿⠁
⠀⣿⣿⡇⠀⢸⣿⣿⡇⠀⠀⠉⠉⠉⠉⠉⠉⠁`;

function getSubredditPost(subreddit, limit = 400, callback) {
	request({
		url: `https://reddit.com/r/${subreddit}/.json?limit=${limit}`,
		json: true,
		headers: { 'User-Agent': 'MeIrlDiscordBot 1.0' },
		qs: 100
	}, function (error, response, body) {
		if (error) {
			console.error(error)
		} else if (response.statusCode !== 200) {
			console.error('Status Code: '+response.statusCode)
		} else try {
			if (typeof(body) !== 'object') {
				body = JSON.parse(body)
			}
			var posts = body.data.children
			var p = posts[Math.floor(posts.length * Math.random())].data
			
			return callback(p)
		} catch (e) {
			console.error(e.message)
		}
	})
}

function getSelfieOfTheSoul(callback) {
	return getSubredditPost('me_irl+meirl+2meirl4meirl+absolutelynotmeirl+absolutelynotme_irl+programme_irl+meme_irl', 400, callback)
}

function wordcube(message) {
	message = message.replace(/\s+/g,''); // remove spaces
	var thing = '';
	if (message.length < 5) {
		thing += message.split('').join(' ')
		for (let i=1;i<message.length;i++) thing += '\n' + message[i]
	} else if (message.length < 30) {
		var len = message.length
		var size   = ~~(len * 3 / 2)
		var matrix = new Array(size).fill('').map(x => new Array(size).fill(' '))
		var gap    = ~~(len / 2)
		var cor = 0
		if (len % 2 == 0) cor = 1
		try {
			for (let i = 0; i < len; i++) {
				// horizontal
				matrix[0][gap+i] = 
				matrix[gap][i] = 
				matrix[2*gap-cor][gap+(len-1-i)] = 
				matrix[3*gap-cor][(len-1-i)] = message[i];
				// vertical
				matrix[gap+i][0] = 
				matrix[i][gap] = 
				matrix[(len-1-i)][3*gap-cor] = 
				matrix[gap+(len-1-i)][2*gap-cor] = message[i];
			}
			for (let i = 1; i < gap; i++) {
				// diagonals
				matrix[gap-i][i] =
				matrix[gap-i][2*gap+i-cor] =
				matrix[3*gap-i-cor][i] =
				matrix[3*gap-i-cor][2*gap+i-cor] = '/';
			}
			thing = '```\n' + matrix.map(a => a.join(' ')).join('\n') + '\n```'
		} catch (e) {
			console.log(e)
			return;
		}
	} else {
		return;
	}
	return thing
}

var MeIrlBot = new Discordie()
MeIrlBot.connect({token,autorun:true,autoReconnect:true})

MeIrlBot.Dispatcher.on('GATEWAY_READY', function () {
	console.log('MeIrlBot connected.')
	MeIrlBot.User.setStatus(null, 'zro pls explain')
})

var lastPingSent = 0
var typing = null

MeIrlBot.Dispatcher.on('MESSAGE_CREATE', function (e) {
	const message = e.message.content
	const user = e.message.author
	const channel = e.message.channel
	
	if (user.id == '426776148962181120') return;
	
	if (/r\/[\w\d_]+/.test(message)) {
		getSubredditPost(message.match(/r\/([\w\d_]+)/)[1], 100, function (post) {
			console.log(post.url)
			channel.sendMessage(`**${post.title}**\n${post.selftext||post.url}`)
		})
		
	} else if (/\bme.?.?irl\b/i.test(message)) {
		getSelfieOfTheSoul(function (post) {
			console.log(post.url)
			channel.sendMessage(`${post.title}\n${post.url}`)
		})
		
	} else if (/\boof\b/i.test(message)) {
		channel.sendMessage(OOF)
		
	} else if (/\bloss\b/.test(message)) {
		channel.sendMessage(LOSS)
		
	} else if (/you know i had to do it to em/i.test(message)) {
		channel.sendMessage(YKIHTDITT)
		
	} else if (/really makes you think/i.test(message)) {
		channel.sendMessage(THINKING)
		
	} else if (/ur (mom|dad|nan|mum|mama|papa|mother|father|parent|brother|sister|grandpa|grandma|granny) (gay|gey|homo|tran|straight|str8)/i.test(message)) {
		channel.sendMessage('no u')
		
	} else if (/no u/i.test(message)) {
		channel.uploadFile(fs.readFileSync("./me-irl-bot/images/unoreverse.jpg"))
		
	} else if (e.message.attachments && e.message.attachments.some(function (a) {
		return isImage(a.url) && /reverse|no_u/i.test(a.url)
	})) {
		channel.sendMessage('no, ***u***')
		channel.uploadFile(fs.readFileSync("./me-irl-bot/images/ReverseofReverse.jpg"))
		
//	} else if (/press \w to pay respects/i.test(message)) {
//		var letter = message.match(/press (\w) to pay respects/i)[1].toLowerCase()
//		e.message.addReaction({id: null, name: `regional_indicator_${letter}`})
		
	} else if (message == message.toUpperCase() && /\w( \w){3,}/gm.test(message)) {
		channel.sendMessage(wordcube(message))
		
	} else if (/zro pls explain/i.test(message)) {
		var zro = MeIrlBot.Users.getMember('216257015863967766', '138832637258104832')
		var now = Date.now()
		if (user.id == '138832637258104832') {
			channel.sendMessage('but you are zro \\🤔')
		} else if (now - lastPingSent < 60000) {
			channel.sendMessage('you already pinged zro dummy')
		} else if (zro.status == 'online') {
			lastPingSent = now
			channel.sendMessage('<@138832637258104832>')
		} else {
			lastPingSent = now
			channel.sendMessage('pinging zro')
			notifier.notify({
				title: 'Discord Browser Notification',
				message: user.username + ' wants your attention',
				wait: true
			}, function (err, res) {
				if (err) error(err)
				else console.log('ping by ' + user.username)
			})
		}
	} else if (/delet this/i.test(message)) {
		channel.fetchMessages(20).then(() => {
			for (var m of channel.messages) {
				if (m.author.id == MeIrlBot.id) {
					return m
				}
			}
			throw 'i don\'t know what you want me to delete'
		}).then(m => m.delete())
		.catch(error)
	} else if (/needs more jpe?g/i.test(message)) {
		getFirstImage()
		.then(imageUrl => {
			console.log('jpegging ' + imageUrl)
			startTyping()
			return Jimp.read(imageUrl)
		}).then(image => {
			image.posterize(Math.floor(20 + 50 * Math.random()))
			.quality(Math.floor(5 * Math.random()))
			.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
				clearInterval(typing)
				if (err) throw err
				else channel.uploadFile(buffer, 'needs_more_jpeg.jpg')
			})
		}).catch(error)
	} else if (/needs more (deep)?frying/i.test(message)) {
		getFirstImage()
		.then(imageUrl => {
			console.log('deep frying ' + imageUrl)
			startTyping()
			return Jimp.read(imageUrl)
		}).then(image => {
			image.contrast(Math.random())
			.color([{apply: 'saturate', params: [Math.floor(100*Math.random())]}])
			.posterize(Math.floor(4 + 10*Math.random()))
			.quality(Math.floor(50*Math.random()))
			.getBuffer(Jimp.MIME_JPEG, (err, buffer) => {
				stopTyping()
				if (err) throw err
				else channel.uploadFile(buffer, 'deepfry.jpg')
			})
		}).catch(error)
	} else if (/wednesday my dudes/i.test(message)) {
		if (new Date().getDay() == 3) {
			channel.uploadFile(fs.readFileSync('./me-irl-bot/images/wednesday.jpg'))
		} else {
			channel.sendMessage('no it\'s not')
		}
	} else if (/several people are typing/i.test(message)) {
		MeIrlBot.User.setUsername('several people')
		startTyping()
		setTimeout(() => {
			stopTyping()
			MeIrlBot.User.setUsername('MeIRLBot')
		}, 30000)
	}
	
	function getFirstImage() {
		return channel.fetchMessages(20).then(() => {
			for (var m of channel.messages.reverse()) {
				//console.log(m.embeds,m.attachments)
				if (m.embeds && m.embeds.length && m.embeds[0].type == 'image' && isImage(m.embeds[0].url)) {
					return m.embeds[0].url
				} else if (m.attachments && m.attachments.length && isImage(m.attachments[0].url)) {
					return m.attachments[0].url
				}
			}
			throw 'no image found'
		})
	}
	function isImage(url) {
		return /png|jpg|jpeg$/i.test(url)
	}
	function error(err) {
		console.log(err)
		channel.sendMessage(':x: nope :no_good: :triumph::' + err + ' :pensive:')
	}
	function startTyping() {
		console.log('typing...')
		channel.sendTyping()
		typing = setInterval(() => {
			console.log('typing some more...')
			channel.sendTyping()
		}, 10000)
	}
	function stopTyping() {
		console.log('stopped typing')
		clearInterval(typing)
	}
})