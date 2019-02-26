/**
 * Created by douson on 12/17/15.
 */

Router.configure({
  layoutTemplate: 'mainLayout'
});
InitFoundationOffCanvas = function () {
  $(document)
    .foundation({
      offcanvas: {
        //move, overlap_single or overlap, reveal
        open_method: 'move',
        close_on_click: true
      }
    });
};

InitMmenuOffCanvas = function () {
  var $menu = $('#bz-menu');
  //var API = $menu.data( "mmenu" );

  $menu.mmenu({
    // options
    'navbar': {
      'add': false
    },
    'extensions': [
      'menuShadow'
    ]
  }, {
    // configuration
    offCanvas: {
      pageSelector: '#bz-body-wrapper',
      classNames: {
        selected: 'active'
      }
    }
  });
};
