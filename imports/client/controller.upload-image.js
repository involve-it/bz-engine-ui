/**
 * Created by arutu_000 on 2/2/2016.
 */

const IMG_TYPES = {
  URL: 'url',
  BLOB: 'blob',
  RANDOM: 'random',
  THUMBNAIL: 'thumbnail'
};

currentImageReactive;
//imagesArrayExternalReactive = new ReactiveVar();
// temp:
bz.help.makeNamespace('bz.cols.images');
bz.cols.images = new Meteor.Collection('bz.images');

/*CreateNewImage = function(){
 var img =  new ImageClass();
 currentImageReactive.set(img);
 return img;
 }*/

ImageClass = class {
  constructor(options = {}) {
    this.isSaved = false;
    this.setRandomNameFromExtension(options.fileName);
  }

  set src(value) {
    this.data = value;
  }

  get src() {
    return this.data;
  }

  save() {
    return new Promise((resolve) => {
      resolve(this);
    });
    //return this._createThumbnail();
  }

  toObject() {

  }

  static saveImageToExternalObject(objReactive, imgObj) {
    var objectVal = objReactive.get(),
      newObjectVal;
    if (objectVal && Array.isArray(objectVal)) {
      newObjectVal = objectVal;

      newObjectVal.push(imgObj);
    } else {
      newObjectVal = imgObj;
    }
    objReactive.set(newObjectVal);
    window.aaa = objReactive;
  }

  static getDataFromImgUrl(url, img, w, h) {
    var canvas,
      ctx,
      ret,
      imgCreated = false;
    if (!img) {
      img = new Image();
    }
    ret = ImageClass.imgToDataUrl(img, url);
    return ret;
  }

  static imgToDataUrl(img, url) {
    var resUrl;
    return new Promise((resolve) => {
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth; // or 'width' if you want a special/scaled size
        canvas.height = img.naturalHeight; // or 'height' if you want a special/scaled size

        canvas.getContext('2d')
          .drawImage(img, 0, 0);
        resUrl = canvas.toDataURL('image/png');
        resolve(resUrl);
      };
      img.onerror = function () {
      };
      if (url) {
        img.src = url;
      }
    });
  }

  static getDataFromImg$(img$) {
    return data;
  }

  createThumbnail() {
    var that = this,
      thisClone = _.clone(this);
    thisClone.name = ThumbnailImageClass.getFileNameForThumbnail(this.name);
    return new Promise((resolve, reject) => {
      new ThumbnailImageClass(thisClone).then((thumbObj) => {
        that.thumbnail = thumbObj;
        resolve(thumbObj);
      });
    });
  }

  setRandomNameFromExtension(fullName) {
    fullName = fullName || this.fullName || '';
    var extension = fullName.substr(fullName.lastIndexOf('.') + 1);
    extension = (extension.length > 5 || extension.length < 3) ? 'png' : extension;
    this.name = _.guid() + '.' + extension;
    return this.name;
  }

  static dataURItoBlob(dataURI) { // http://stackoverflow.com/a/11954337
    var binary = atob(dataURI.split(',')[1]);
    var array = [];
    for (var i = 0; i < binary.length; i++) {
      array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: 'image/jpeg' });
  }

  static cleanClass() {
    currentImageReactive.set(new ImageClass());
  }
};

BlobImageClass = class extends ImageClass {
  constructor(options = {}, fileInputSelectorEl) {
    var that;
    if (typeof options === 'string') {
      options = {
        url: options,
        fileName: options
      };
    }
    super(options);
    that = this;
    this.type = IMG_TYPES.BLOB;
    this.blob = options.blob;
    if (options.blob && options.blob.constructor === Blob) {
      this._getDataUriFromBlobPromise(options.blob)
        .done((res) => {
          that.src = res;
          currentImageReactive.set(this);
        });
    } else if (fileInputSelectorEl) {
      ImageClass.getDataFromImgUrl(options.url, fileInputSelectorEl, 600, 500)
        .done((imgData) => {
          that.src = imgData;
          currentImageReactive.set(that);
        });
    } else {
      that.src = options.data;
      currentImageReactive.set(that);
    }
  }

  save() {
    var that = this,
      uploader = new Slingshot.Upload('bzImagesDirective'),
      file = this,
      error = uploader.validate(file),
      blob = file.blob;
    return new Promise((resolve, reject) => {
      blob.name = file.name;
      if (error) {
        /*CONSOLE CLEAR
        console.error(error);
        */
        reject(error);
      } else {
        uploader.send(blob, (error1, downloadUrl) => {
          if (error1) {
            /*CONSOLE CLEAR
            console.error(error1);
            */
            if (error1 && error1.error === 'Upload denied') {
              switch (error1.reason) {
                case 'File exceeds allowed size of 5 MB':
                  bz.ui.error(error1.message + ' . Please use other image.');
                  break;
                default:
                  bz.ui.error(error1.message);
                  break;
              }
              alert(error1.message);
            }
            // Log service detailed response.
            var printErr = uploader.xhr && uploader.xhr.response || error1;
            reject(error1);
          }
          else {
            that.src = downloadUrl;
            that.isSaved = true;
            resolve(that);
          }
        });
      }
    });
  }

  toObject() {
    /*CONSOLE CLEAR
      console.log('toObject');
    */
  }

  _getDataUriFromBlobPromise(blob) {
    var blob = blob || this.blob;
    return new Promise((resolve, reject) => {
      var fileReader = new FileReader();
      fileReader.onload = function (res) {
        resolve(fileReader.result);
      };
      fileReader.readAsDataURL(blob);
    });
  }
};

RandomImageClass = class extends ImageClass {
  constructor(options = {}) {
    var that,
      imgUrl,
      blob;
    super(options);
    that = this;
    this.type = IMG_TYPES.RANDOM;
    if (options.img) {
      ImageClass.imgToDataUrl(options.img, options.url)
        .then(dataUrl => {
          that.src = dataUrl;
          currentImageReactive.set(that);
        });
    } else {
    }
  }

  save() {
    var that = this,
      uploader = BlobImageClass.uploader = BlobImageClass.uploader || new Slingshot.Upload('bzImagesDirective'),
      file = this,
      error,
      blob;

    blob = ImageClass.dataURItoBlob(that.src);
    that.blob = blob;
    blob.name = file.name;


    return new Promise((resolve, reject) => {
      error = uploader.validate(file);
      if (error) {
        /*CONSOLE CLEAR
        console.error(error);
        */
        reject(error);
      } else {
        uploader.send(blob, (error1, downloadUrl) => {
          if (error1) {
            /*CONSOLE CLEAR
            console.error(error1);
            */
            if (error1 && error1.error === 'Upload denied') {
              switch (error1.reason) {
                case 'File exceeds allowed size of 5 MB':
                  bz.ui.error(error1.message + ' . Please use other image.');
                  break;
                default:
                  bz.ui.error(error1.message);
                  break;
              }
              alert(error1.message);
            }
            // Log service detailed response.
            var printErr = uploader.xhr && uploader.xhr.response || error1;
            reject(error1);
          }
          else {
            that.src = downloadUrl;
            that.isSaved = true;
            resolve(that);
          }
        });
      }
    });

  }
};
UrlImageClass = class extends ImageClass {
  constructor(options = {}) {
    var that;
    //options.fileName = UrlImageClass.getNameFromUrl(options.url);

    super(options);
    that = this;
    this.type = IMG_TYPES.URL;
    this.url = options.url;
    if (options.img) {
      ImageClass.imgToDataUrl(options.img, options.url)
        .then(dataUrl => {
          that.src = dataUrl;
          currentImageReactive.set(that);
        });
    } else {
    }
    //currentImageReactive.set(this);
  }

  save() {
    var that = this,
      uploader = BlobImageClass.uploader = BlobImageClass.uploader || new Slingshot.Upload('bzImagesDirective'),
      file = this,
      error,
      blob;
    return new Promise((resolve, reject) => {
      blob = ImageClass.dataURItoBlob(that.src);
      that.blob = blob;
      blob.name = file.name;
      error = uploader.validate(file);
      if (error) {
        /*CONSOLE CLEAR
        console.error(error);
        */
        reject(error);
      } else {
        uploader.send(blob, (error1, downloadUrl) => {
          if (error1) {
            /*CONSOLE CLEAR
            console.error(error1);
            */
            if (error1 && error1.error === 'Upload denied') {
              switch (error1.reason) {
                case 'File exceeds allowed size of 5 MB':
                  bz.ui.error(error1.message + ' . Please use other image.');
                  break;
                default:
                  bz.ui.error(error1.message);
                  break;
              }
              alert(error1.message);
            }
            // Log service detailed response.
            var printErr = uploader.xhr && uploader.xhr.response || error1;
            reject(error1);
          }
          else {
            that.src = downloadUrl;
            that.isSaved = true;
            resolve(that);
          }
        });
      }
    });
  }

  static getNameFromUrl(url) {
    var matches = /.+\/(.+)/gmi.exec('http://localhost:3000/posts/newtype=a?d.');
    return matches && matches[1];
  }
};
ThumbnailImageClass = class extends ImageClass {
  constructor(options = {}) {
    var ret,
      file = options.data,
      that;

    super(options);
    that = this;
    this.type = IMG_TYPES.THUMBNAIL;
    this.name = ThumbnailImageClass.getFileNameForThumbnail(this.name) || this.setRandomNameFromExtension(fullName);

    ret = new Promise((resolve, reject) => {
      if (options.type === IMG_TYPES.URL) {
        var dataString = ImageClass.getDataFromImgUrl(file)
          .done((result) => {
            file = ImageClass.dataURItoBlob(result);
            Resizer.resize(file, {
              width: bz.const.images.THUMB_WIDTH,
              height: bz.const.images.THUMB_HEIGHT,
              cropSquare: true
            }, (err, newFile) => {
              that.blob = newFile;
              //callback && callback(this);
              resolve(that);
            });
          });

      } else if (file && typeof file !== 'object' && file.constructor !== Blob) {
        file = ImageClass.dataURItoBlob(file);
        Resizer.resize(file, {
          width: bz.const.images.THUMB_WIDTH,
          height: bz.const.images.THUMB_HEIGHT,
          cropSquare: true
        }, (err, newFile) => {
          that.blob = newFile;
          //callback && callback(this);
          resolve(that);
        });
      }
    });
    return ret;
  }

  save() {
    ThumbnailImageClass.uploader = ThumbnailImageClass.uploader || new Slingshot.Upload('bzImagesDirective');
    var that = this,
      uploader = ThumbnailImageClass.uploader,
      file = this,
      error = uploader.validate(file),
      blob = file.blob;
    return new Promise((resolve, reject) => {
      if (error) {
        /*CONSOLE CLEAR
        console.error(error);
      */
      }
      blob.name = file.name;
      if (error) {
        /*CONSOLE CLEAR
        console.error(error);
        */
        reject(error);
      } else {
        uploader.send(blob, (error1, downloadUrl) => {
          if (error1) {
            /*CONSOLE CLEAR
            console.error(error1);
            */
            if (error1 && error1.error === 'Upload denied') {
              switch (error1.reason) {
                case 'File exceeds allowed size of 5 MB':
                  bz.ui.error(error1.message + ' . Please use other image.');
                  break;
                default:
                  bz.ui.error(error1.message);
                  break;
              }
              alert(error1.message);
            }
            var printErr = uploader.xhr && uploader.xhr.response || error1;
            reject(error1);
          }
          else {
            that.src = downloadUrl;
            that.isSaved = true;
            resolve(that);
          }
        });
      }
    });
  }

  toDbObject() {
    return {
      data: this.data
      //name: img.name,
    };
  }

  getBlob(blob) {
    var blob = blob || this.blob,
      that = this;
    return new Promise((resolve, reject) => {
      var fileReader = new FileReader();
      fileReader.onload = function (res) {
        resolve({
          data: fileReader.result,
          thumbnail: that
        });
      };
      fileReader.readAsDataURL(blob);
    });
  }

  static getFileNameForThumbnail(fileName) {
    var name,
      arr = fileName.split('.');
    if (arr.length > 1) {
      name = arr[0] + '-thumb.' + arr[1];
    }
    return name;
  }
};
Meteor.startup(() => {
  currentImageReactive = new ReactiveVar(new ImageClass());
});
