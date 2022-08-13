//========== STRUCTURE DATA
const Constants = require("./../util/constants.js")

const Message = require("./../structure/Message.js")
const UserClient = require("./../structure/UserClient.js")
//========== PACKAGE
const { EventEmitter } = require("node:events")

const axios = require("axios")
//========= CLASS
class Client extends EventEmitter {
  constructor(options) {
    super()
    this.token = options?.token || null;
    this._active = false
    this.on("ready", (user) => {
      const packg = require("./../../package.json")
      console.log(`====== Lumine.js (Project)\n${packg.name} - ${packg.version}\n\nNow Login To ${user.username}\n======`)
    })
  }

  async login(token) {
    if (!this.token) {
      return console.log("Token Invalid")
    }
    if (this._active) {
      return console.log('Client Already Run')
    }

    var updates = []
    var latest = 0;

    await this.requestAPI("GET", Constants.ENDPOINTS.getMe()).then(x => this.emit("ready", new UserClient(x.result)))

    await this.requestAPI("GET", Constants.ENDPOINTS.getUpdate()).then(denora => {
      updates = denora.result.sort((a, b) => b.update_id - a.update_id)
      latest = updates[0].update_id
    })
    setInterval(async function() {
      await this.requestAPI("GET", Constants.ENDPOINTS.getUpdate()).then(denora => {
        updates = denora.result.sort((a, b) => b.update_id - a.update_id)
      })
      var newev = updates.filter(x => x.update_id > latest)
      if (newev.length > 0) {
        latest = newev[0].update_id
        await newev.forEach(nm => {
          if (nm?.message) {
            this.emit('messageCreate', new Message(nm.message))
          }
        })
      }
    }.bind(this), 1000)

  }

  async requestAPI(method, endpoint, body) {
    var ccpn = {
      url: `https://api.telegram.org/bot${this.token}/${endpoint}`,
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      }
    }

    if (body) ccpn.body = body

    return axios(ccpn).then(x => {
      return x.data
    }).catch(x => {
      console.log(`[ERROR] ${x}`)
    })
  }

  sendMessage(channelId, content) {
    this.requestAPI("POST", Constants.ENDPOINTS.sendMessage(), { chat_id: channelId, text: content })
  }
}

module.exports = Client
