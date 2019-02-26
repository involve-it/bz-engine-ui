/**
 * Created by root on 9/15/15.
 */
function getLatLngBox(lat, lng, radius) {
  if (lat && lng && radius) {
    var dLat = (radius / bz.const.locations.earthRadius) / Math.PI * 180,
      dLng = (radius / bz.const.locations.earthRadius / Math.cos(lat * Math.PI / 180)) / Math.PI * 180;
    return {
      lng1: lng - dLng,
      lng2: lng + dLng,
      lat1: lat - dLat,
      lat2: lat + dLat
    };
  } else {
    return null;
  }
};

Template.aroundYouSmall.helpers({
  getAroundItems: function () {
    var ret;
    bz.cols.posts.find({});
    ret = bz.bus.search.searchePostsAroundAndPopular().aroundYouSmall;
    ret = _(ret)
      .chain()
      .sortBy(function (doc) {
        return doc._getDistanceToCurrentLocationNumber();
      })
      .value();

    setTimeout(function () {
      bz.ui.initSwiper();
    }, 100);

    return ret;
  }
});

Template.bzAroundYouSmallItem.onCreated(function () {
  Meteor.subscribe('bz.users.all');
});

Template.aroundYouSmall.onCreated(function () {
});

Template.aroundYouSmall.onRendered(function () {
  bz.ui.initSwiper();
});


Template.bzAroundYouSmallItem.rendered = function () {

  /*var lineH = $('.bz-content .post-item-text').css('line-height');
  if (Number.parseInt(lineH) !== 'NaN'){
    lineH = Number.parseInt(lineH);
  } else {
    lineH = 20;
  }
  $('.bz-content .post-item-text').css('max-height', lineH * 2);*/
};

Template.bzAroundYouSmallItem.helpers({
  getPostOwner: function () {
    return Meteor.users.findOne(this.userId);
  },
  getRank: function () {
  },
  getProgressBar: function () {

  },
  getTimeStamp: function () {
    return Date.now();
  },
  getImgSrc: function () {
    var ret,
      phId = this.details.photos && this.details.photos[0];
    if (phId) {
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret._getThumbnailUrl();
    }
    ret = ret || '/img/content/no-photo-400x300.png';
    return ret;
  },
  disableOwnPost: function () {
    if (Meteor.userId() === this.userId) {
      return 'disabled';
    }
    return '';
  }
});
Template.bzAroundYouSmallItem.events({
  'click .js-send-message-btn': function (e, v) {
    if (!Meteor.userId()) {
      Router.go('/sign-in');
    }
    if (Meteor.userId() !== this.userId && this.userId) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this.userId)
        .then(function (chatId) {
          Router.go('/chat/' + chatId);
        });
    }
  }
});
