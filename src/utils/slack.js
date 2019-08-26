const _ = require('lodash');
const sanitize = require('sanitize-html');

function parseItem(item) {
  const [k, v] = item.split('=');
  return {[k]: v};
}

// https://api.slack.com/slash-commands#app_command_handling
function parseSlackBody(raw) {
  return raw.split('&').reduce((result, curr) => ({
    ...result,
    ...(parseItem(curr)),
  }), {});
}

function sanitizeSnippet(raw) {
  if (!raw) {
    return '';
  }
  let foundHighlighted = false;
  const r = sanitize(raw, {
    allowedTags: ['span'],
    transformTags: {
      'span': (_tagName, attribs) => {
        if (attribs.class === 'algolia-docsearch-suggestion--highlight') {
          foundHighlighted = true;
        }
        return {};
      },
    },
    textFilter: (txt) => {
      if (foundHighlighted) {
        foundHighlighted = false;
        return `*${txt}*`;
      }
      return txt;
    },
  });
  return r.trim().replace(/\s\s/, ' ');
}


// https://api.slack.com/tools/block-kit-builder
function formatMessage(hits, {channel, query}) {
  const results = hits.map(({breadcrumbs, url, snippet}, i) => {
    const _title = `${i + 1}. <${url}|${_.last(breadcrumbs)}>`;
    breadcrumbs.pop();
    const sanitized = sanitizeSnippet(snippet);
    const _optionalSnippet = sanitized ? `> ${sanitized}\n` : '';
    const _breadcrumbs = `(_${breadcrumbs.join(' • ')}_)`;
    return {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: `${_title}\n${_optionalSnippet}${_breadcrumbs}`,
      },
    };
  });
  return {
    channel,
    blocks: [
      {
        type: 'section',
        text: {
          'type': 'mrkdwn',
          'text': `Here are all the docs reference I found for query _*${query}*_:`,
        },
      },
      ...results,
    ],
  };
}

module.exports = {parseSlackBody, formatMessage};
