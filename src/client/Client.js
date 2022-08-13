//========== STRUCTURE DATA
const Constants = require("./../util/constants.js")

//========== PACKAGE
const { EventEmitter } = require("node:events")

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
    var updates = numbers.sort((a, b) => b.update_id - a.update_id)
    console.log(updates.toString())
    
    /*
    setInterval(function() {
      
    }.bind(this), 1000)*/

  }

  requestUpdates() {
    var cdl = this.requestAPI("GET", Constants.ENDPOINTS.getUpdate())
    return cdl.result
  }

  requestAPI(method, endpoint, body) {
    var ccpn = {
      url: `https://api.telegram.org/bot${token}/${endpoint}`,
      method: method
    }

    if (body) ccpn.body = body

    axios(ccpn).then(x => {
      return x.data
    }).catch(x => {
      console.log(`[ERROR] ${x}`)
    })
  }
}

module.exports = Client
