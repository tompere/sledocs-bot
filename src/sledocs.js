const {search, parseResults} = require('./utils/algolia');
const {parseSlackBody, formatMessage} = require('./utils/slack');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

module.exports = async (event) => {
  const {text, channel_id: channel} = parseSlackBody(event.body);
  const query = entities.decode(text);
  const algoliaResults = await search(query);
  const hits = parseResults(algoliaResults);
  return {
    statusCode: 200,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(formatMessage(hits, {channel, query})),
  };
};
