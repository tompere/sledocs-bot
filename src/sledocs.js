const {search, parseResults} = require('./utils/algolia');
const {parseSlackBody, formatMessage, formatErrorMessage} = require('./utils/slack');
const {parseCommand} = require('./utils/command');

module.exports = async (event) => {
  const {text, channel_id: channel} = parseSlackBody(event.body);
  let body;
  try {
    const {appId, query} = parseCommand(text);
    const algoliaResults = await search(appId, query);
    const hits = parseResults(algoliaResults);
    body = formatMessage(hits, {channel, query});
  } catch (error) {
    body = formatErrorMessage(channel, error);
  }
  return {
    statusCode: 200,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body),
  };
};
