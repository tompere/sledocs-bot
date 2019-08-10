const {initAlgolia, parseResults} = require('./algolia-utils');
const {parseSlackBody} = require('./slack-utils');

module.exports = async (event) => {
  const {text} = parseSlackBody(event.body);
  const algoliaResults = await initAlgolia().search({
    query: text,
    hitsPerPage: 3,
    typoTolerance: false,
    distinct: 1,
  });
  const parsedResults = JSON.stringify(parseResults(algoliaResults), null, 2);
  return {
    statusCode: 200,
    body: `:rocket: searched! '${text}'\n:star: result is:\n${parsedResults}`,
  };
};
