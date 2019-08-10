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

function formatMessage(results, {channel, query}) {
  const docReferences = results.map(
      ({breadcrumbs, url}) => `- ${breadcrumbs.join(' • ')} <${url}|read>`)
      .join('\n');
  return {
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
}

module.exports = {parseSlackBody, formatMessage};
