const algoliasearch = require('algoliasearch');

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

function initAlgolia() {
  const client = algoliasearch('BH4D9OD16A', process.env.ALGOLIA_API_KEY);
  return client.initIndex('wix_sled');
}

module.exports = async (event) => {
  const {text} = parseSlackBody(event.body);
  const index = initAlgolia();
  const data = await index.search({query: text});
  return {
    statusCode: 200,
    body: `searched! 💪 ${text}.\nresult is ${JSON.stringify(data, null, 2)}`,
  };
};

// post to slack
// curl -X POST -H 'Content-type: application/json' --data '{"text":"Hello, World!"}' https://hooks.slack.com/services/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
