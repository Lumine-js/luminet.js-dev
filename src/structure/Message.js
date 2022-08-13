class Message {
  constructor(options = {}, client) {
    this.client = client
    if(client?.advmode) {
      //Maintenance
    } else {
      this.authorId = options?.from?.id || null
      this.channelId = options?.chat?.id || null
      this.id = options?.message_id || null
      this.content = options?.text || null
    }
  }
}

module.exports = Message
