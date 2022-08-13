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

  login(token) {
    if (this._active) {
      return console.log('Client Already Run')
    }
    
    
    var denora = this.requestUpdates()
    var updates = denora.result.sort((a, b) => b.update_id - a.update_id)
    console.log(updates.toString())
    
    /*
    setInterval(function() {
      
    }.bind(this), 1000)*/

  }

  requestUpdates() {
    return this.requestAPI("GET", Constants.ENDPOINTS.getUpdate())
  }

  requestAPI(method, endpoint, body) {
    var ccpn = {
      url: `https://api.telegram.org/bot${this.token}/${endpoint}`,
      method: method
    }

    if (body) ccpn.body = body

    axios(ccpn).then(x => {
      console.log(x.data)
      return x.data
    }).catch(x => {
      console.log(`[ERROR] ${x}`)
    })
  }
}

module.exports = Client
