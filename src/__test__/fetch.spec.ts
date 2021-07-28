import fetch from 'node-fetch';

describe('fetch', () => {
  it('request', async function () {
    const res = await fetch('https://api.powerfulyang.com/api/common-node');
    const json = await res.json();
    expect(json).toBeDefined();
  });
});
