/**
 * Created by Ashot on 9/25/15.
 */
// HELPERS:
bz.ui.putCategoriesToSession = (catsToAdd, extend) => {
  var cats = (!extend || !Session.get('bz.control.category-list.activeCategories')) ? [] : Session.get('bz.control.category-list.activeCategories');

  if (Array.isArray(catsToAdd)) {
    _.each(catsToAdd, (item) => {
      addToArr(item);
    });
  } else if (typeof catsToAdd === 'string') {
    addToArr(catsToAdd);
  }

  function addToArr(el) {

    var ind = cats.indexOf(el);
    if (ind !== -1) {
      cats.splice(ind, 1);
    } else {
      //cats.push(this.id);
      cats.push(el);
    }
  }

  Session.set('bz.control.category-list.activeCategories', cats);

};


bz.ui.putCategoriesToLinks = (intName) => {
  if (typeof intName === 'string') {
    Router.go(intName);
  }
};


GetPostAdTypesI18n = (lang) => {
  var ret;
  if (lang) {
    ret = bz.cols.postAdTypes.find({}, {
      transform: function (doc) {

        var doc1 = _.extend(doc, doc.i18n[lang]);

        return doc1;
      }
    });
  } else {
    ret = bz.cols.postAdTypes.find({});
  }

  return ret;

};
