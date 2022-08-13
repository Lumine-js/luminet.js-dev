//========== STRUCTURE DATA
const Constants = require("./../util/constants.js")

//========== PACKAGE
const { EventEmitter } = require("node:events")

const axios = require("axios")
//========= CLASS
class Client extends EventEmitter {
  constructor(options) {
    super()
    this.token = options?.token || null;
    this._active = false
  }

  async login(token) {
    if (this._active) {
      return console.log('Client Already Run')
    }

    var updates = []
    var latest = 0;

    await this.requestAPI("GET", Constants.ENDPOINTS.getUpdate()).then(denora => {
      updates = denora.result.sort((a, b) => b.update_id - a.update_id)
      latest = updates[0].update_id
    })
    setInterval(async function() {
      await this.requestAPI("GET", Constants.ENDPOINTS.getUpdate()).then(denora => {
        updates = denora.result.sort((a, b) => b.update_id - a.update_id)
      })
      var newev = updates.filter(x => x.update_id > latest)
      latest = newev[0].update_id
      await newev.forEach(nm => {
        if (nm?.message) {
          this.emit('messageCreate', nm.message)
        }
      })
    }.bind(this), 1000)

  }

  async requestAPI(method, endpoint, body) {
    var ccpn = {
      url: `https://api.telegram.org/bot${this.token}/${endpoint}`,
      method: method
    }

    if (body) ccpn.body = body

    return axios(ccpn).then(x => {
      return x.data
    }).catch(x => {
      console.log(`[ERROR] ${x}`)
    })
  }
}

module.exports = Client
