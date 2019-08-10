const {initAlgolia, parseResults} = require('./algolia-utils');
const {parseSlackBody} = require('./slack-utils');
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
  const docReferences = results.map(
      ({breadcrumbs, url}) => `- ${breadcrumbs.join(' • ')} <${url}|read>`)
      .join('\n');
  const body = {
    channel,
    blocks: [
      {
        type: 'section',
        text: {
          'type': 'mrkdwn',
          'text': `Here are all the docs reference I found for query _${query}_:`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: docReferences,
        },
      },
      {
        type: 'divider',
      },
    ],
  };
  return {
    statusCode: 200,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify(body),
  };
};
