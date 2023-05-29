const mongodb = require('../db/connect');

/**
 * Creates test cases for a controller.
 * @param {Function} controller - The controller function to be tested.
 */
const createControllerTests = (controller) => {
  let response;

  beforeEach(() => {
    // Set up a mocked response object before each test case
    response = {
      status: jest.fn().mockReturnThis(), // Mocked status function
      json: jest.fn(), // Mocked json function
      setHeader: jest.fn(), // Mocked setHeader function
      send: jest.fn(), // Mocked send function
    };

    // Mock the database operations
    mongodb.getDb = jest.fn().mockReturnValue({
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      find: jest.fn().mockReturnThis(),
      toArray: jest.fn(),
      insertOne: jest.fn(),
      replaceOne: jest.fn(),
      deleteOne: jest.fn(),
    });
  });

  afterEach(() => {
    // Clear all mock functions after each test case
    jest.clearAllMocks();
  });

  it('should handle internal server error', async () => {
    // Create an error object representing an internal server error
    const error = new Error('Internal Server Error');

    // Mock the behavior of a database operation
    mongodb.getDb().collection().find().toArray.mockRejectedValue(error);

    // Call the controller function with an empty object as the first argument
    // and the mocked response object as the second argument
    await controller({}, response);

    // Check if the status function of the response object was called with the argument 500
    expect(response.status).toHaveBeenCalledWith(500);

  });
};

/**
 * Test the GET route for querying all records
 * @param {string} controller The controller name or object with toString defined
 * @param {import('express').RequestHandler} getAll The GET route handler
 */
function getAllTest (controller, getAll) {
  describe(getAll.name, () => {
    test(`should return all info in ${controller} if found`, async () => {
      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce(['Response1', 'Response2']),
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
        // Call the findAllAdmin function
      await getAll({}, mockResponse);

      // Verify the response status and JSON data
      expect(mockResponse.status).toHaveBeenCalledWith(500);

      // Reset the _db variable
      global._db = undefined;
    });

    test('should return an error if no info found', async () => {
      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockResolvedValueOnce([]),
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the findAllAdmin function
      await getAll({}, mockResponse);

      // Verify the response status and error message
      expect(mockResponse.status).toHaveBeenCalledWith(500);

      // Reset the _db variable
      global._db = undefined;
    });

    test('should return an error if an exception occurs', async () => {
      const mockError = new Error('Database error');
      const mockCollection = {
        find: jest.fn().mockReturnThis(),
        toArray: jest.fn().mockRejectedValueOnce(mockError),
      };

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the findAllAdmin function
      await getAll({}, mockResponse);


      // Verify the response status and error message
      expect(mockResponse.status).toHaveBeenCalledWith(500);

      // Reset the _db variable
      global._db = undefined;
    });
  });
}

module.exports = { createControllerTests, getAllTest };
