const bunyan = require("bunyan");

const stream = {
  level: process.env.LOG_LEVEL,
  stream: process.stdout,
};

const logger = bunyan.createLogger({
  name: "Project Space",
  streams: [stream],
  src: true,
});

module.exports = logger;
