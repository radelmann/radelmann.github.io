var Tweet = function(user, message) {
  this.user = user;
  this.message = message;
  this.created_at = new Date();
  this.time_diff = this.created_at.getTimeDiff();
  this.long_date = this.created_at.formatLongDate();
  this.css_class = 'tweet hidden ' + this.user;

  //template
  this.tpl = '<a class="user">@{user}</a><br>';
  this.tpl += '{message}<br>';
  this.tpl += '<p title="{long_date}" class="time" data_created_at="{created_at}">{time_diff}</p>';

  this.parseHashtag();
}

Tweet.prototype.render = function() {
  //basic template engine
  //https://github.com/trix/nano
  var data = this; //need to use call or apply here
  return this.tpl.replace(/\{([\w\.]*)\}/g, function(str, key) {
      var keys = key.split("."),
        v = data[keys.shift()];
      for (i = 0, l = keys.length; i < l; i++) v = v[this];
      return (typeof v !== "undefined" && v !== null) ? v : "";
    });
}

Tweet.prototype.parseHashtag = function() {
  if (this.message.split('').indexOf('#') !== -1) {
    var message = this.message.split('');
    var hashtag = message.splice(message.indexOf('#'));
    this.message = message.join('') + '<a class="hashtag">' + hashtag.join('') + '</a>';
    this.css_class += ' ' + hashtag.splice(1).join('');
  }
}
