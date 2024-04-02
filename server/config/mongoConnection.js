/**
 * @file config/mongoConnection.js
 * @description Config file that manages connection to the database.
 */

import { MongoClient } from 'mongodb';
import { mongoConfig } from './mongoSettings.js';

let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(mongoConfig.serverUrl);
    _db = _connection.db(mongoConfig.database);
  }

  return _db;
};
const closeConnection = async () => {
  await _connection.close();
};

export { dbConnection, closeConnection };

