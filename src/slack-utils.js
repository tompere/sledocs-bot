function parseItem(item) {
  const [k, v] = item.split('=');
  return {[k]: v};
}

function parseSlackBody(raw) {
  return raw.split('&').reduce((result, curr) => ({
    ...result,
    ...(parseItem(curr)),
  }), {});
}

module.exports = {parseSlackBody};
