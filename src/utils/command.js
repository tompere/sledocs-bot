const _ = require('lodash');

const SUPPORTED_APPS = ['sled', 'yoshi'];

function parseQuery(appId, txt) {
  const query = String(txt).substr(`${appId} `.length);
  if (!query) {
    throw new Error(`You sent an empty search query...`);
  }
  return query;
}

function parseFirstArg(txt) {
  const appId = SUPPORTED_APPS.find((id) => _.startsWith(txt, `${id} `));
  if (!appId) {
    throw new Error(`This project docs are not supported, we only support [${SUPPORTED_APPS.join(', ')}]`);
  }
  return appId;
}

function parseCommand(text) {
  const txt = decodeURIComponent(text.replace('+', ' '));
  if (!txt) {
    throw new Error(`You sent an empty command...`);
  }
  const appId = parseFirstArg(txt);
  const query = parseQuery(appId, txt);
  return {
    appId,
    query,
  };
}

module.exports = {parseCommand};
