const request = require('supertest');
const { app } = require('../../src/server');

describe('GET / - Homepage Route', () => {

  beforeEach(() => {
    // Clear the fetch mock before each test to ensure clean environment
    fetchMock.mockClear();
  });

  it('should successfully respond with the homepage', async () => {
    fetch.mockResponseOnce(JSON.stringify([{ id: 1, name: 'Falcon 9' }]));
    const response = await request(app).get('/');
    expect(response.statusCode).toEqual(200);
    expect(response.text).toContain('Falcon 9');
  });
});
