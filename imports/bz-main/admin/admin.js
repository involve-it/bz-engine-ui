/**
 * Created by arutu_000 on 1/17/2017.
 */

Template.admin.rendered = function () {
};

Template.admin.helpers({
  getUsers: function () {
    return Meteor.users.find({ createdAt: { $gte: new Date(+new Date - 2 * 12096e5) } });  // today - 2 weeks
  }
});

Template.userItem.rendered = function () {
};
Template.userItem.helpers({
  getEmail: function () {
    return this.emails[0] && this.emails[0].address;
  },
  getProfile: function () {
    return JSON.stringify(this.profile);
  },
  getCreatedDate() {
    return moment(this.createdAt)
      .toString();
  },
  getLastLoginDate() {
    var dt = this.status && this.status.lastLogin && this.status.lastLogin.date;
    return moment(dt)
      .toString();
  }
});
