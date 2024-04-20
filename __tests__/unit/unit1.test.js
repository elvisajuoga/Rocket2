// Assuming you are using Jest for your tests
const request = require('supertest');
const { fetchSpaceXLaunches } = require('../../src/server');

// Define the mock data for the SpaceX launches
const mockLaunchDataSuccess = [
  { id: 1, name: 'Falcon 9' },
  { id: 2, name: 'Startlink 1' }
];
const mockLaunchDataEmpty = [];


describe('Test fetchSpaceXLaunches', () => {

  beforeEach(() => {
    // Reset fetch mock before each test
    fetchMock.mockClear();
    fetchMock.mockResponseOnce(JSON.stringify(currentMockData));

//    console.log(currentMockData);
  });

  afterEach(() => {
    fetchMock.mockClear();
    fetchMock.resetMocks(); // Resets all mocks, useful if you're setting up specific mocks in individual tests
  });

  let currentMockData = mockLaunchDataSuccess;
  it('Responds with JSON of all launches', async () => {
    // Await the function directly
    const data = await fetchSpaceXLaunches();
//    console.log(data);
    expect(data).toBeDefined();
    expect(data).toBeInstanceOf(Array);
    if (data.length) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
    }
  });
});
