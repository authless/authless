class ServerError extends Error {
  constructor (message, extra) {
    super(message);
    Object.assign(this, extra);
  }
}

module.exports = { ServerError }
