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
    $('#btn-submit').on('click', function() {
      if ($('#btn-submit').text() === 'Tweet ?') {
        $('#tweet-input').val('');
        $('#tweet-input').show(500);
        $('#btn-submit').text('Tweet !');
      } else {
        visitor = 'guest';
        writeTweet($('#tweet-input').val());
        $('#tweet-input').hide(100);
        $('#btn-submit').text('Tweet ?');
      }
    });

    $('#btn-load').on('click', function() {
      $('.tweet').show();
      $('#btn-load').slideUp();
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
    // tweet.time_diff = tweet.created_at.getTimeDiff();
    // tweet.long_date = tweet.created_at.formatLongDate();
    // tweet.css_class = 'tweet hidden ' + tweet.user;
    // parseHashtag(tweet);

    var $tweet = $('<div class="' + tweet.css_class + '"></div>');
    
    // var tweetTpl = '<a class="user">@{user}</a><br>{message}<br><p title="{long_date}" class="time" data_created_at="{created_at}">{time_diff}</p>';

    $tweet.append(tweet.render());
    $tweet.prependTo($('.tweets'));
    $tweet.slideDown();
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
      var created_at = $(this).find('.time').attr('data_created_at');
      var diff = (new Date(created_at)).getTimeDiff();
      $(this).find('.time').html(diff);
    });
  }

  initPage();
  addEventHandlers();
  var interval = setInterval(updateButtonText, 3000);
});
