/**
 * Created by Ashot on 9/26/15.
 */

//LocalCommentsCollections = new Mongo.Collection(null);

Template.bzControlReviews.onCreated(function () {
  var instance = this;
  instance.getCommentsData = new ReactiveVar(false);

  /*instance.subscribe('comments', Router.current().params._id, function() {
    //console.info('Data of comments is ready.', this);
    console.info('Data of comments: ', bz.cols.reviews.find({}).fetch());
  });*/

  instance.subscribe('comments', Router.current().params._id);

});

Template.bzControlReviews.onRendered(function () {
  var self = this;
});

Template.bzControlReviews.helpers({
  subCom: function () {
    var arrayCommentsSubscribe = bz.cols.reviews.find({})
      .fetch();

    /*if(arrayCommentsSubscribe.length) {
      _.map(arrayCommentsSubscribe, function(item) {
        var userId = item.userId;
        
        
        
        Meteor.call('getUser', userId, function(e, r){
          var res, user;
          res = (!e) ? r : e;
          if (res.error) {
            bz.ui.alert('Error ID: ' + res.error, {type: 'error', timeout: 2000});
            return;
          }
          if (res.success && res.result) {
            user = {
              _id: res.result._id,
              image: res.result.image,
              username: res.result.username
            };
            item.user = user;
          }
        });
        
        
        
      });
      
    }*/

    //console.info("DATA BEFORE RETURN", arrayCommentsSubscribe);
    return arrayCommentsSubscribe.reverse();
  },
  getComments: function () {
    var request = {},
      ins = Template.instance();
    request.postId = this.postId;

    if (request && this.postId) {
      if (ins.getCommentsData.get() === false) {
        Meteor.call('getComments', request, function (e, r) {
          //console.info(r);
          //LocalCommentsCollections.insert(r.result);

          if (e) {
            //error
          } else if (r.success && r.result) {
            ins.getCommentsData.set(r.result);
          } else {
            bz.ui.alert('Error ID: ' + r.error.errorId, {
              type: 'error',
              timeout: 2000
            });
          }
        });
      }
    }
    return ins.getCommentsData.get();
  }

  /* OLD CODE */
  /*getReviews: function(){
    return bz.cols.reviews.find({type: 'postType', entityId: this.postId}, { sort: { dateTime: 1}});
  },
  getCountsReviews: function() {
    var counts = bz.cols.reviews.find({type: 'postType', entityId: this.postId}).count();
    return counts || '';
  }*/
});

Template.bzControlReviewItem.events({
  'click .js-delete-comment': function (e, v) {

    var request = this._id,
      event = e;

    Meteor.call('deleteComment', request, function (e, r) {


      var res,
        target,
        item;
      res = (!e) ? r : e;

      if (res.error && res.errorType) {
        bz.ui.alert('Error ID: ' + res.error, {
          type: 'error',
          timeout: 2000
        });
        return;
      }

      if (res.success) {
        target = event.currentTarget;
        if (target) {
          item = target.closest('.bz-post-content');
          item.remove();
        }
      } else {
        bz.ui.alert('Error ID: ' + res.error.errorId, {
          type: 'error',
          timeout: 2000
        });
      }


    });

    /* OLD CODE */
    /*if(Meteor.userId() === v.data.userId){
      bz.cols.reviews.remove(v.data._id);
    }*/
  }
});

Template.bzControlReviewItem.helpers({
  getTime: function () {
    var date = new Date(this.dateTime);
    return date && date.toLocaleString();
  },
  isUserCommentOwner: function (e, v) {
    return Meteor.userId() === this.user._id;
  }
  /* OLD CODE */
  /*
  getProfileImage: function(){
    var user = Meteor.users.findOne(this.userId);
    return user && user._getAvatarImage();
  }*/
});

Template.bzControlAddReview.onCreated(function () {
  //this.data.postId = this.data.toString();
  var instance = this;
  instance.buttonStateDisabled = new ReactiveVar(true);
});

Template.bzControlAddReview.onRendered(function () {
  $('.js-rating-select')
    .foundationSelect();
});

Template.bzControlAddReview.helpers({
  buttonStateDisabled: function () {
    return Template.instance()
      .buttonStateDisabled
      .get();
  },
  getCommentsCount: function () {
    return '';
  }
});

Template.bzControlAddReview.events({
  'keydown #review-input': function (e, v) {

    Meteor.setTimeout(function () {
      var messageText = $.trim(v.$('#review-input')
        .val());
      (messageText.length > 0) ? v.buttonStateDisabled.set(false) : v.buttonStateDisabled.set(true);
    }, 100);

  },
  'click .js-post-btn': function (e, v) {

    var request = {},
      userId = Meteor.userId(),
      textarea = $(e.target)
        .closest('.bz-post-leave-review')
        .find('.js-post-text-input');

    request.postId = this.postId;
    request.comment = $('.js-post-text-input')
      .val()
      .trim();

    Meteor.call('addComment', request, function (e, r) {
      var res;
      res = (!e) ? r : e;

      if (res.success && res.result) {
        textarea.val('');
        v.buttonStateDisabled.set(true);
      }

    });


    /* OLD CODE */
    /*
    var text = $('.js-post-text-input').val(),
         userId = Meteor.userId(),
         postId = this.postId,
         rating = $('.js-rating-select').val();
     if(!userId){
       // todo: after login the process should be continued
       /!*var loginFunc = accountsClientOrServer.onLogin(function(){

       });*!/
       if(confirm('please login to leave comments')){
         Router.signIn(true);
       }
     } else {
       bz.ui.validateFoundationForm().done(function(res) {
         if(res.isValid){
           if(text.trim() && postId){
             bz.cols.reviews.insert({
               entityId: postId,
               type: 'postType',
               user: {
                 _id: Meteor.user()._id,
                 username:  Meteor.user().username,
                 profile:
               {
                 image:  Meteor.user().profile.image
               }
               },
               userId: Meteor.userId(),
               text: text.trim(),
               dateTime: Date.now()
             });
             $('.js-post-text-input').val('');
           }
         } else {
           bz.ui.error(res.errorMessages);
         }
       });

     }
     */

  }
});
