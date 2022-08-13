Class UserClient {
  constructor(options = {}, client) {
    this.id = options?.id
    this.username = options?.username
  }
}

module.exports = UserClient
