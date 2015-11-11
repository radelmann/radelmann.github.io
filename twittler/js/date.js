Date.prototype.getTimeDiff = function() {
  //returns how long ago the input occured in a user friendly format
  var now = new Date().getTime();
  var ms = (now - this.getTime());
  var days = Math.round(ms / 86400000); // days
  var hrs = Math.round((ms % 86400000) / 3600000); // hours
  var mins = Math.round(((ms % 86400000) % 3600000) / 60000); // minutes

  if (days > 0) {
    return days + ' days ago'
  } else if (hrs > 0) {
    return hours + ' hours ago'
  } else if (mins > 0) {
    return mins + ' mins ago'
  } else {
    return 'just now'
  }
}


Date.prototype.formatLongDate = function() {
  //returns user friendly long date string, eg: Monday, Oct 26, 2015, 3:11 PM
  var options = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  };

  return this.toLocaleTimeString("en-us", options);
}
