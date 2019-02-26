/**
 * Created by douson on 06.07.15.
 */
//bz.help.maps.initLocation();

Template.mainLayout.onRendered(function () {

  InitMmenuOffCanvas();
  InitFoundationOffCanvas();
  // layoutRenderedLazyLoad();
  //UIkit.$html.trigger('changed.uk.dom');
});

Template.basicLayout.onRendered(function () {
  InitMmenuOffCanvas();
});

Template.bzNavBar.events({
  'click .bz-open-off-canvas': function (e, v) {
    e.preventDefault();
    var menu = $('#bz-menu'),
      API,
      menuOpening = $(document)
        .find('.mm-opening');

    if (menu && !!menuOpening) {
      API = menu.data('mmenu');
      API.open();
    }
  }
});

Template.basicLayout.events({
  'click .bz-open-off-canvas': function (e, v) {
    e.preventDefault();
    var menu = $('#bz-menu'),
      API,
      menuOpening = $(document)
        .find('.mm-opening');

    if (menu && !!menuOpening) {
      API = menu.data('mmenu');
      API.open();
    }
  }
});

Template.bzChangeLanguage.rendered = function () {
  var langProm;
  /*if(Meteor.user() && Meteor.user().profile) {
   if (!Meteor.user().profile.settings || !Meteor.user().profile.settings.language) {
   lang = SetUserLanguage();
   //T9n.defaultLanguage;
   } else {
   lang = Meteor.user().profile.settings.language;

   if (!lang){
   lang = SetUserLanguage();
   }
   }
   T9n. SetUserLanguage(lang);*/

  GetUiLanguage()
    .then((lang) => {
      $('.js-language-picker')
        .val(lang || 'en');

      //Ashot: review - select language drop down was not updating on jQuery call.
      //_.defer seems to fix it, although not sure if it's the right approach.
      /*_.defer(function(){
        $('.js-language-picker').val(lang);
      });*/
    });
};


Template.bzChangeLanguage.events({
  //'change .dropdown-choose-lang': function (e, v) {
  'change .js-language-picker': function (e, v) {
    var lang = e.target.value;

    SetUiLanguage(lang);
    setTimeout(() => {
      $('.js-bz-header')
        .hide()
        .show(0);
    }, 100);

    // Set language - in the headerof the site
    var elms = $('.bz-switcher-language-list')
      .children()
      .find('a');
    elms.each(function () {
      $(this)
        .removeClass('active');
      if ($(this)
        .data('lang') === lang) {
        $(this)
          .addClass('active');
      }
    });

    //Set language - left menu
    var langLeftMenu = $('.bz-menu-switcher-language-list')
      .children()
      .find('a');
    langLeftMenu.each(function () {
      $(this)
        .closest('.bz-button')
        .removeClass('bz-active');
      if ($(this)
        .data('lang') === lang) {
        $(this)
          .closest('.bz-button')
          .addClass('bz-active');
      }
    });

  }
});


Template.bzDropSelectLanguage.rendered = function () {

  GetUiLanguage()
    .then((lang) => {

      var el = $('.bz-switcher-language-list'),
        element = el.children()
          .find('a');

      element.each(function () {
        if ($(this)
          .data('lang') === lang) {
          $(this)
            .addClass('active');
        }
      });
    });

};


Template.bzDropSelectLanguage.events({
  'click [data-lang]': function (e, v) {
    e.preventDefault();

    var lang = e.target.getAttribute('data-lang');
    SetUiLanguage(lang);

    var el = $('.bz-switcher-language-list');

    var toggles = el.find('>*'),
      target = $(e.target);

    if (target.hasClass('active')) {
      return;
    } else {
      toggles.find('a')
        .filter('.active')
        .removeClass('active');
      target.addClass('active');
    }

    // Set language - in the footer of the site
    $('select.js-language-picker')
      .val(Session.get('bz.user.language'));

    //Set language - left menu
    var langLeftMenu = $('.bz-menu-switcher-language-list')
      .children()
      .find('a');
    langLeftMenu.each(function () {
      $(this)
        .closest('.bz-button')
        .removeClass('bz-active');
      if ($(this)
        .data('lang') === lang) {
        $(this)
          .closest('.bz-button')
          .addClass('bz-active');
      }
    });
  }
});

Template.bzNavMe.onCreated(function () {
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
      that.data = innerObj;
      ins.userData.set(innerObj);
    }
  });
  ins.userData = new ReactiveVar({});
});

Template.bzNavMe.helpers({
  getUser: function () {
    return Template.instance()
      .userData
      .get();
  }
});


Template.bzLeftMenuSelectLanguage.onRendered(function () {
  var lang = Session.get('bz.user.language');
  if (lang) {
    var el = $('.bz-menu-switcher-language-list')
      .children()
      .find('a');

    el.each(function () {
      if ($(this)
        .data('lang') === lang) {
        $(this)
          .closest('.bz-button')
          .addClass('bz-active');
      }
    });
  }
});


Template.bzLeftMenuSelectLanguage.events({
  'click .js-bz-button': function (e, v) {
    e.preventDefault();

    var ele = $(e.target.closest('.bz-button'));

    if (!ele.hasClass('bz-active')) {
      var lang = v.$('.bz-button')
        .not('.bz-active')
        .find('a')
        .data('lang');
      SetUiLanguage(lang);

      //$('[data-lang]').trigger("click", e);
    }

    $('[data-bz-button-radio] > *')
      .attr('aria-checked', 'false')
      .filter('.bz-active')
      .attr('aria-checked', 'true');

    v.$('.bz-button')
      .not(ele)
      .removeClass('bz-active')
      .blur();
    ele.addClass('bz-active');

    v.$('.bz-button')
      .not(ele)
      .attr('aria-checked', 'false');
    ele.attr('aria-checked', 'true');

    v.$('.js-bz-button')
      .trigger('change.bz.button', [ele]);


    // Set language - in the footer of the site
    $('select.js-language-picker')
      .val(Session.get('bz.user.language'));

    // Set language - in the header of the site
    var elms = $('.bz-switcher-language-list')
      .children()
      .find('a');
    elms.each(function () {
      $(this)
        .removeClass('active');
      if ($(this)
        .data('lang') === Session.get('bz.user.language')) {
        $(this)
          .addClass('active');
      }
    });
  }
});
