/**
 * Created by douson on 09.07.15.
 */
Template.profileSettings.onCreated(function() {
  var userId = Meteor.userId(), inst = Template.instance(), innerObj = {}, profileObj = {};

  Meteor.call('getUser', userId, function(e, r){
    if(e) {
    } else {
      innerObj = r.result;
      _.each(innerObj.profileDetails, function(item) {
        profileObj[item.key] = {
          value:  item.value,
          policy: item.policy
        };
      });
      Object.assign(innerObj, profileObj);
      inst.someUserData.set(innerObj);
    }
  });
  inst.someUserData = new ReactiveVar({});
});

Template.profileSettings.onRendered(function() {
  var self = this, check = self.$('#user-public-publications-police').prop('checked');
  bz.cols.profileDetails.findOne({userId: Meteor.userId()})
});


Template.profileSettings.helpers({
  isCheckOwnPosts: function() {
    if(this._id) {
      var ret = (this.profile.checkOwnPosts)? 'checked' : '';
    }
    return ret;
  },
  setLanguage: function() {
    
    var curLang = Meteor.users.findOne({_id: Meteor.userId()});
    
    return [
      {code: 'en', name: 'English'},
      {code: 'ru', name: 'Русский'}  
    ]
    
  },
  /* NEW CODE */
  getUser: function() {
    return Template.instance().someUserData.get();
  },
  getUserCity: function() {
    var data = Template.instance().someUserData.get();
    var city = data && data.profile && data.profile.city;

    return city;
  },
  /* OLD CODE */
  getPostsCount: function(){
    return bz.cols.posts.find({userId: Meteor.userId()}).count();
  },
  getReviewsCount: function(){
    return bz.cols.reviews.find({userId: Meteor.userId()}).count();
  },
  
  /*getFirstName: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'firstName'});
    return details && details.value;
  },
  getLastName: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'lastName'});
    return details && details.value;
  },
  getCity: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'city'});
    return details && details.value;
  },
  getPhoneNumber: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'phone'});
    return details && details.value;
  },
  getPhoneNumberStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'phone'});
    return details && details.policy;
  },
  getSkype: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'skype'});
    return details && details.value;
  },
  getSkypeStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'skype'});
    return details && details.policy;
  },
  getVKUrl: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'vk'});
    return details && details.value;
  },
  getVKUrlStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'vk'});
    return details && details.policy;
  },
  getFacebookUrl: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'facebook'});
    return details && details.value;
  },
  getFacebookUrlStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'facebook'});
    return details && details.policy;
  },
  getTwitterUrl: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'twitter'});
    return details && details.value;
  },
  getTwitterUrlStatus: function(){
    var details = bz.cols.profileDetails.findOne({userId: Meteor.userId(), key:'twitter'});
    return details && details.policy;
  },*/
  
  getUserProfileLink: function() {
    // protocol / user/ user_id
    var urlBase = '/';
    //var urlBase = Meteor.absoluteUrl();
    return urlBase && urlBase + 'user/' + this._id;
  },
    getAdminsCode: function() {
      var code;
      if (this.profile && this.profile.type === 'hero') { // only admin or trainer can invite trainers
        code = this.profile.myInvitationCodes && this.profile.myInvitationCodes.adminsCode;
      }
      return code;
    },
    getTrainersCode: function() {
      var code;
      if (this.profile && this.profile.type === 'hero' || this.profile && this.profile.type === 'admin' || this.profile && this.profile.type === 'trainer') { // only admin or trainer can invite trainers
        code = this.profile.myInvitationCodes && this.profile.myInvitationCodes.trainersCode;
      }
      return code;
    },
    getUsersCode: function() {
        var code;
        if (this.profile && this.profile.type === 'hero' || this.profile && this.profile.type === 'admin' || this.profile && this.profile.type === 'trainer') {// only admin or trainer can invite users
            code = this.profile.myInvitationCodes && this.profile.myInvitationCodes.usersCode;
        }
        return code;
    },
    getTrainersCodeLink: function() {
        var code;
        if (this.profile && this.profile.type === 'hero' || this.profile && this.profile.type === 'admin' || this.profile && this.profile.type === 'trainer') { // only admin or trainer can invite trainers
            code = this.profile.myInvitationCodes && this.profile.myInvitationCodes.trainersCode;
        }
        return code;
    },
    getUsersCodeLink: function() {
        var code;
        if (this.profile && this.profile.type === 'hero' || this.profile && this.profile.type === 'admin' || this.profile && this.profile.type === 'trainer') {// only admin or trainer can invite users
            code = this.profile.myInvitationCodes && this.profile.myInvitationCodes.usersCode;
        }
        return code;
    }

});

function getCode(user) {

}


Template.profileSettings.events({
  'mouseup .js-bz-profile-user-link-select': function(e, v) {
    var $target = v.$(e.target); 
    $target.select();
  },
  'click div.btn-edit-account a.js-edit-btn':function(event,v){

    v.$('div.edit-fields-user input.user-settings').removeClass('disabled');
    v.$('div.edit-fields-user select').parent().removeClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-done-btn').removeClass('disabled');
    v.$('div.btn-edit-account a.js-cancel-btn').removeClass('disabled');

  },
  'click div.btn-edit-account a.js-done-btn':function(event, v){

    v.$('div.edit-fields-user input.user-settings').addClass('disabled');
    v.$('div.edit-fields-user select').parent().addClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-edit-btn').removeClass('disabled');
    v.$('div.btn-edit-account a.js-cancel-btn').addClass('disabled');
    
    var attributes = [{
      key: 'firstName',
      value: v.$('input.bz-profile-first-name').val(),
      policy: '1'
    },
      {
        key: 'lastName',
        value: v.$('input.bz-profile-last-name').val(),
        policy: '1'
      },
      {
        key: 'city',
        value: v.$('input.bz-profile-city').val(),
        policy: '1'
      },
      {
        key: 'phone',
        value: v.$('input.bz-profile-phone-number').val(),
        policy: v.$('select.js-profile-phone-status').val()
      },
      {
        key: 'skype',
        value: v.$('input.bz-profile-skype').val(),
        policy:  v.$('select.js-profile-skype-status').val()
      },
      {
        key: 'vk',
        value: v.$('input.bz-profile-vk-url').val(),
        policy: v.$('select.js-profile-vk-status').val()
      },
      {
        key: 'twitter',
        value: v.$('input.bz-profile-twitter-url').val(),
        policy:  v.$('select.js-profile-twitter-status').val()
      },
      {
        key: 'facebook',
        value: v.$('input.bz-profile-facebook-url').val(),
        policy:  v.$('select.js-profile-facebook-status').val()
      }
    ];
    
    Meteor.call('editUser', {profileDetails: attributes}, function(e, r) {
      if (e){
        // Error
      } else {
        bz.ui.alert('Профиль сохранен', {type:'success', timeout: 2000});
      }
    });
    
    /* OLD CODE */
   /*Meteor.call('updateProfileDetails', this._id, attributes, function(err){
     if (err){

     }
     else
     {

     }
   });*/
    
  },
  'submit form': function (event){
    event.preventDefault();
  },
  'click div.btn-edit-account a.js-cancel-btn':function(event, v){
    var userId = Meteor.userId(),
        innerObj = {},
        usegObj = {};

    Meteor.call('getUser', userId, function(e, r){

      var res;
      res = (!e) ? r : e;

      if (res.error) {
        bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
        return;
      }

      if(res.success && res.result) {
        innerObj = res.result;

        _.each(innerObj.profileDetails, function(item) {
          usegObj[item.key] = {
            value:  item.value,
            policy: item.policy
          };
        });

        //First name
        v.$('input.bz-profile-first-name').val(usegObj.firstName.value);
        
        //Last name
        v.$('input.bz-profile-last-name').val(usegObj.lastName.value);
        
        //City
        v.$('input.bz-profile-city').val(usegObj.city.value);

        //Phone number
        v.$('input.bz-profile-phone-number').val(usegObj.phone.value);
        
        //Skype
        v.$('input.bz-profile-skype').val(usegObj.skype.value);

        //VK
        v.$('input.bz-profile-vk-url').val(usegObj.vk.value);

        //Twitter
        v.$('input.bz-profile-twitter-url').val(usegObj.twitter.value);

        //Facebook
        v.$('input.bz-profile-facebook-url').val(usegObj.facebook.value);

        //Policy phone
        v.$('select.js-profile-phone-status').val(usegObj.phone.policy);

        //Policy skype
        v.$('select.js-profile-skype-status').val(usegObj.skype.policy);

        //Policy vk
        v.$('select.js-profile-vk-status').val(usegObj.vk.policy);

        //Policy twitter
        v.$('select.js-profile-twitter-status').val(usegObj.twitter.policy);

        //Policy facebook
        v.$('select.js-profile-facebook-status').val(usegObj.facebook.policy);
        
        //console.info(v.$('input.bz-profile-last-name').val());
        //console.info(usegObj);
      }
      
    });
    
    v.$('div.edit-fields-user input.user-settings').addClass('disabled');
    v.$('div.edit-fields-user select').parent().addClass('disabled');
    v.$(event.currentTarget).addClass('disabled');
    v.$('div.btn-edit-account a.js-done-btn').addClass('disabled');
    v.$('div.btn-edit-account a.js-edit-btn').removeClass('disabled');
    
  },
  'click div.btn-edit-account a.js-logout-btn':function(event, v){
    Meteor.logout();
  },
  'click #user-public-publications-police': function(e, v) {
    var checkbox = v.$(e.target), toggle;
    toggle = checkbox.prop('checked');
    Meteor.call('updateCheckOwnPosts', toggle, function(error, result) {});
  }
});