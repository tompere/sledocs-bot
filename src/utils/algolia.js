const algoliasearch = require('algoliasearch');
const _ = require('lodash');

let index;

function initAlgolia() {
  const client = algoliasearch('BH4D9OD16A', process.env.ALGOLIA_API_KEY);
  index = client.initIndex('wix_sled');
}

function parseSingleHit(hit) {
  const {hierarchy, url, _snippetResult} = hit;
  const breadcrumbs = _(hierarchy).filter(_.isString).value();
  return {
    breadcrumbs,
    url,
    snippet: _.get(_snippetResult, ['content', 'value']),
  };
}

function parseResults(results) {
  return results.hits.map(parseSingleHit);
}

async function search(query) {
  if (!index) {
    initAlgolia();
  }
  return index.search({
    query,
    hitsPerPage: 3,
    typoTolerance: false,
    distinct: 1,
  });
}

module.exports = {parseResults, search};
