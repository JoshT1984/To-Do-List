exports.newDate = function () {
  let today = new Date();
  let options = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return today.toLocaleString("en-US",options);
};
