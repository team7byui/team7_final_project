/**
 * @author John Sudds
 */

/**
 * Reads MongoDB query from body, and field projection from query string.
 * @param {import('mongoose').Model} model The model to query
 * @param {import('express').Request} request The express request object
 * @returns {any} The query results
 */
const queryFromRequest = async (model, request) => {
  const query = request.body || {};
  const projection = request.query.fields?.split(',')
    .reduce((prev, curr) => { prev[curr] = 1; return prev; }, {});
  return Array.isArray(query)
    ? await model.aggregate(query)
    : await model.find(query, projection);

};

module.exports = queryFromRequest;