/* eslint-disable max-len */
const sledocs = require('../src/sledocs');
const {initAlgolia, parseResults} = require('../src/algolia-utils');

jest.mock('../src/algolia-utils');

describe('sledocs', () => {
  let mockSearch;

  const mockBody = ({text}) => `token=1nAm2GHEXEyAklFzPU0zd65a&team_id=TM18CJRBK&team_domain=tomp-personal&channel_id=CM7KFBKBP&channel_name=general&user_id=UM7K8QNAC&user_name=tomp&command=%2Fsledocs&text=${text}&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTM18CJRBK%2F722004961236%2Fz6klTADxeDeM6DRXnwlFHovG&trigger_id=711032798515.715284637393.1474955833da7dc35f9a68bf7bcabcbf`;
  const mockSearchResults = {hello: 'result'};

  beforeEach(() => {
    mockSearch = jest.fn();
    initAlgolia.mockReturnValue({
      search: mockSearch,
    });
    parseResults.mockReturnValue([
      {
        breadcrumbs: ['a', 'b', 'c'],
        url: 'www.wham.com/abc',
      },
      {
        breadcrumbs: ['e', 'f'],
        url: 'www.wham.com/ef',
      },
    ]);
  });

  it('should return text from slack', async () => {
    const text = 'wham-bam';
    mockSearch.mockReturnValue(mockSearchResults);

    const {statusCode, body} = await sledocs({
      body: mockBody({text}),
    });

    expect(parseResults).toHaveBeenCalledWith(mockSearchResults);
    expect(mockSearch).toHaveBeenCalledWith({
      query: text,
      hitsPerPage: 3,
      typoTolerance: false,
      distinct: 1,
    });
    expect(statusCode).toBe(200);
    expect(body).toEqual(JSON.stringify({
      channel: 'CM7KFBKBP',
      blocks: [
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `Here are all the docs reference I found for query _wham-bam_:`,
          },
        },
        {
          'type': 'section',
          'text': {
            'type': 'mrkdwn',
            'text': `- a • b • c <www.wham.com/abc|read>\n- e • f <www.wham.com/ef|read>`,
          },
        },
        {
          'type': 'divider',
        },
      ],
    }));
  });
});
