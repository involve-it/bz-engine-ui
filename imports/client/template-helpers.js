Template.registerHelper('t9n', function (resName) {
  return resName;
});
Template.registerHelper('getFormattedTs', function (ts) {
  var date = new Date(ts);
  var options = {
    // era: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    //timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };
  return date.toLocaleDateString(Session.get('bz.user.language'), options);
  //return '';
});
