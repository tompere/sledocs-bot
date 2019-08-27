const algoliasearch = require('algoliasearch');
const _ = require('lodash');

const SUPPORTED_APPS = {
  sled: {
    key: '9616f11f6088f2e451210554e14314e4',
    index: 'wix_sled',
    instance: null,
    options: {},
  },
  yoshi:
  {
    key: '5807169f7e8a322a659ac4145a3e5d8a',
    index: 'wix_yoshi',
    instance: null,
    options: {
      filters: 'version:4.x',
    },
  },
};


function initAlgolia(appId) {
  const {key, index} = SUPPORTED_APPS[appId];
  const client = algoliasearch('BH4D9OD16A', key);
  SUPPORTED_APPS[appId].instance = client.initIndex(index);
  return SUPPORTED_APPS[appId].instance;
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

async function search(appId, query) {
  const {instance, options} = SUPPORTED_APPS[appId];
  const index = instance || initAlgolia(appId);
  return index.search({
    query,
    hitsPerPage: 5,
    typoTolerance: false,
    distinct: 1,
    ...options,
  });
}

module.exports = {parseResults, search};
