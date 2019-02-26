/**
 * Created by Ashot on 9/25/15.
 */
const SESSION_NAME = 'bz.common.uploadImageSrc';

Template.uploadImageModal.onDestroyed(function () {
  /*CONSOLE CLEAR
    console.log('uploadImageModal destroyed');
  */

});
Template.uploadImageModal.onRendered(function () {
  setTimeout(function () {
    $(document)
      .off('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal');
    $(document)
      .on('open.fndtn.reveal', '[data-reveal].js-avatar-upload-modal', function () {
        Template.uploadImageModal.bzOpened();
      });
  }, 1000);
  // this.data is session var name for holding img src
  $(document)
    .foundation('tab', 'reflow');

});
// this is analog to rendered, runs every time modal is open
Template.uploadImageModal.bzOpened = function () {
  cleanForm();
  ImageClass.cleanClass();
  //CreateNewImage();
};
Template.uploadImageModal.helpers({
  getPreviewImgSrc: function () {
    var imgSrc,
      imgObj = currentImageReactive.get();
    /*if (imgObj.type === IMG_TYPES.BLOB) {
     imgSrc = imgObj.src
     //imgSrc = imgObj.data
     } else {
     imgSrc = imgObj.src;
     }*/
    $('.js-preview')
      .animate({ opacity: 1.0 }, 150);
    bz.ui.spinnerRemove('.js-preview-wrapper');
    return imgObj.src;
  },
  countFile: function () {
  },
  getUserImages: function () {
    return bz.cols.images.find({ userId: Meteor.userId() });
  }
});

Template.uploadImageModal.events({
  'click .tabs a': function (e, v) {
    e.preventDefault();
  },
  'click .js-photo-library': function (e, v) {
    var options = {
      width: 350,
      height: 350,
      quality: 75
    };
    if (typeof Camera !== 'undefined') {

      options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
      MeteorCamera.getPicture(options, function (err, data) {
        if (err) {
          console.log('error', err);
        }
        if (data) {
          saveImageFromDataToSession(data);
        }
      });

    } else {
      $('.js-library-not-available-alert')
        .show(function () {
          setTimeout(function () {
            $('.js-library-not-available-alert')
              .hide();
          }, 3000);
        });
    }
  },
  'click .js-take-photo': function (e, v) {
    var options = {
        width: 350,
        height: 350,
        quality: 75
      },
      that = this;

    MeteorCamera.getPicture(options, function (err, data) {
      if (err) {
        console.log('error', err);
      }
      if (data) {
        saveImageFromDataToSession(data);
      }
    });
  },
  'click .js-use-image-url': function (e, v) {
    var imgUrl = $('.js-image-url')
      .val();
    if (imgUrl) {
      new UrlImageClass({
        url: imgUrl,
        img: $('.js-preview')[0]
      });
    }
    return false;
  },
  'paste .js-image-from-clipboard': function (e, v) { // orig: http://jsfiddle.net/KJW4E/2/, http://stackoverflow.com/questions/18377891/how-can-i-let-user-paste-image-data-from-the-clipboard-into-a-canvas-element-in
    var data = e.originalEvent && e.originalEvent.clipboardData;
    if (data) {
      var items = data.items;
      if (items) {
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf('image') !== -1) {
            var blob = items[i].getAsFile();
            new BlobImageClass({
              blob: blob
            });
          }
        }
      }
      if (!_.filter(items, (item) => {
        return item.type.indexOf('image') !== -1;
      }).length) {
        // pasted object is not blob!!
        bz.ui.error('pasted object is not image!');
      }
    }
  },
  'click .js-use-random-image-url': function (e, v) {
    var that = this,
      imgData,
      randomImgUrl = bz.const.randomImageSite;
    // randomImgUrl = bz.const.randomImageSite + '?ts=' + Date.now();
    if (randomImgUrl) {
      bz.ui.spinnerAdd('.js-preview-wrapper');
      $('.js-preview')
        .animate({ opacity: 0 }, 150);

      new RandomImageClass({
        url: randomImgUrl,
        img: $('.js-preview')[0]
      });
    }
  },
  'change .js-file-upload': function (e, v) {
    var input = e.target,
      that = this,
      file = input.files && input.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e1) {
        new BlobImageClass({
          fileName: file.name,
          data: e1.target.result,
          blob: file
        });
      };
      reader.readAsDataURL(file);
    }
  },
  'click .js-ok-btn': function (e, v) {
    $('.js-avatar-upload-modal')
      .foundation('reveal', 'close');
    if (this.imagesArr) {
      doneCloseChooseImageDialog(this.imagesArr, currentImageReactive.get());
    }
  },
  'click .js-cancel-btn': function (e, v) {
    $('.js-avatar-upload-modal')
      .foundation('reveal', 'close');
    ImageClass.cleanClass();
  },
  'click .js-random-image-tab-btn': function (e, v) {
    setTimeout(() => {
      v.$('.js-use-random-image-url')
        .click();
    }, 150);
  },
  'click .js-tab-title': function (e, v) {
    v.$('.js-preview')
      .attr('src', '');
  }
});

Template.bzImagesPreviewList.events({
  'click .js-images-preview-list-image': function (e, v) {
    var mongoId = v.data._id;
    new UrlImageClass({
      url: v.data.data,
      mongoId: mongoId
    });
  }
});

//HELPERS:
function cleanForm(v) {
  v = v || window;
  //Session.set(SESSION_NAME, {});
  v.$('.js-file-upload')
    .val('');
}

doneCloseChooseImageDialog = function (imagesArrExternal, imgObj) {
  var inp,
    file;
  bz.ui.spinnerAdd('.js-edit-avatar');
  if (imgObj) {
    imgObj.createThumbnail()
      .then(() => {
        ImageClass.saveImageToExternalObject(imagesArrExternal, imgObj);
        bz.ui.spinnerRemove('.js-edit-avatar');
      });
    /*new ThumbnailImageClass(imgObj, (thumbObj)=> {
      if (imgObj.type === 'blob') {
      } else if (imgObj.type === 'url') {
      }
      imgObj.thumbnail = thumbObj;
      ImageClass.saveImageToExternalObject(imagesArrExternal, imgObj);
      bz.ui.spinnerRemove('.js-edit-avatar');
    });*/
    //ImageClass.saveImageToExternalObject(imagesArrExternal, imgObj);
    //bz.ui.spinnerRemove('.js-edit-avatar');
  }
};
