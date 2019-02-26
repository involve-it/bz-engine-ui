//Meteor.startup(()=> {
// let's extend the router with convenience method:
  Router.signIn = function (isReturnBack) {
    var sR = '/sign-in';
    if (Router.routes['entrySignIn']) {
      sR = Router.routes['entrySignIn'].url();
    } else {

    }
    if (isReturnBack) {
      //Session.set('fromWhere', this.current().url);
    }
    Router.go(sR);
  };
  bz.bus.requireLoginController = RouteController.extend({
//requireLoginController = FastRender.RouteController.extend({
    onBeforeAction: function () {
      if (!Meteor.user()) {
        if (Meteor.loggingIn()) {
          this.render(this.loadingTemplate);
        } else {
          Router.signIn(true);
          //Router.go('entrySignUp');
          //Router.go('entrySignIn');
        }
      } else {
        this.next();
      }
    }
  });
Router.configure({
  // layoutTemplate: 'mainLayout',
  notFoundTemplate: 'notFoundTemplate',
  noRoutesTemplate: 'noRoutesTemplate'

});
//});
