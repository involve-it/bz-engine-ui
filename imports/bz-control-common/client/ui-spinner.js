/**
 * Created by arutu_000 on 2/14/2016.
 */
var spinners = {};

bz.ui.spinnerAdd = function (elementSelector, hasBg) {
  if (Spinner && $(elementSelector)[0]) {
    spinners[elementSelector] && bz.ui.spinnerRemove(elementSelector);
    var spinner = new Spinner().spin();
    spinners[elementSelector] = spinner;
    spinner.cssPositionOld = $(elementSelector)
      .css('position');
    $(elementSelector)
      .css('position', 'relative');
    $(elementSelector)[0].appendChild(spinner.el);

    // add non-click-through background if flag is set:
    if (hasBg) {
      $(elementSelector)
        .append('<div class="bz-spinner-background"></div>');
    }
    setTimeout(() => {
      bz.ui.spinnerRemove(elementSelector);
    }, 120000);
  } else {
    console.log('spinner object is not defined');
  }
};
bz.ui.spinnerRemove = function (elementSelector) {
  var spinner;
  if (elementSelector) {
    if (!spinners[elementSelector]) {
      //console.error('spinner not found');
    } else {
      spinner = spinners[elementSelector];
      spinner.stop();
      $(elementSelector)
        .css('position', spinner.cssPositionOld);

      delete spinner;
    }
    $(elementSelector)
      .find('.bz-spinner-background')
      .remove();
  }
};
