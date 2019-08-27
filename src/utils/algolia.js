const algoliasearch = require('algoliasearch');
const _ = require('lodash');

const SUPPORTED_APPS = {
  sled: {
    key: '9616f11f6088f2e451210554e14314e4',
    index: 'wix_sled',
    instance: null,
  },
  yoshi:
  {
    key: '5807169f7e8a322a659ac4145a3e5d8a',
    index: 'wix_yoshi',
    instance: null,
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
  return _(results.hits)
      .map(parseSingleHit)
      .uniqBy(({url}) => url)
      .slice(0, 3)
      .value();
}

async function search(appId, query) {
  const instance = SUPPORTED_APPS[appId].instance || initAlgolia(appId);
  return instance.search({
    query,
    typoTolerance: false,
    distinct: 1,
  });
}

module.exports = {parseResults, search};
