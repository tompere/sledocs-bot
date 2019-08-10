function parseItem(item) {
  const [k, v] = item.split('=');
  return {[k]: v};
}

// https://api.slack.com/slash-commands#app_command_handling
function parseSlackBody(raw) {
  return raw.split('&').reduce((result, curr) => ({
    ...result,
    ...(parseItem(curr)),
  }), {});
}

module.exports = {parseSlackBody};
