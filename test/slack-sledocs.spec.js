/* eslint-disable max-len */
const sledocs = require('../src/sledocs');
const {search, parseResults} = require('../src/utils/algolia');

jest.mock('../src/utils/algolia');

const MOCK_CHANNEL_ID = 'CM7KFBKBP';

describe('sledocs', () => {
  const mockBody = ({text}) => `token=1nAm2GHEXEyAklFzPU0zd65a&team_id=TM18CJRBK&team_domain=tomp-personal&channel_id=${MOCK_CHANNEL_ID}&channel_name=general&user_id=UM7K8QNAC&user_name=tomp&command=%2Fsledocs&text=${text}&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTM18CJRBK%2F722004961236%2Fz6klTADxeDeM6DRXnwlFHovG&trigger_id=711032798515.715284637393.1474955833da7dc35f9a68bf7bcabcbf`;
  const mockSearchResults = {hello: 'result'};

  it('should return text from slack', async () => {
    parseResults.mockReturnValue([
      {
        breadcrumbs: ['Basic Usage', 'Local debugging', 'Adding breakpoint to your test'],
        url: 'www.x.com',
        snippet: 'Install  Nim <span class=\"algolia-docsearch-suggestion--highlight\">Chrome</span> extention  ',
      },
      {
        breadcrumbs: ['Under The Hood', 'Cloud Vendors Benchmarks'],
        url: 'www.y.com',
        snippet: 'Puppeteer benchmark was done using  <span class=\"algolia-docsearch-suggestion--highlight\">chrome</span>-aws-lambda v1.16',
      },
      {
        breadcrumbs: ['Getting Started', 'A Really Quick Start', 'Authentication'],
        url: 'www.z.com',
        snippet: null,
      },
    ]);
    const text = 'wham-bam';
    search.mockReturnValue(mockSearchResults);

    const {statusCode, body} = await sledocs({
      body: mockBody({text}),
    });

    expect(parseResults).toHaveBeenCalledWith(mockSearchResults);
    expect(search).toHaveBeenCalledWith(text);
    expect(statusCode).toBe(200);
    const expectedResults = [
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': 'Here are all the docs reference I found for search query _*wham-bam*_:',
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '1. <www.x.com|Adding breakpoint to your test>\n> Install Nim *Chrome* extention\n(_Basic Usage • Local debugging_)',
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '2. <www.y.com|Cloud Vendors Benchmarks>\n> Puppeteer benchmark was done using *chrome*-aws-lambda v1.16\n(_Under The Hood_)',
        },
      },
      {
        'type': 'section',
        'text': {
          'type': 'mrkdwn',
          'text': '3. <www.z.com|Authentication>\n(_Getting Started • A Really Quick Start_)',
        },
      },
    ];
    expect(JSON.stringify(JSON.parse(body), null, 2)).toEqual(JSON.stringify({
      channel: MOCK_CHANNEL_ID,
      blocks: expectedResults,
    }, null, 2));
  });

  it('should create empty response', async () => {
    parseResults.mockReturnValue([]);
    const text = 'wham-bam';
    // search.mockReturnValue(mockSearchResults);
    const {statusCode, body} = await sledocs({
      body: mockBody({text}),
    });
    expect(statusCode).toBe(200);
    expect(body).toEqual(JSON.stringify({
      channel: MOCK_CHANNEL_ID,
      blocks: [
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': 'No docs were found for search query _*wham-bam*_:',
          },
        },
      ],
    }));
  });
});
