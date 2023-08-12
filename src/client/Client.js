//========== STRUCTURE DATA
const Constants = require("./../util/constants.js")

const Message = require("./../structure/Message.js")
const UserClient = require("./../structure/UserClient.js")
//========== PACKAGE
const { EventEmitter } = require("node:events")
const fetch = require('node-fetch');
const WebSocket = require("ws");
const clc = require("cli-color")
const packg = require("./../../package.json")

//========= CLASS
class Client extends EventEmitter {
  constructor(options) {
    super()
    this.token = options?.token || null;
    this._active = false
    this.on("ready", (user) => {
      const packg = require("./../../package.json")
      console.log(`Bot ${clc.bold.blue(user.username)} telah aktif, \nKamu menggunakan ${clc.yellow.bold(packg.name)} versi ${packg.version}.\nDokumentasi bisa diperiksa pada \n${clc.blue(`https://github.com/Lumine-js/${packg.name}`)}\n\n\n\n`)
    })
  }



  async login(token) {
    if (!this.token) {
      if (!token) {
        throw TypeError("Token Invalid")
      }
      this.token = token
    }
    if (this._active) {
      throw TypeError('Client Already Run')
    }

    var updates = []
    var latest = 0;

    await this.requestAPI("GET", Constants.ENDPOINTS.getMe()).then(x => {
      if (x.result) {
        this.emit("ready", new UserClient(x.result))
      } else {
        throw TypeError("Your token is not connected to the bot")
      }
    })


    await this.requestAPI("GET", Constants.ENDPOINTS.getUpdate()).then((denora) => {
      if (denora?.result?.length > 0) {
        updates = denora.result.sort((a, b) => b.update_id - a.update_id)
        latest = updates[0].update_id
      }
    })
    setInterval(function() {
      return this.requestAPI("GET", Constants.ENDPOINTS.getUpdate()).then((denora) => {
        if (denora?.result?.length > 0) {
          updates = denora.result.sort((a, b) => b.update_id - a.update_id)
          var newev = updates.filter(x => x.update_id > latest)
          if (newev?.length > 0) {
            latest = newev[0].update_id
            return newev.forEach(nm => {
              this.emit('rawEvent', nm)
              if (nm?.message) {
                this.emit('messageCreate', new Message(nm.message))
              }
            })
          }
        }
      })
    }.bind(this), 1500)

  }
  async requestAPI(method, endpoint, parameter) {
    var ccpn = {
      url: `https://api.telegram.org/bot${this.token}/${endpoint}`,
      method: method,
      headers: {
        "Accept": "application/json",
        "Content-type": "application/json"
      }
    }

    if (parameter) {
      await parameter.forEach((x, u) => {
        ccpn.url = ccpn.url + `${(u === 0) ? "?" : "&"}${x.title}=${encodeURIComponent(x.body)}`
      })
    }

    try {
      return fetch(ccpn.url, {
          method: ccpn.method,
          headers: ccpn.headers
        })
        .then((res) => res.text())
        .then((res) => {
          var data = res ? JSON.parse(res) : {}
          return data
        })
    } catch (err) {
      throw new Error(err)
    }
  }

  sendMessage(channelId, content) {
    this.requestAPI("POST", Constants.ENDPOINTS.sendMessage(), [
      { title: "chat_id", body: channelId },
      { title: "text", body: content }])
  }
}

module.exports = Client