const {initAlgolia, parseResults} = require('./algolia-utils');
const {parseSlackBody} = require('./slack-utils');
const decode = require('unescape');

module.exports = async (event) => {
  const {text, channel_id: channel} = parseSlackBody(event.body);
  const query = decode(text);
  const algoliaResults = await initAlgolia().search({
    query,
    hitsPerPage: 3,
    typoTolerance: false,
    distinct: 1,
  });
  const results = parseResults(algoliaResults);
  const docReferences = results.map(({breadcrumbs, url}) => ({
    type: 'section',
    text: {
      'type': 'mrkdwn',
      'text': `*${breadcrumbs.join(' > ')}* <${url}|Read>`,
    },
  }));
  const header = [{
    type: 'section',
    text: {
      'type': 'mrkdwn',
      'text': `:owl: Here all docs reference I found for *${query}*:`,
    },
  },
  {
    'type': 'divider',
  }];
  return {
    statusCode: 200,
    headers: {'content-type': 'application/json'},
    body: JSON.stringify({
      channel,
      blocks: header.concat(docReferences),
    }),
  };
};
