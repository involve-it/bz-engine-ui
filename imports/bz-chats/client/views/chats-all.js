/**
 * Created by douson on 24.08.15.
 */

Template.bzChatsMy.onCreated(function () {
  this.getChatsData = new ReactiveVar(false);
  //return Meteor.subscribe('posts-images');
});

Template.bzChatsMy.helpers({
  getData: function() {
    return Template.instance().getChatsData.get();
  },
  getChats: function () {
    var ins = Template.instance(), request = {};
    
    Meteor.call('getChats', request, function(e, r) {

      var res;
      res = (!e) ? r : e;

      if (res.error && res.message) {
        bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
        return;
      }

      if (res.success && res.result) {
        (res.result.length > 0) ? ins.getChatsData.set(res.result) : ins.getChatsData.set([]);
        //console.info('Данные из метода getChat[s]: ', ins.getChatsData.get());
      } else {
        bz.ui.alert('Error ID: ' + res.error.errorId, {type:'error', timeout: 2000});
      }
      
    });
    
    
    /* OLD CODE */
    /*var ret = getUniqueChatsForUser(Meteor.userId());
    return ret;*/
    
    /* OLD CODE */
    /*var lastChat = _.uniq(bz.cols.chats.find({userId: Meteor.userId()}, {
      sort: {myField: 1}, fields: {myField: true}
    }).fetch().map(function(x) {
      return x.myField;
    }), true);*/
    //var lastChat = chats.sort
    //db.user.find( {"id" : {$in : user.friends }})
    //return chats;
  }
});

Template.bzChatItem.onRendered(function(){});

Template.bzChatItem.helpers({
  getUserName: function(){
    /*var user = Meteor.users.findOne({
      _id: this.toString()
    });*/
    //var user = Meteor.users.findOne(Meteor.userId());
    var user = this;
    return user.username;
  },
  getUsers: function(){
    return Meteor.users.find({
      _id: {$in: _.without(this.users, Meteor.userId())}
    });
  }
  
});


Template.bzChatsToolbar.helpers({
  getSummaryUsers: function() {
    var ret = bz.cols.chats.find({
      users: {$in: [Meteor.userId()]}, activated: true}
    ).fetch().length;
    
    return ret || 0;
  }
});


Template.onePostRowItem.helpers({
  getPhotoUrl: function () {
    var photo = bz.cols.posts.findOne({_id: this._id}),
      photoId = photo.details.photos && photo.details.photos[0] || undefined;

    if (photoId) {
      var image = bz.cols.images.findOne({_id: photoId});
    }

    return image;

  },
  getPrice: function () {
  }
});
// reply area
Template.replyArea.events({
  'click ': function(e, tmpl) {
    e.preventDefault();

    var textArea = tmpl.$('...');
    var val = textArea.val();

    textArea.attr('disable', 'disable');

    /* ... */
  },
  'keypress textarea': function(e, tmpl) {
    if(e.keyCode === 13) {
      e.preventDefault();
      tmpl.$('...').submit();
    }
  }
});


Template.chatMessage.onCreated(function() {
  this.datas = new ReactiveVar(false);
});

Template.chatMessage.onRendered(function(){
  if (this.data.toUserId === Meteor.userId()) {
    bz.cols.messages.update(this.data._id, {$set: {seen: true}});
  }
});

Template.chatMessage.helpers({
  getMessageClass: function () {
    var className = '';
    if (this.userId === currentUser._id) {
      // my message
      className = 'my-message';
    } else {
      className = 'friends-message';
    }
    return className;
  },
  isOwnMessage: function () {},
  getAvatarUrl: function(){
     if (this.userId === currentUser._id) {
       //my message
       return currentUser.profile && currentUser.profile.image && currentUser.profile.image.data || "/img/content/avatars/avatar-no.png";
     } else {
       var toUserAvatar = Session.get('userOtherParty');
       return toUserAvatar && toUserAvatar.image.imageUrl;
       
       /* OLD CODE */
       /*var avatar=Meteor.users.findOne(this.userId).profile.image.data || "/img/content/avatars/avatar-no.png";
       return avatar;*/
     }
   }
});

/* OLD CODE */
/*Template.chatMessage.onDestroyed(function() {
  delete Session.keys['userOtherParty'];
});*/
