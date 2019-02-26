/**
 * Created by Ashot on 9/27/15.
 */
Template.bzControlMenuHashes.onCreated(function () {
  Meteor.subscribe('bz.hashes.all');
});

Template.bzControlMenuHashes.helpers({
  getUserHashes: function () {
    var ret = bz.cols.hashes.find({ userId: Meteor.userId() });
    return (ret.count() > 0) ? ret : '';
  },
  getMenuHashName: function () {
    var menuLinkText = '#' + this.details.text + ' @' + this.details.locName;
    return menuLinkText;
  },
  getMenuLinkText: function () {
    //var menuLinkText = '#' + this.details.text + ' @' + ;
    var url = '/home?locationName=' + this.details.locName + '&searchText=' + this.details.text + '';
    return url;
    //return encodeURIComponent(url);
  }
});

Template.bzControlMenuHashesMainMenu.onRendered(function () {
  var el = $('.left-off-canvas-menu');
  if (el) {
    return el.find('.dropdown-hashes-menu-main-menu')
      .remove();
  }
});

Template.bzControlMenuHashesMainMenu.helpers({
  isHashesUserId: function () {
    return bz.cols.hashes.find({ userId: Meteor.userId() })
      .fetch();
  },
  getUserHashes: function () {
    return bz.cols.hashes.find({ userId: Meteor.userId() });
  },
  getMenuHashName: function () {
    var menuLinkText = '#' + this.details.text + ' @' + this.details.locName;
    return menuLinkText;
  },
  getMenuLinkText: function () {
    //var menuLinkText = '#' + this.details.text + ' @' + ;
    var url = '/home?locationName=' + this.details.locName + '&searchText=' + this.details.text + '';
    return url;
    //return encodeURIComponent(url);
  }
});

Template.bzInnerMenuLeft.onCreated(function () {
  var userId = Meteor.userId(),
    ins = Template.instance(),
    innerObj = {},
    profileObj = {},
    that = this;
  Meteor.call('getUser', userId, function (e, r) {
    if (e) {
    } else if (r && r.result) {
      innerObj = r.result;
      _.each(innerObj.profileDetails, function (item) {
        profileObj[item.key] = {
          value: item.value,
          policy: item.policy
        };
      });
      Object.assign(innerObj, profileObj);
      Object.assign(innerObj, bz.help.users); // let's not forget about helpers!
      that.data = innerObj;
      ins.userData.set(innerObj);
    }
  });
  ins.userData = new ReactiveVar({});
});

Template.bzInnerMenuLeft.helpers({
  getUser: function () {
    return Template.instance()
      .userData
      .get();
  }
});

Template.bzInnerMenuLeft.events({
  'click .btn-drop': function (e) {
    e.preventDefault();

    var menuHeight = $('[role=\'expand-menu-dropdown\']')
      .height();
    if ($('[role=\'user-expand-menu\']')
      .hasClass('user-panel-expand')) {
      $('[role=\'expand-menu-trigger\']')
        .removeClass('arrow-down');
      $('[role=\'user-expand-menu\']')
        .removeClass('user-panel-expand');
      $('[role=\'expand-menu-dropdown\']')
        .parent()
        .height(0);
    } else {
      $('[role=\'expand-menu-trigger\']')
        .addClass('arrow-down');
      $('[role=\'user-expand-menu\']')
        .addClass('user-panel-expand');
      $('[role=\'expand-menu-dropdown\']')
        .parent()
        .height(menuHeight);
    }
  },
  'click .link-menu > a': function (e, v) {
    var menu = $('#bz-menu'),
      API;

    if (menu) {
      API = menu.data('mmenu');
      API.close();
    }
  }
});

