module.exports = {
  calculateTime: (date, days) => {
    // calculates time between date & now
    const currentDate = new Date();
    const targetDate = new Date(date);
    const elapsedMilliseconds = currentDate - targetDate;
    const elapsedDays = Math.floor(elapsedMilliseconds / (1000 * 60 * 60 * 24));

    // returns boolean value
    return elapsedDays >= days;
  },
};
