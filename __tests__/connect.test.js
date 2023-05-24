const { MongoClient } = require('mongodb');
const { initDb, getDb } = require('../db/connect');

jest.mock('mongodb');

describe('Database Connection', () => {
  describe('initDb', () => {
    test('should initialize the database connection and call the callback', async () => {
      const mockClient = {};
      const mockCallback = jest.fn();

      // Mock the MongoClient connect method
      MongoClient.connect.mockResolvedValueOnce(mockClient);

      // Call the initDb function
      await initDb(mockCallback);

      // Verify that MongoClient connect method was called with the correct arguments
      expect(MongoClient.connect).toHaveBeenCalledWith(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@team7.cvagdmh.mongodb.net`
      );

      // Verify that the callback was called with the expected arguments
      expect(mockCallback).toHaveBeenCalledWith(null, mockClient);
    });

    test('should return an error if connection fails and call the callback', async () => {
      const mockError = new Error('Connection failed');
      const mockCallback = jest.fn();

      // Mock the MongoClient connect method to reject
      MongoClient.connect.mockRejectedValueOnce(mockError);

      // Call the initDb function
      await initDb(mockCallback);

      // Verify that MongoClient connect method was called with the correct arguments
      expect(MongoClient.connect).toHaveBeenCalledWith(
        `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@team7.cvagdmh.mongodb.net`
      );
    });

    test('should not initialize the database if already initialized and call the callback', async () => {
      const mockClient = {};
      const mockCallback = jest.fn();

      // Set the _db variable to simulate initialization
      global._db = mockClient;

      // Call the initDb function
      await initDb(mockCallback);

      // Verify that the callback was called with the expected arguments
      expect(mockCallback).toHaveBeenCalledWith(null, mockClient);

      // Reset the _db variable
      global._db = undefined;
    });
  });

  describe('getDb', () => {
    test('should return the database connection if initialized', () => {
      const mockClient = {};

      // Set the _db variable to simulate initialization
      global._db = mockClient;

      // Call the getDb function
      const result = getDb();

      // Verify that the result is the expected database connection
      expect(result).toEqual(mockClient);

      // Reset the _db variable
      global._db = undefined;
    });
  });
});
