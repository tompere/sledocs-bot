const algoliasearch = require('algoliasearch');
const _ = require('lodash');

function initAlgolia() {
  const client = algoliasearch('BH4D9OD16A', process.env.ALGOLIA_API_KEY);
  return client.initIndex('wix_sled');
}

function parseSingleHit(hit) {
  const {hierarchy, url} = hit;
  const breadcrumbs = _(hierarchy).filter(_.isString).value();
  return {
    breadcrumbs,
    url,
  };
}

function parseResults(results) {
  const {hits} = results;
  return _(hits).map(parseSingleHit).value();
}

module.exports = {initAlgolia, parseResults};
