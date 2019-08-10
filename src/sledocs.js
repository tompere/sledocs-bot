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

module.exports = async (event) => {
  const {text} = parseSlackBody(event.body);
  return {
    statusCode: 200,
    body: `searched! 💪 ${text}`,
  };
};

// post to slack
// curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
