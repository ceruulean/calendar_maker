webpackHotUpdate("main_window",{

/***/ "./src/mvc_controller.js":
/*!*******************************!*\
  !*** ./src/mvc_controller.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mvc_view.js */ "./src/mvc_view.js");
/* harmony import */ var _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mvc_model.js */ "./src/mvc_model.js");
/* harmony import */ var _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var split_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! split.js */ "./node_modules/split.js/dist/split.es.js");
/* harmony import */ var micromodal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! micromodal */ "./node_modules/micromodal/dist/micromodal.es.js");
/* harmony import */ var _mirror__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mirror */ "./src/mirror.js");






//Mirror.setStore(Model.store);

let renderKeyMap = new Map();

let isEmpty = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].isEmpty;


/**
 * Regarding selection of a gallery item
 */
var selected = {
  item: null,
  set selectItem(m){
      if (this.item != null || this.item != undefined) this.item.classList.remove('selected');
      m.classList.add('selected');
    this.item = m;
  },
  get index(){
    if (!this.item) return -1;
    return this.item.getAttribute('index');
  }
};

/* =============================== 
================ INIT ============== 
--------------------------------------*/
let toolbarForm = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].toolbar.init(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.toolbarInit());
    /* event Registration for <Select> */
let onChangeToolbar = (e, propName) => {
  try{
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.save.toolbar(propName, e.target.value);
    __renderGallery();
  } catch(error){
    //TODO warning
    e.target.value = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.toolbar[propName];
  }

}

  let updatePages = (event) => {
    let attr = event.target.name;
    let newVal = event.target.value;
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.save.toolbar(attr, newVal);
    let pages = document.getElementsByTagName('page');
    for (let p = 0; p < pages.length; p++) {
      pages[p].setAttribute(attr, newVal);
    }
  }

  /**
    selects: [startMonth, endMonth, formatMode, size, layout],
    inputs: [startYear, endYear],
  */
  for (let s = 0; s < 3; s++) {
    toolbarForm.selects[s].addEventListener('change', function(e){onChangeToolbar(e, toolbarForm.selects[s].name)});
  }
  toolbarForm.selects[3].addEventListener('change', function(e){
    updatePages(e);
  });
  toolbarForm.selects[4].addEventListener('change', function(e){
    updatePages(e);
  });
  // for (let i in toolbarForm.inputs) {
  //   toolbarForm.inputs[i].addEventListener('change', function(e){onChangeToolbar(e, toolbarForm.inputs[i].name)});
  // }

  let startyear = [
    __renderGallery()
  ]

  //Mirror.STOREWATCH.set('startyear', startyear);

  __renderGallery();

  _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.mediaInit();


/* 
=========================================
======== File Upload registration
=========================================
*/


let uploadMultiple = document.getElementById('upload-multiple');

let mediaUploadHandler = (event, atIndex) => {
  if (atIndex == -1) {
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.save.cover(event.target.files[0]);
  } else {
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.save.galleryMedia(event.target.files[0], atIndex);
  }
  //__renderGallery();
}

uploadMultiple.addEventListener('change', function(e){
  mediaUploadHandler(e);
    __renderGallery();
  });
_mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].uploader.single.addEventListener('change', function(e) {
  mediaUploadHandler(e, selected.index)
})


/* ---- ------ ----- - Render stuff
========================================= */

let __renderInWorkspace = {
  calendar(){
    // let index = selected.index;
    // let imgSrc = Model.load.media(index).path;
    // View.gallery.updateItemImage(index, imgSrc);
    // const retrieve = Model.workspace;
    // View.workspace.createCalendar(
    //   Model.load.galleryPanelItem(index).month,
    //   Model.load.galleryPanelItem(index).year,
    //   retrieve.paperSize,
    //   retrieve.paperLayout,
    //   retrieve.formatMode,
    //   imgSrc);
  },
  coverPage(){
    let retrieve = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.workspace;
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.updateCover(retrieve.cover);
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].workspace.renderCover(retrieve.paperSize, retrieve.paperLayout, retrieve.cover);
  }
}

function __renderGallery(){
  _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.gallery.generateItems();
  let handler = (ele) => {
    selected.selectItem = ele;
    if (ele.children[0].classList.contains('placeholder')) {
      return new Promise((resolve, reject)=> {
        _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].uploader.openSingleBrowser();
        let u = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].uploader.single;
          u.onchange = () => {
            if(u.files.length != undefined && u.files.length != null && u.files.length > 0) {
              resolve(true);
              u.value = null;
            } else {
              reject(false);
            }
          };
        })
    } else {
      return Promise.resolve();
    }
  }

  _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.clearPanel();
  if (_mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.gallery.needsCover) { // Coverrrrrrrrrrrrrrrrrrrrrrrrrrr
    let cover = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.insertCover(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.cover);
    cover.addEventListener('click', function(){
      let promise = handler(_mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.root.children[0]);
      if (isEmpty(promise)) return;
      promise.then(() => {
        __renderInWorkspace.coverPage();
      })
    });
  }

  let Items = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.renderPanel();
  // for (let i in Items) {
  //   Items[i].addEventListener('click', function(){
  //     let promise = handler(Items[i]);
  //     if (isEmpty(promise)) return;
  //     promise.then(() => {
  //       __renderInWorkspace.calendar();
  //     })
  //   });
  // }
  _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].uploader.renderBuffer(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.media, _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.gallery.totalMonths);
}


/** Global Events on window Object*/
function register(eventName, handler){
  window.addEventListener(eventName, handler);
}

register('warn_invalid', function(e){
  console.log('Invalid date range');
})


/* =============================================================
=========    Interaction
============================================================= */

//Panel resizer
Object(split_js__WEBPACK_IMPORTED_MODULE_2__["default"])(['#uploader', '#gallery-panel','#workspace', '#properties-panel'], {
  minSize:1,
  sizes:[10, 10, 65, 15], // must add up to 100 (%)
  gutterSize: 8,
});

micromodal__WEBPACK_IMPORTED_MODULE_3__["default"].init();

/* harmony default export */ __webpack_exports__["default"] = ({
  __renderGallery,
});

/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbXZjX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWlDO0FBQ0U7QUFDTjtBQUNPO0FBQ047O0FBRTlCOztBQUVBOztBQUVBLGNBQWMsb0RBQUk7OztBQUdsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isb0RBQUksY0FBYyxvREFBSztBQUN6QztBQUNBO0FBQ0E7QUFDQSxJQUFJLG9EQUFLO0FBQ1Q7QUFDQSxHQUFHO0FBQ0g7QUFDQSxxQkFBcUIsb0RBQUs7QUFDMUI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSxvREFBSztBQUNUO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixrRUFBa0UsZ0RBQWdEO0FBQ2xIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esb0VBQW9FLCtDQUErQztBQUNuSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsRUFBRSxvREFBSzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBLElBQUksb0RBQUs7QUFDVCxHQUFHO0FBQ0gsSUFBSSxvREFBSztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsb0RBQUk7QUFDSjtBQUNBLENBQUM7OztBQUdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxtQkFBbUIsb0RBQUs7QUFDeEIsSUFBSSxvREFBSTtBQUNSLElBQUksb0RBQUk7QUFDUjtBQUNBOztBQUVBO0FBQ0EsRUFBRSxvREFBSztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvREFBSTtBQUNaLGdCQUFnQixvREFBSTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxFQUFFLG9EQUFJO0FBQ04sTUFBTSxvREFBSyxzQkFBc0I7QUFDakMsZ0JBQWdCLG9EQUFJLHFCQUFxQixvREFBSztBQUM5QztBQUNBLDRCQUE0QixvREFBSTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBLGNBQWMsb0RBQUk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLFFBQVE7QUFDUjtBQUNBLEVBQUUsb0RBQUksdUJBQXVCLG9EQUFLLGFBQWEsb0RBQUs7QUFDcEQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3REFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQsa0RBQVU7O0FBRUs7QUFDZjtBQUNBLEMiLCJmaWxlIjoibWFpbl93aW5kb3cuMmNkM2IzNjE3ZTVlNzQzNmQxNDcuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vbXZjX3ZpZXcuanMnO1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9tdmNfbW9kZWwuanMnO1xyXG5pbXBvcnQgU3BsaXQgZnJvbSAnc3BsaXQuanMnO1xyXG5pbXBvcnQgTWljcm9Nb2RhbCBmcm9tICdtaWNyb21vZGFsJztcclxuaW1wb3J0IE1pcnJvciBmcm9tICcuL21pcnJvcic7XHJcblxyXG4vL01pcnJvci5zZXRTdG9yZShNb2RlbC5zdG9yZSk7XHJcblxyXG5sZXQgcmVuZGVyS2V5TWFwID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGlzRW1wdHkgPSBWaWV3LmlzRW1wdHk7XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlZ2FyZGluZyBzZWxlY3Rpb24gb2YgYSBnYWxsZXJ5IGl0ZW1cclxuICovXHJcbnZhciBzZWxlY3RlZCA9IHtcclxuICBpdGVtOiBudWxsLFxyXG4gIHNldCBzZWxlY3RJdGVtKG0pe1xyXG4gICAgICBpZiAodGhpcy5pdGVtICE9IG51bGwgfHwgdGhpcy5pdGVtICE9IHVuZGVmaW5lZCkgdGhpcy5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgIG0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIHRoaXMuaXRlbSA9IG07XHJcbiAgfSxcclxuICBnZXQgaW5kZXgoKXtcclxuICAgIGlmICghdGhpcy5pdGVtKSByZXR1cm4gLTE7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtLmdldEF0dHJpYnV0ZSgnaW5kZXgnKTtcclxuICB9XHJcbn07XHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxyXG49PT09PT09PT09PT09PT09IElOSVQgPT09PT09PT09PT09PT0gXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxubGV0IHRvb2xiYXJGb3JtID0gVmlldy50b29sYmFyLmluaXQoTW9kZWwubG9hZC50b29sYmFySW5pdCgpKTtcclxuICAgIC8qIGV2ZW50IFJlZ2lzdHJhdGlvbiBmb3IgPFNlbGVjdD4gKi9cclxubGV0IG9uQ2hhbmdlVG9vbGJhciA9IChlLCBwcm9wTmFtZSkgPT4ge1xyXG4gIHRyeXtcclxuICAgIE1vZGVsLnNhdmUudG9vbGJhcihwcm9wTmFtZSwgZS50YXJnZXQudmFsdWUpO1xyXG4gICAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcbiAgfSBjYXRjaChlcnJvcil7XHJcbiAgICAvL1RPRE8gd2FybmluZ1xyXG4gICAgZS50YXJnZXQudmFsdWUgPSBNb2RlbC5sb2FkLnRvb2xiYXJbcHJvcE5hbWVdO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbiAgbGV0IHVwZGF0ZVBhZ2VzID0gKGV2ZW50KSA9PiB7XHJcbiAgICBsZXQgYXR0ciA9IGV2ZW50LnRhcmdldC5uYW1lO1xyXG4gICAgbGV0IG5ld1ZhbCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIE1vZGVsLnNhdmUudG9vbGJhcihhdHRyLCBuZXdWYWwpO1xyXG4gICAgbGV0IHBhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BhZ2UnKTtcclxuICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcGFnZXMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgcGFnZXNbcF0uc2V0QXR0cmlidXRlKGF0dHIsIG5ld1ZhbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgIHNlbGVjdHM6IFtzdGFydE1vbnRoLCBlbmRNb250aCwgZm9ybWF0TW9kZSwgc2l6ZSwgbGF5b3V0XSxcclxuICAgIGlucHV0czogW3N0YXJ0WWVhciwgZW5kWWVhcl0sXHJcbiAgKi9cclxuICBmb3IgKGxldCBzID0gMDsgcyA8IDM7IHMrKykge1xyXG4gICAgdG9vbGJhckZvcm0uc2VsZWN0c1tzXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtvbkNoYW5nZVRvb2xiYXIoZSwgdG9vbGJhckZvcm0uc2VsZWN0c1tzXS5uYW1lKX0pO1xyXG4gIH1cclxuICB0b29sYmFyRm9ybS5zZWxlY3RzWzNdLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdXBkYXRlUGFnZXMoZSk7XHJcbiAgfSk7XHJcbiAgdG9vbGJhckZvcm0uc2VsZWN0c1s0XS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtcclxuICAgIHVwZGF0ZVBhZ2VzKGUpO1xyXG4gIH0pO1xyXG4gIC8vIGZvciAobGV0IGkgaW4gdG9vbGJhckZvcm0uaW5wdXRzKSB7XHJcbiAgLy8gICB0b29sYmFyRm9ybS5pbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7b25DaGFuZ2VUb29sYmFyKGUsIHRvb2xiYXJGb3JtLmlucHV0c1tpXS5uYW1lKX0pO1xyXG4gIC8vIH1cclxuXHJcbiAgbGV0IHN0YXJ0eWVhciA9IFtcclxuICAgIF9fcmVuZGVyR2FsbGVyeSgpXHJcbiAgXVxyXG5cclxuICAvL01pcnJvci5TVE9SRVdBVENILnNldCgnc3RhcnR5ZWFyJywgc3RhcnR5ZWFyKTtcclxuXHJcbiAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcblxyXG4gIE1vZGVsLmxvYWQubWVkaWFJbml0KCk7XHJcblxyXG5cclxuLyogXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbj09PT09PT09IEZpbGUgVXBsb2FkIHJlZ2lzdHJhdGlvblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4qL1xyXG5cclxuXHJcbmxldCB1cGxvYWRNdWx0aXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGxvYWQtbXVsdGlwbGUnKTtcclxuXHJcbmxldCBtZWRpYVVwbG9hZEhhbmRsZXIgPSAoZXZlbnQsIGF0SW5kZXgpID0+IHtcclxuICBpZiAoYXRJbmRleCA9PSAtMSkge1xyXG4gICAgTW9kZWwuc2F2ZS5jb3ZlcihldmVudC50YXJnZXQuZmlsZXNbMF0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBNb2RlbC5zYXZlLmdhbGxlcnlNZWRpYShldmVudC50YXJnZXQuZmlsZXNbMF0sIGF0SW5kZXgpO1xyXG4gIH1cclxuICAvL19fcmVuZGVyR2FsbGVyeSgpO1xyXG59XHJcblxyXG51cGxvYWRNdWx0aXBsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtcclxuICBtZWRpYVVwbG9hZEhhbmRsZXIoZSk7XHJcbiAgICBfX3JlbmRlckdhbGxlcnkoKTtcclxuICB9KTtcclxuVmlldy51cGxvYWRlci5zaW5nbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSkge1xyXG4gIG1lZGlhVXBsb2FkSGFuZGxlcihlLCBzZWxlY3RlZC5pbmRleClcclxufSlcclxuXHJcblxyXG4vKiAtLS0tIC0tLS0tLSAtLS0tLSAtIFJlbmRlciBzdHVmZlxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxubGV0IF9fcmVuZGVySW5Xb3Jrc3BhY2UgPSB7XHJcbiAgY2FsZW5kYXIoKXtcclxuICAgIC8vIGxldCBpbmRleCA9IHNlbGVjdGVkLmluZGV4O1xyXG4gICAgLy8gbGV0IGltZ1NyYyA9IE1vZGVsLmxvYWQubWVkaWEoaW5kZXgpLnBhdGg7XHJcbiAgICAvLyBWaWV3LmdhbGxlcnkudXBkYXRlSXRlbUltYWdlKGluZGV4LCBpbWdTcmMpO1xyXG4gICAgLy8gY29uc3QgcmV0cmlldmUgPSBNb2RlbC53b3Jrc3BhY2U7XHJcbiAgICAvLyBWaWV3LndvcmtzcGFjZS5jcmVhdGVDYWxlbmRhcihcclxuICAgIC8vICAgTW9kZWwubG9hZC5nYWxsZXJ5UGFuZWxJdGVtKGluZGV4KS5tb250aCxcclxuICAgIC8vICAgTW9kZWwubG9hZC5nYWxsZXJ5UGFuZWxJdGVtKGluZGV4KS55ZWFyLFxyXG4gICAgLy8gICByZXRyaWV2ZS5wYXBlclNpemUsXHJcbiAgICAvLyAgIHJldHJpZXZlLnBhcGVyTGF5b3V0LFxyXG4gICAgLy8gICByZXRyaWV2ZS5mb3JtYXRNb2RlLFxyXG4gICAgLy8gICBpbWdTcmMpO1xyXG4gIH0sXHJcbiAgY292ZXJQYWdlKCl7XHJcbiAgICBsZXQgcmV0cmlldmUgPSBNb2RlbC53b3Jrc3BhY2U7XHJcbiAgICBWaWV3LmdhbGxlcnkudXBkYXRlQ292ZXIocmV0cmlldmUuY292ZXIpO1xyXG4gICAgVmlldy53b3Jrc3BhY2UucmVuZGVyQ292ZXIocmV0cmlldmUucGFwZXJTaXplLCByZXRyaWV2ZS5wYXBlckxheW91dCwgcmV0cmlldmUuY292ZXIpO1xyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gX19yZW5kZXJHYWxsZXJ5KCl7XHJcbiAgTW9kZWwuZ2FsbGVyeS5nZW5lcmF0ZUl0ZW1zKCk7XHJcbiAgbGV0IGhhbmRsZXIgPSAoZWxlKSA9PiB7XHJcbiAgICBzZWxlY3RlZC5zZWxlY3RJdGVtID0gZWxlO1xyXG4gICAgaWYgKGVsZS5jaGlsZHJlblswXS5jbGFzc0xpc3QuY29udGFpbnMoJ3BsYWNlaG9sZGVyJykpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xyXG4gICAgICAgIFZpZXcudXBsb2FkZXIub3BlblNpbmdsZUJyb3dzZXIoKTtcclxuICAgICAgICBsZXQgdSA9IFZpZXcudXBsb2FkZXIuc2luZ2xlO1xyXG4gICAgICAgICAgdS5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYodS5maWxlcy5sZW5ndGggIT0gdW5kZWZpbmVkICYmIHUuZmlsZXMubGVuZ3RoICE9IG51bGwgJiYgdS5maWxlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcclxuICAgICAgICAgICAgICB1LnZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICByZWplY3QoZmFsc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgIH0pXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBWaWV3LmdhbGxlcnkuY2xlYXJQYW5lbCgpO1xyXG4gIGlmIChNb2RlbC5nYWxsZXJ5Lm5lZWRzQ292ZXIpIHsgLy8gQ292ZXJycnJycnJycnJycnJycnJycnJycnJycnJyclxyXG4gICAgbGV0IGNvdmVyID0gVmlldy5nYWxsZXJ5Lmluc2VydENvdmVyKE1vZGVsLmxvYWQuY292ZXIpO1xyXG4gICAgY292ZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICBsZXQgcHJvbWlzZSA9IGhhbmRsZXIoVmlldy5nYWxsZXJ5LnJvb3QuY2hpbGRyZW5bMF0pO1xyXG4gICAgICBpZiAoaXNFbXB0eShwcm9taXNlKSkgcmV0dXJuO1xyXG4gICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIF9fcmVuZGVySW5Xb3Jrc3BhY2UuY292ZXJQYWdlKCk7XHJcbiAgICAgIH0pXHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGxldCBJdGVtcyA9IFZpZXcuZ2FsbGVyeS5yZW5kZXJQYW5lbCgpO1xyXG4gIC8vIGZvciAobGV0IGkgaW4gSXRlbXMpIHtcclxuICAvLyAgIEl0ZW1zW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAvLyAgICAgbGV0IHByb21pc2UgPSBoYW5kbGVyKEl0ZW1zW2ldKTtcclxuICAvLyAgICAgaWYgKGlzRW1wdHkocHJvbWlzZSkpIHJldHVybjtcclxuICAvLyAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAvLyAgICAgICBfX3JlbmRlckluV29ya3NwYWNlLmNhbGVuZGFyKCk7XHJcbiAgLy8gICAgIH0pXHJcbiAgLy8gICB9KTtcclxuICAvLyB9XHJcbiAgVmlldy51cGxvYWRlci5yZW5kZXJCdWZmZXIoTW9kZWwubG9hZC5tZWRpYSwgTW9kZWwuZ2FsbGVyeS50b3RhbE1vbnRocyk7XHJcbn1cclxuXHJcblxyXG4vKiogR2xvYmFsIEV2ZW50cyBvbiB3aW5kb3cgT2JqZWN0Ki9cclxuZnVuY3Rpb24gcmVnaXN0ZXIoZXZlbnROYW1lLCBoYW5kbGVyKXtcclxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIGhhbmRsZXIpO1xyXG59XHJcblxyXG5yZWdpc3Rlcignd2Fybl9pbnZhbGlkJywgZnVuY3Rpb24oZSl7XHJcbiAgY29uc29sZS5sb2coJ0ludmFsaWQgZGF0ZSByYW5nZScpO1xyXG59KVxyXG5cclxuXHJcbi8qID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuPT09PT09PT09ICAgIEludGVyYWN0aW9uXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbi8vUGFuZWwgcmVzaXplclxyXG5TcGxpdChbJyN1cGxvYWRlcicsICcjZ2FsbGVyeS1wYW5lbCcsJyN3b3Jrc3BhY2UnLCAnI3Byb3BlcnRpZXMtcGFuZWwnXSwge1xyXG4gIG1pblNpemU6MSxcclxuICBzaXplczpbMTAsIDEwLCA2NSwgMTVdLCAvLyBtdXN0IGFkZCB1cCB0byAxMDAgKCUpXHJcbiAgZ3V0dGVyU2l6ZTogOCxcclxufSk7XHJcblxyXG5NaWNyb01vZGFsLmluaXQoKTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IHtcclxuICBfX3JlbmRlckdhbGxlcnksXHJcbn0iXSwic291cmNlUm9vdCI6IiJ9