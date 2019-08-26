const {parseResults} = require('../src/utils/algolia');
const mockResult = require('./mocks/mock-algolia-results');

describe('parse aloglia results', () => {
  it('should parse aloglia results', async () => {
    const results = parseResults(mockResult);
    expect(results).toContainEqual({
      breadcrumbs: ['Basic Usage', 'CLI'],
      url: 'https://wix-private.github.io/sled/docs/sled-test-runner-cli#docsNav',
    });
    expect(results).toContainEqual({
      breadcrumbs: ['Basic Usage', 'CLI', 'Synopsis'],
      url: 'https://wix-private.github.io/sled/docs/sled-test-runner-cli#synopsis',
    });
  });
})
;
