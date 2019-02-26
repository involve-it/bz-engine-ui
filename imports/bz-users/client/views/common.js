/**
 * Created by Ashot on 9/26/15.
 */
Template.avatarThumbnail.helpers({
  getAvatarImage: function (e, v) {
    var ret = this.image && this.image.data;
    if (ret) {

    } else {
      ret = '/img/content/avatars/avatar-no.png';
      /*var user = Meteor.users.findOne(Meteor.userId()),
       ret = '/img/content/avatars/avatar-no.png';
       if(user && user.profile && user.profile.image) {
       ret = user.profile.image;
       }*/
    }
    return ret;
  },
  canWrite: function () {
    return this.write;
  },
  getImagesArrayReactive: function(){
    return {
      imagesArr: avatarThumbnailReactive
    };
  }
});
Template.avatarThumbnail.events({
  'click .js-edit-image-icon': function () {
    $('.js-avatar-upload-modal').foundation('reveal', 'open');
  }
  /*'click .js-image-upload-modal': function (event, template) {
   },*/
});

Template.bzUserProfileBasic.rendered = function () {
  /*init Rate*/
  $('.bz-rating').raty({
    starType: 'i'
  });
};

Template.bzUserProfileBasic.onCreated(function() {
  var userId = this.data._id, ins = Template.instance(), innerObj = {}, usegObj = {};
  /*console.info(Router.current().params._id);
   console.info(this._id);*/
    Meteor.call('getUser', userId, function(e, r){
      if(e) {
        //error
      } else {
        innerObj = r.result;

        _.each(innerObj, function(value, key, list) {

          if(key === 'image') {
            usegObj['image'] = list.image
          }

        });
        usegObj['username'] = innerObj.username;
        ins.someUserData.set(usegObj);
      }
    });
  this.someUserData = new ReactiveVar({});
});

Template.bzUserProfileBasic.helpers({
  getUser: function() {
    return Template.instance().someUserData.get();
  }
  
  /*,
  belongsToCurrentUser: function (e, v) {
    return this._id === Meteor.userId();
  },
  getCurrentPostId: function(){
    var post = bz.bus.posts.getCurrentPost();
    return post && post._id;
  }*/
  
});

Template.bzUserProfileBasic.events({
  'click .js-send-message-btn': function (e, v) {
    if(Meteor.userId()) {
      if (Meteor.userId() !== this._id) {
        var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this._id).then(function (chatId) {
          Router.go('/chat/' + chatId);
        });
      }
    } else {
      bz.ui.error('Please <a href="/sign-in">login</a>');
    }
  }
})
Template.bzUserProfileBasic.onRendered(function () {
  if (this.data && Meteor.userId() === this.data._id) {
    $('.js-send-message-btn').addClass('disabled');
  }
});

