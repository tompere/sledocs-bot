const sledocs = require('../src/sledocs');

const mockBody = ({text}) => `token=1nAm2GHEXEyAklFzPU0zd65a&team_id=TM18CJRBK&team_domain=tomp-personal&channel_id=CM7KFBKBP&channel_name=general&user_id=UM7K8QNAC&user_name=tomp&command=%2Fsledocs&text=${text}&response_url=https%3A%2F%2Fhooks.slack.com%2Fcommands%2FTM18CJRBK%2F722004961236%2Fz6klTADxeDeM6DRXnwlFHovG&trigger_id=711032798515.715284637393.1474955833da7dc35f9a68bf7bcabcbf`;

describe('sledocs', () => {
  it('should return text from slack', async () => {
    const text = 'wham-bam';
    const {statusCode, body} = await sledocs({
      body: mockBody({text})
    })
    expect(statusCode).toBe(200)
    expect(body).toBe(`searched! 💪 ${text}`)
  });
});