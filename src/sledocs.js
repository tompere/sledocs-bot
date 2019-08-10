const {initAlgolia, parseResults} = require('./algolia-utils');
const {parseSlackBody, formatMessage} = require('./slack-utils');
const Entities = require('html-entities').AllHtmlEntities;

const entities = new Entities();

module.exports = async (event) => {
  const {text, channel_id: channel} = parseSlackBody(event.body);
  const query = entities.decode(text);
  const algoliaResults = await initAlgolia().search({
    query,
    hitsPerPage: 3,
    typoTolerance: false,
    distinct: 1,
  });
  const results = parseResults(algoliaResults);
  return {
    statusCode: 200,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(formatMessage(results, {channel, query})),
  };
};
