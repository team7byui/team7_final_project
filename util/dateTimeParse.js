/** Author: John Sudds */
/** License: MIT */

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
  const m = time.trim().replace(/\./g,'').match(/([0-9]{1,2})(?::([0-9]{2}))?[^ap]*([ap]m?)?/i);
  if (m) {
    let hour = +(m[1]); // convert to number
    if (hour < 24) {
      // If PM found, add 12 hours.
      if (hour < 12 && m[3]?.toLowerCase()[0] == 'p') {
        hour += 12;
      }
      d.setHours(hour);
    }
    let min = +(m[2]); // convert to number
    if (min < 60) {
      d.setMinutes(min);
    }
  }

  return d.toISOString();
};

// const testStrings = [
//   { date: undefined, time: '6:30 - 9 p.m.' },

//   { date: 'August 9, 2023', time: '6pm to 9pm'},
//   { date: '', time: '5 PM'},
//   { date: null, time: '18:30' },
//   { date: null, time: '06:30' },

//   { date:'1990/12/25', time: '' },
//   { date: 'Tue, July 18, 2023', time: ''},
// ];

// testStrings.forEach(f => console.log(f, dateTimeParse(...Object.values(f))));

module.exports = dateTimeParse;
