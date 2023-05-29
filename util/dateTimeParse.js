/** @author John Sudds */
/** @license MIT */

const ONE_SEC = 1000;
const ONE_MIN = ONE_SEC * 60;
const ONE_HOUR = ONE_MIN * 60;
const ONE_DAY = ONE_HOUR * 24;

/**
 * @param {Date} d The date with time values set.
 * @returns {Date} The date at midnight in the current time zone.
 */
const justTheDate = d => new Date(
  Math.floor(d.valueOf()/ONE_DAY) * ONE_DAY + d.getTimezoneOffset() * ONE_MIN
);

// Regular expression
// ([0-9]{1,2})  -- Capture 1 or 2 digit hour, 0 to 99 (must validate)
// (?::([0-9]{2}))? -- Capture 2 digit minutes, non-capture group for colon, optional
// [^ap]* -- Skip forward to first A or P
// ([ap]m?)? -- Capture AM or PM, optional
// i - Case-insensitive
const matchTime = /([0-9]{1,2})(?::([0-9]{2}))?[^ap]*([ap][.m]*)?/i;
const matchAllTimes = /([0-9]{1,2})(?::([0-9]{2}))?\s*([ap][.m]*)?/gi;
const matchDuration = /^PT(\d+)H(?:(\d+)M)?$/;

/**
 * Convert strings to hour, minute.
 * @param {string} hour The hour, 12 or 24 hour clock
 * @param {string} min The minutes, optional
 * @param {string} pm Ante or Post Meridiem, optional
 * @returns {[number, number]} The time of day as [hour, minute]
 */
const convertTimeStrings = (hour, min, pm) => {
  let h = +(hour); // convert to number
  let m = +(min) || 0; // convert to number
  let post = !!pm && (pm[0] === 'P' || pm[0] == 'p');
  if (h >= 0 && h < 24) {
    // If PM found, add 12 hours.
    if (h < 12 && post) {
      h += 12; // Afternoon
    } else if (h === 12 && !post) {
      h = 0; // Midnight
    }
  } else {
    h = 0;  // Not a valid hour.
  }
  if (m >= 60) {
    h += Math.trunc(m / 60);
    m = m % 60;
  } else if (m < 0) {
    m = 0; // Cannot be negative.
  }
  return [h, m];
};

/**
 * Calculate the duration between two times.
 * @param {number} h1 The start hour
 * @param {number} m1 The start minute
 * @param {number} h2 The finish hour
 * @param {number} m2 The finish minute
 * @returns {[number, number]} The duration as [hour, minute]
 */
const calcDuration = (h1, m1, h2, m2) => {
  if (h1 > h2) h2 += 24;  // Hour is tomorrow.
  const d = (h2*60 + m2) - (h1*60 + m1);
  return [Math.trunc(d/60), d%60];
};

/**
 * Quick and dirty converter for two-part date and time.
 * @param {string} date The date part
 * @param {string} time The time part
 * @returns {string} A the date as ISO string.
 */
const dateTimeParse = (date, time) => {
  let d = new Date(date);

  if (isNaN(d)) {
    d = justTheDate(new Date());
  }

  // Parse time, looking for first match of HH:MM and (AM|PM).
  const m = time.match(matchTime);
  if (m) {
    const [hour, min] = convertTimeStrings(...m.slice(1,4));
    d.setHours(hour);
    d.setMinutes(min);
  }

  return d.toISOString();
};

/**
 * Quick and dirty interval parser.
 * @param {string} time A string containing a start and end time.
 * @returns {string} An ISO duration
 */
const durationParse = (time) => {
  const [start, end] = Array.from(time.matchAll(matchAllTimes));
  if (start && end) {
    // Copy AM/PM to start time from end time, if not specified
    if (!start[3] && end[3] && end[1] != '12') {
      start[3] = end[3];
    }
    const time1 = convertTimeStrings(...start.slice(1,4));
    const time2 = convertTimeStrings(...end.slice(1,4));
    const duration = calcDuration(...time1, ...time2);
    return toDuration(...duration);
  }

  return '';
};

/**
 * Get duration between start and end date.
 * @param {Date} d1 Start date/time
 * @param {Date} d2 End date/time
 * @returns {string} Duration as ISO string
 */
const getDurationFromDates = (d1, d2) => {
  var total = d2.valueOf() - d1.valueOf();
  return toDuration(Math.trunc(total/ONE_HOUR), (total%ONE_HOUR)/ONE_MIN);
};

/**
 * Get hour and minute value from duration string.
 * @param {string} duration The duration in PT0H0M format
 * @returns {[number, number]} The length as [hour, minute]
 */
const getDurationMsec = (duration) => {
  const m = duration.match(matchDuration);
  if (m) {
    const hour = +(m[1]);
    const min = +(m[2]) || 0;
    return hour * ONE_HOUR + min * ONE_MIN;
  }
  return 0;
};

const toDuration = (hour, minute) => minute > 0 ? `PT${hour}H${minute}M` : `PT${hour}H`;

const testStrings = [
  { date: undefined, time: '6:30 - 9 p.m.' },
  { date: undefined, time: '6:30pm - 12am' },
  { date: undefined, time: '6:30am - 12pm' },

  { date: 'August 9, 2023', time: '6pm to 9pm'},
  { date: '', time: '5 thru 6 PM'},
  { date: null, time: '18:30-21:00' },
  { date: null, time: '06:30' },

  { date:'1990/12/25', time: '' },
  { date: 'Tue, July 18, 2023', time: ''},
];

testStrings.forEach(f => console.log(f, dateTimeParse(...Object.values(f)), durationParse(f.time)));

module.exports = { dateTimeParse, durationParse, getDurationMsec, getDurationFromDates };
