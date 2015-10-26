$(document).ready(function() {
  $(document).tooltip({
    track: true
  });
  
  var initPage = function() {
    //load initial tweets
    var index = streams.home.length - 1;
    while (index >= 0) {
      var tweet = streams.home[index];
      insertTweet(tweet);
      index -= 1;
    }

    $('.users').append('<a class="user all">@all</a><br>');

    //populate users
    users.forEach(function(user) {
      $('.users').append('<a class="user">@' + user + '</a><br>');
    });

    addTweetFilterHandler();
  }

  var addEventHandlers = function() {
    $('#btnSubmit').on('click', function() {
      if ($('#btnSubmit').text() === 'Tweet ?') {
        $('#tweetInput').val('');
        $('#tweetInput').show(500);
        $('#btnSubmit').text('Tweet !');
      } else {
        visitor = 'guest';
        writeTweet($('#tweetInput').val());
        $('#tweetInput').hide(100);
        $('#btnSubmit').text('Tweet ?');
      }
    });

    $('#btnLoad').on('click', function() {
      $('.tweet').show();
      $('#btnLoad').slideUp();
      var count = streams.home.length;
      var index = $('.tweets > div').length;
      while (index < count) {
        var tweet = streams.home[index];
        insertTweet(tweet);
        index += 1;
      }
      updateTimeDiff();
      addTweetFilterHandler();
      document.title = 'Twitter';
    });
  }

  var addTweetFilterHandler = function() {
    $('.user').on('click', function() {
      filterTweets(this.innerHTML);
    });

    $('.hashtag').on('click', function() {
      filterTweets(this.innerHTML);
    });
  }

  var insertTweet = function(tweet) {
    tweet['timeDiff'] = getTimeDiff(tweet.created_at);
    tweet['longDate'] = formatLongDate(tweet.created_at);
    tweet.cssClass = 'tweet hidden ' + tweet.user;
    parseHashtag(tweet);

    var $tweet = $('<div class="' + tweet.cssClass + '"></div>');
    var tweetTpl = '<a class="user">@{user}</a><br>{message}<br><p title="{longDate}" class="time" data-createdAt="{created_at}">{timeDiff}</p>';
    $tweet.append(nano(tweetTpl, tweet));
    $tweet.prependTo($('.tweets'));
    $tweet.slideDown();
  }

  var parseHashtag = function(tweet) {
    if (tweet.message.split('').indexOf('#') !== -1) {
      var message = tweet.message.split('');
      var hashtag = message.splice(message.indexOf('#'));
      tweet.message = message.join('') + '<a class="hashtag">' + hashtag.join('') + '</a>';
      tweet.cssClass += ' ' + hashtag.splice(1).join('');
    }
  }

  var filterTweets = function(filter) {
    if (filter === '@all') {
      $('.tweet').show(); //show all
      updatePageTitle(filter);
    } else {
      $('.tweet').hide(); //hide all
      $('.' + filter.split('').slice(1).join('')).show();
      updatePageTitle(filter);
    }
  }

  var updateButtonText = function() {
    var newCount = getNewTweetCount();
    if (newCount > 0) {
      $('.button').slideDown();
      $('.button').html('(' + newCount + ') Load Tweets');
      updatePageTitle();
    }
  }

  var getNewTweetCount = function() {
    return streams.home.length - $('.tweets > div').length;
  }

  var resetPageTitle = function() {
    document.title = 'Twitter';
  }

  var updatePageTitle = function(filter) {
    //prepend new tweets
    var title = '';

    var newTweets = getNewTweetCount();
    if (newTweets > 0) title += '(' + newTweets + ') ';

    title += 'Twittler';

    //append user if needed
    if (filter) {
      title += ' | ' + filter;
    } else if (document.title.indexOf('|') !== -1) {
      title += ' | ' + document.title.split('|')[1];
    }

    document.title = title;
  }

  var updateTimeDiff = function() {
    //loop through tweets update time diff
    $('.tweets').children('div').each(function(index) {
      var created_at = $(this).find('.time').attr('data-createdAt');
      var diff = getTimeDiff(new Date(created_at));
      $(this).find('.time').html(diff);
    });
  }

  //basic template engine
  //https://github.com/trix/nano
  var nano = function(template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
      var keys = key.split("."),
        v = data[keys.shift()];
      for (i = 0, l = keys.length; i < l; i++) v = v[this];
      return (typeof v !== "undefined" && v !== null) ? v : "";
    });
  };

  var getTimeDiff = function(date) {
    //input: js date object
    //output: returns how long ago the input occured in a user friendly format
    var now = new Date().getTime();
    var ms = (now - date.getTime()); 
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

  var formatLongDate = function(date) {
    //input: js date object
    //output: user friendly long date string, eg: Monday, Oct 26, 2015, 3:11 PM
    var options = {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    };

    return date.toLocaleTimeString("en-us", options);
  }
  
  initPage();
  addEventHandlers();
  var interval = setInterval(updateButtonText, 3000);
});
