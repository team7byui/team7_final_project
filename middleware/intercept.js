const dateTimeParse = require('../util/dateTimeParse.js');

const convertDateTimeToIso = (obj) => {
  const startDate = obj['startDate'];
  if (startDate) {
    const d = new Date(startDate);
    obj['date'] = d.toLocaleDateString();
    obj['time'] = d.toLocaleTimeString();
  } else {
    const dateStr = obj['date'] || '';
    const timeStr = obj['time'] || '';
    if (dateStr || timeStr) {
      const isoDate = dateTimeParse(dateStr, timeStr);
      obj['startDate'] = isoDate;
    }
  }
};

/**
 * Modifies the body of the request before processing.
 * @param {import('express').Request} req The request pipeline
 * @param {import('express').Request} res The response pipeline
 * @param {import('express').NextFunction} next The next handler
 */
const dateRequest = (req, res, next) => {
  if (req.body) convertDateTimeToIso(req.body);
  next();
};

/**
 * Hooks the Response and modifies the JSON object before it is sent.
 * @param {import('express').Request} req The request pipeline
 * @param {import('express').Request} res The response pipeline
 * @param {import('express').NextFunction} next The next handler
 */
const dateResponse = (req, res, next) => {
  const _json = res.json;

  res.json = (data) => {
    if (data) {
      if (Array.isArray(data)) {
        data.forEach(convertDateTimeToIso);
      } else {
        convertDateTimeToIso(data);
      }
    }
    return _json.apply(res, [data]);
  };

  next();
};

module.exports = { dateRequest, dateResponse};