/**
 * Created by douson on 09.07.15.
 */

Template.userSettings.onCreated(function () {
  var userId = this.data._id, ins = Template.instance(), innerObj = {}, profileObj = {}, that = this;
  Meteor.call('getUser', userId, function (e, r) {
    if (e) {
    } else if (r && r.result){
      innerObj = r.result;
      _.each(innerObj.profileDetails, function (item) {
        profileObj[item.key] = {
          value: item.value,
          policy: item.policy
        }
      });
      Object.assign(innerObj, profileObj);
      that.data = innerObj;
      ins.userData.set(innerObj);
    }
  });
  ins.userData = new ReactiveVar({});
});

Template.userSettings.onRendered(function () {
  if(Meteor.userId() === this.data._id) {
    $('.js-send-message-btn').addClass('disabled');
  }
});

Template.userSettings.helpers({
  /* NEW CODE */
  getUser: function() {
    return Template.instance().userData.get();
  },
  getIdProfile: function () {
    //console.log('ID профайла пользователя ' + this._id);
    return Meteor.absoluteUrl() + 'user/' + this._id;
  },
  getPostsCount: function(){
    return bz.cols.posts.find({userId: this._id}).count();
  },
  getReviewsCount: function(){
    return bz.cols.reviews.find({userId: this._id}).count();
  },

  /* OLD CODE */
  /* TODO: old code
  userName: function () {
   return this.username;
   },
  getFIO: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'firstName'});
    var details1 = bz.cols.profileDetails.findOne({userId: this._id, key:'lastName'});
    var fio;
    if (details.value){
      fio=details.value;
    }
    if(details1.value){
      fio=fio+' '+details1.value;
    }
    return fio;
  },
  getCity: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'city'});
    return details && details.value;
  },
  getPhoneStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'phone'});
    if (!details)
    {
      return '0'
    }
     else
    {
      return details && details.policy;
    }
  },
  getSkypeStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'skype'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getVKStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'vk'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getTwitterStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'twitter'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getFaceBookStatus: function () {
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'facebook'});
    if (!details)
    {
      return '0'
    }
    else
    {
      return details && details.policy;
    }
  },
  getPhoneNumber: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'phone'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getSkype: function(){
    var details =  bz.cols.profileDetails.findOne({userId: this._id, key:'skype'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getVK: function(){
    var details = bz.cols.profileDetails.findOne({userId: this._id, key:'vk'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getFacebook: function(){
    var details =  bz.cols.profileDetails.findOne({userId: this._id, key:'facebook'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },
  getTwitter: function(){
    var details =  bz.cols.profileDetails.findOne({userId: this._id, key:'twitter'});
    if (!details)
    {
      return 'Hidden'
    }
    else
    {
      return details && details.value;
    }
  },*/
  
  
  getCheckboxUserProfile: function(checked) {
    checked = (this.profile && this.profile.checkOwnPosts)? 'checked' : '';
    return checked;
  }
});


Template.bzUserOwnPosts.helpers({
  getPopularItems: function() {
    var id = Router.current().params._id;
    return id && bz.cols.posts.find({userId: Router.current().params._id, 'status.visible':'visible'}).fetch();
  }
});

Template.bzUserOwnPostsItem.helpers({
  getImgSrc: function () {
    var ret, phId = this.details.photos && this.details.photos[0];
    if (phId) {
      ret = bz.cols.images.findOne(phId);
      ret = ret && ret.data;
    }
    return ret;
  }
});


Template.userSettings.events({
  'click [data-action=share-profile]': function (event, template) {
  },
  'click [data-action=edit-avatar]': function (event, template) {
    /*IonActionSheet.show({
          titleText: 'Edit picture',
          buttons: [
            {text: 'Photo Library'},
            {text: 'Take Photo'}
          ],
          cancelText: 'Cancel'
        }
    )*/
  },
  'click .js-send-message-btn': function(e,v){
    /*var qs = {
      toUser: this._id
    }*/
    if(Meteor.userId() !== this._id) {
      var chatId = bz.bus.chats.createChatIfFirstMessage(Meteor.userId(), this._id).then(function(chatId) {
          Router.go('/chat/' + chatId);
      });
    }
  }
});

