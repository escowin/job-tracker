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
  format: {
    camel: (string) => {
      if (!string) {
        return "";
      }
      // splits string by space
      const words = string.split(" ");
      // capitlizes first char of second word onwards, then joins words
      const formattedString = words
        .map((word, i) =>
          i === 0
            ? word.toLowerCase()
            : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join("");

      return formattedString;
    },
  },
};
