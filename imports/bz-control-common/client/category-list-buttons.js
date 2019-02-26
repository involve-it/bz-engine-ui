/**
 * Created by root on 9/5/15.
 */
/* Make category list */
Template.categoryListButtons.helpers({
  getCategoryItems: function () {
    /*data = bz.cols.postAdTypes.find().fetch();
    return data;*/
    var lang = Session.get('bz.user.language');
    return GetPostAdTypesI18n(lang);
  },
  isActive: function (a, b) {
    var cats = Session.get('bz.control.category-list.activeCategories') || [];
    return (cats && cats.indexOf(this.intName) !== -1) ? 'active' : '';
  }
});

Template.categoryListButtons.events({
  'click .js-item-category': function (e, v) {
    /*    var cats = Session.get('bz.control.category-list.activeCategories') || [],
            ind = cats.indexOf(this.name);
        if (ind !== -1) {
          cats.splice(ind, 1);
        } else {
          //cats.push(this.id);
          cats.push(this.name);
        }
        Session.set('bz.control.category-list.activeCategories', cats);*/


    //bz.ui.putCategoriesToSession(this.intName, true);

    var $target = e.target.closest('.js-item-category');

    if ($($target)
      .data('value') === 'all') {
      Session.set('bz.control.category-list.activeCategories', '');
    }


    if (this.intName) {
      bz.ui.putCategoriesToSession(this.intName);
    }


    /*if(this.hasRoute){
      bz.ui.putCategoriesToLinks(this.intName);
      
    } else if(this.name) {
      bz.ui.putCategoriesToSession(this.intName);
      bz.ui.alert(`You filtered results by the "${this.name.toCapitalCase()}" category, to undo this click "All" in top search section`);
    }*/


    //bz.ui.putCategoriesToSession('jobs');


    //Session.set('activeTemplate', 'singleSearchTemplate');
    Session.set('activeTemplate', null);

  }
});
