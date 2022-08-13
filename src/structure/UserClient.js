class UserClient {
  constructor(options = {}, client) {
    super()
    this.id = options?.id
    this.username = options?.username
  }
}

module.exports = UserClient
