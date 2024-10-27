const moment = require("moment");
function formatMessage(username, text) {
  return {
    user: username,
    text: text,
    time: moment().format("h:mm a"),
  };
}
module.exports = formatMessage;
