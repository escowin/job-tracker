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
    // converts kebab case to camel case
    camel: (string) => {
      if (!string) {
        return "";
      }
      // uses regex to capitalize letters preceded by hyphens, then removes the hyphen
      const formattedString = string
        .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
        .replace(/-/g, "");
      console.log(formattedString);
      return formattedString;
    },
  },
};
