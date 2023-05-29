/**
 * Interceptor for request/response for Event objects.
 * @author John Sudds
 */

const {
  dateTimeParse,
  durationParse,
  getDurationFromDates,
  getDurationMsec
} = require('../util/dateTimeParse.js');

/**
 * Return a formatted time string for two dates.
 * @param {Date} d The start date
 * @param {Date} [d2] The end date, optional
 * @returns {string} A formatted time string
 */
const getTimesFromDuration = (d, d2) => {
  let time = '';

  if (d2) {
    time = `${d.toLocaleTimeString()} - ${d2.toLocaleTimeString()}`;
  } else {
    time = d.toLocaleTimeString();
  }

  return time.replace(/:00/g, '');
};

/**
 * Return formatted date string for two dates.
 * @param {Date} d The start date
 * @param {Date} [d2] The end date, optional
 * @returns {string} A formatted date string
 */
const getDatesFromDuration = (d, d2) => {
  /**
   * Private helper function
   * @param {Date} date A date
   * @returns {string} Human readable date format
   */
  const formatDate = (date) => {
    const [weekday, month, day, year] = date.toString().split(' ');
    return `${weekday}, ${month} ${day}, ${year}`;
  };

  if (d2 && d2.getDate() !== d.getDate() ||
      d2.getMonth() !== d.getMonth() ||
      d2.getFullYear() !== d.getFullYear()) {
    return `${formatDate(d)} to ${formatDate(d2)}`;
  }

  return formatDate(d);
};

/**
 * Add missing date/time fields to specified object.
 * The ISO startDate and endDate fields are preferred.
 * The startDate and duration can also be used.
 * Otherwise, date and time fields are parsed.
 * The object will contain all the fields on exit.
 * @param {object} obj A JavaScript object
 * @param {string} [obj.startDate] An ISO formatted date, optional.
 * @param {string} [obj.endDate] An ISO formatted date, optional.
 * @param {string} [obj.duration] An ISO formatted duration, optional.
 * @param {string} [obj.date] A date, optional
 * @param {string} [obj.time] A time or time span, optional
 */
const convertDateTimeToIso = (obj) => {
  const startDate = obj['startDate'];
  const endDate = obj['endDate'];
  const duration = obj['duration'];
  if (startDate) {
    let d2;
    const d = new Date(startDate);
    if (endDate) {
      d2 = new Date(endDate);
      obj['duration'] = getDurationFromDates(d, d2);
    } else if (duration) {
      d2 = new Date(d.valueOf() + getDurationMsec(duration));
      obj['endDate'] = d2.toISOString();
    }
    obj['date'] = getDatesFromDuration(d, d2);
    obj['time'] = getTimesFromDuration(d, d2);
  } else {
    const dateStr = obj['date'] || '';
    const timeStr = obj['time'] || '';
    if (dateStr || timeStr) {
      const startDate = dateTimeParse(dateStr, timeStr);
      const duration = durationParse(timeStr);
      obj['startDate'] = startDate;
      if (duration) {
        obj['duration'] = duration;
        const d = new Date(startDate);
        const d2 = new Date(d.valueOf() + getDurationMsec(duration));
        obj['endDate'] = d2.toISOString();
      }
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

module.exports = { dateRequest, dateResponse };