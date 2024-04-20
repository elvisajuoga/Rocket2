const request = require('supertest');
const { app } = require('../../src/server');

describe('GET /', () => {

  beforeEach(() => {
    // Reset fetch mock before each test
    fetchMock.mockClear();

//    console.log(Hello);
  });

  it('responds with the homepage', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'Falcon 9' }]));
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain('Falcon 9');
  });
});
