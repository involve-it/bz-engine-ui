/**
 * Created by Ashot on 9/25/15.
 */
window.avatarThumbnailReactive = ReactiveVar();

Meteor.startup(function () {
  avatarThumbnailReactive.set();
  Tracker.autorun(function () {
    var img = avatarThumbnailReactive.get();
    if (!Meteor.userId()) {
      avatarThumbnailReactive.set();
    } else {
      if (img && img !== '') {
        img.save().then(img1=> {
          Meteor.users.update(Meteor.userId(), {
            $set: {
              'profile.image': {
                data: img1.data
              }
            }
          });
        });
      }
    }
  });
  if (Template) {
    Template.registerHelper('isAdmin', function() {
      var user = Meteor.user(), ret = false;
      if (user && user.profile.isAdmin) {
        ret = true;
      }
      return ret;
    });
    Template.registerHelper('isAdminRole', function() {
      var user = Meteor.user(), ret = false;
      if (user && (user.profile.type === 'admin' || user.profile.type === 'hero')) {
        ret = true;
      }
      return ret;
    });
  }
});

