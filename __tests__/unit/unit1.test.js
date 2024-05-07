// Setup for testing with Jest and supertest
const request = require('supertest');
const { fetchSpaceXLaunches } = require('../../src/server');

// Mock data for testing SpaceX launches
const mockSuccessfulLaunches = [
  { id: 1, name: 'Falcon 9' },
  { id: 2, name: 'Starlink 1' }
];
const mockEmptyLaunches = [];

describe('SpaceX Launches Fetch Tests', () => {

  beforeEach(() => {
    // Clear fetch mocks before each test
    fetchMock.mockClear();
    fetchMock.mockResponseOnce(JSON.stringify(currentMockData));
  });

  afterEach(() => {
    fetchMock.mockClear();
    fetchMock.resetMocks(); // Resetting mocks to ensure clean setup for every test
  });

  let currentMockData = mockSuccessfulLaunches;
  it('Should return JSON containing all launches', async () => {
    // Execute the fetch function and check responses
    const launches = await fetchSpaceXLaunches();
    expect(launches).toBeDefined();
    expect(launches).toBeInstanceOf(Array);
    if (launches.length > 0) {
      expect(launches[0]).toHaveProperty('id');
      expect(launches[0]).toHaveProperty('name');
    }
  });
});
