const {initAlgolia, parseResults} = require('./algolia-utils');
const {parseSlackBody} = require('./slack-utils');

module.exports = async (event) => {
  const {text} = parseSlackBody(event.body);
  const index = initAlgolia();
  const data = await index.search({query: text});
  const results = JSON.stringify(parseResults(data), null, 2);
  return {
    statusCode: 200,
    body: `searched! '${text}'\nresult is:\n${results}`,
  };
};
