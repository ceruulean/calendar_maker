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
let toolbarForm = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].toolbar.init(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.toolbarInit());
    /* event Registration for <Select> */
let onChangeToolbar = (e, propName) => {
  try{
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].save.toolbar(propName, e.target.value);
    __renderGallery();
  } catch(error){
    //TODO warning
    e.target.value = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.toolbar[propName];
  }

}

  let updatePages = (event) => {
    let attr = event.target.name;
    let newVal = event.target.value;
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].save.toolbar(attr, newVal);
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

  _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.mediaInit();


/* 
=========================================
======== File Upload registration
=========================================
*/


let uploadMultiple = document.getElementById('upload-multiple');

let mediaUploadHandler = (event, atIndex) => {
  if (atIndex == -1) {
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].save.cover(event.target.files[0]);
  } else {
    console.log(event.target.files[0]);
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].save.galleryMedia(event.target.files[0], atIndex);
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
    let index = selected.index;
    let imgSrc = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.media(index).path;
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.updateItemImage(index, imgSrc);
    const retrieve = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].workspace;
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].workspace.createCalendar(
      _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.galleryPanelItem(index).month,
      _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.galleryPanelItem(index).year,
      retrieve.paperSize,
      retrieve.paperLayout,
      retrieve.formatMode,
      imgSrc);
  },
  coverPage(){
    let retrieve = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].workspace;
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.updateCover(retrieve.cover);
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].workspace.renderCover(retrieve.paperSize, retrieve.paperLayout, retrieve.cover);
  }
}

function __renderGallery(){
  _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].gallery.generateItems();
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
  if (_mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].gallery.needsCover) { // Coverrrrrrrrrrrrrrrrrrrrrrrrrrr
    let cover = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.insertCover(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.cover);
    cover.addEventListener('click', function(){
      let promise = handler(_mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.root.children[0]);
      if (isEmpty(promise)) return;
      promise.then(() => {
        __renderInWorkspace.coverPage();
      })
    });
  }

  let Items = _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.renderPanel();
  for (let i in Items) {
    Items[i].addEventListener('click', function(){
      let promise = handler(Items[i]);
      if (isEmpty(promise)) return;
      promise.then(() => {
        __renderInWorkspace.calendar();
      })
    });
  }
  _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].uploader.renderBuffer(_mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].load.media, _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].gallery.totalMonths);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbXZjX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFpQztBQUNFO0FBQ047QUFDTztBQUNOOztBQUU5Qjs7QUFFQTs7QUFFQSxjQUFjLG9EQUFJOzs7QUFHbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFJLGNBQWMscURBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxREFBSztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0EscUJBQXFCLHFEQUFLO0FBQzFCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUkscURBQUs7QUFDVDtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsa0VBQWtFLGdEQUFnRDtBQUNsSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG9FQUFvRSwrQ0FBK0M7QUFDbkg7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLEVBQUUscURBQUs7OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLHFEQUFLO0FBQ1QsR0FBRztBQUNIO0FBQ0EsSUFBSSxxREFBSztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsb0RBQUk7QUFDSjtBQUNBLENBQUM7OztBQUdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLHFEQUFLO0FBQ3RCLElBQUksb0RBQUk7QUFDUixxQkFBcUIscURBQUs7QUFDMUIsSUFBSSxvREFBSTtBQUNSLE1BQU0scURBQUs7QUFDWCxNQUFNLHFEQUFLO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxtQkFBbUIscURBQUs7QUFDeEIsSUFBSSxvREFBSTtBQUNSLElBQUksb0RBQUk7QUFDUjtBQUNBOztBQUVBO0FBQ0EsRUFBRSxxREFBSztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvREFBSTtBQUNaLGdCQUFnQixvREFBSTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxFQUFFLG9EQUFJO0FBQ04sTUFBTSxxREFBSyxzQkFBc0I7QUFDakMsZ0JBQWdCLG9EQUFJLHFCQUFxQixxREFBSztBQUM5QztBQUNBLDRCQUE0QixvREFBSTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBLGNBQWMsb0RBQUk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLEVBQUUsb0RBQUksdUJBQXVCLHFEQUFLLGFBQWEscURBQUs7QUFDcEQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3REFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQsa0RBQVU7O0FBRUs7QUFDZjtBQUNBLEMiLCJmaWxlIjoibWFpbl93aW5kb3cuMTAyZmM4ZTM2YTFjMjFmOGU0ZjQuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vbXZjX3ZpZXcuanMnO1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9tdmNfbW9kZWwuanMnO1xyXG5pbXBvcnQgU3BsaXQgZnJvbSAnc3BsaXQuanMnO1xyXG5pbXBvcnQgTWljcm9Nb2RhbCBmcm9tICdtaWNyb21vZGFsJztcclxuaW1wb3J0IE1pcnJvciBmcm9tICcuL21pcnJvcic7XHJcblxyXG4vL01pcnJvci5zZXRTdG9yZShNb2RlbC5zdG9yZSk7XHJcblxyXG5sZXQgcmVuZGVyS2V5TWFwID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGlzRW1wdHkgPSBWaWV3LmlzRW1wdHk7XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlZ2FyZGluZyBzZWxlY3Rpb24gb2YgYSBnYWxsZXJ5IGl0ZW1cclxuICovXHJcbnZhciBzZWxlY3RlZCA9IHtcclxuICBpdGVtOiBudWxsLFxyXG4gIHNldCBzZWxlY3RJdGVtKG0pe1xyXG4gICAgICBpZiAodGhpcy5pdGVtICE9IG51bGwgfHwgdGhpcy5pdGVtICE9IHVuZGVmaW5lZCkgdGhpcy5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgIG0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIHRoaXMuaXRlbSA9IG07XHJcbiAgfSxcclxuICBnZXQgaW5kZXgoKXtcclxuICAgIGlmICghdGhpcy5pdGVtKSByZXR1cm4gLTE7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtLmdldEF0dHJpYnV0ZSgnaW5kZXgnKTtcclxuICB9XHJcbn07XHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxyXG49PT09PT09PT09PT09PT09IElOSVQgPT09PT09PT09PT09PT0gXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxubGV0IHRvb2xiYXJGb3JtID0gVmlldy50b29sYmFyLmluaXQoTW9kZWwubG9hZC50b29sYmFySW5pdCgpKTtcclxuICAgIC8qIGV2ZW50IFJlZ2lzdHJhdGlvbiBmb3IgPFNlbGVjdD4gKi9cclxubGV0IG9uQ2hhbmdlVG9vbGJhciA9IChlLCBwcm9wTmFtZSkgPT4ge1xyXG4gIHRyeXtcclxuICAgIE1vZGVsLnNhdmUudG9vbGJhcihwcm9wTmFtZSwgZS50YXJnZXQudmFsdWUpO1xyXG4gICAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcbiAgfSBjYXRjaChlcnJvcil7XHJcbiAgICAvL1RPRE8gd2FybmluZ1xyXG4gICAgZS50YXJnZXQudmFsdWUgPSBNb2RlbC5sb2FkLnRvb2xiYXJbcHJvcE5hbWVdO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbiAgbGV0IHVwZGF0ZVBhZ2VzID0gKGV2ZW50KSA9PiB7XHJcbiAgICBsZXQgYXR0ciA9IGV2ZW50LnRhcmdldC5uYW1lO1xyXG4gICAgbGV0IG5ld1ZhbCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIE1vZGVsLnNhdmUudG9vbGJhcihhdHRyLCBuZXdWYWwpO1xyXG4gICAgbGV0IHBhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BhZ2UnKTtcclxuICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcGFnZXMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgcGFnZXNbcF0uc2V0QXR0cmlidXRlKGF0dHIsIG5ld1ZhbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgIHNlbGVjdHM6IFtzdGFydE1vbnRoLCBlbmRNb250aCwgZm9ybWF0TW9kZSwgc2l6ZSwgbGF5b3V0XSxcclxuICAgIGlucHV0czogW3N0YXJ0WWVhciwgZW5kWWVhcl0sXHJcbiAgKi9cclxuICBmb3IgKGxldCBzID0gMDsgcyA8IDM7IHMrKykge1xyXG4gICAgdG9vbGJhckZvcm0uc2VsZWN0c1tzXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtvbkNoYW5nZVRvb2xiYXIoZSwgdG9vbGJhckZvcm0uc2VsZWN0c1tzXS5uYW1lKX0pO1xyXG4gIH1cclxuICB0b29sYmFyRm9ybS5zZWxlY3RzWzNdLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdXBkYXRlUGFnZXMoZSk7XHJcbiAgfSk7XHJcbiAgdG9vbGJhckZvcm0uc2VsZWN0c1s0XS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtcclxuICAgIHVwZGF0ZVBhZ2VzKGUpO1xyXG4gIH0pO1xyXG4gIC8vIGZvciAobGV0IGkgaW4gdG9vbGJhckZvcm0uaW5wdXRzKSB7XHJcbiAgLy8gICB0b29sYmFyRm9ybS5pbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7b25DaGFuZ2VUb29sYmFyKGUsIHRvb2xiYXJGb3JtLmlucHV0c1tpXS5uYW1lKX0pO1xyXG4gIC8vIH1cclxuXHJcbiAgbGV0IHN0YXJ0eWVhciA9IFtcclxuICAgIF9fcmVuZGVyR2FsbGVyeSgpXHJcbiAgXVxyXG5cclxuICAvL01pcnJvci5TVE9SRVdBVENILnNldCgnc3RhcnR5ZWFyJywgc3RhcnR5ZWFyKTtcclxuXHJcbiAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcblxyXG4gIE1vZGVsLmxvYWQubWVkaWFJbml0KCk7XHJcblxyXG5cclxuLyogXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbj09PT09PT09IEZpbGUgVXBsb2FkIHJlZ2lzdHJhdGlvblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4qL1xyXG5cclxuXHJcbmxldCB1cGxvYWRNdWx0aXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGxvYWQtbXVsdGlwbGUnKTtcclxuXHJcbmxldCBtZWRpYVVwbG9hZEhhbmRsZXIgPSAoZXZlbnQsIGF0SW5kZXgpID0+IHtcclxuICBpZiAoYXRJbmRleCA9PSAtMSkge1xyXG4gICAgTW9kZWwuc2F2ZS5jb3ZlcihldmVudC50YXJnZXQuZmlsZXNbMF0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmxvZyhldmVudC50YXJnZXQuZmlsZXNbMF0pO1xyXG4gICAgTW9kZWwuc2F2ZS5nYWxsZXJ5TWVkaWEoZXZlbnQudGFyZ2V0LmZpbGVzWzBdLCBhdEluZGV4KTtcclxuICB9XHJcbiAgLy9fX3JlbmRlckdhbGxlcnkoKTtcclxufVxyXG5cclxudXBsb2FkTXVsdGlwbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7XHJcbiAgbWVkaWFVcGxvYWRIYW5kbGVyKGUpO1xyXG4gICAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcbiAgfSk7XHJcblZpZXcudXBsb2FkZXIuc2luZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICBtZWRpYVVwbG9hZEhhbmRsZXIoZSwgc2VsZWN0ZWQuaW5kZXgpXHJcbn0pXHJcblxyXG5cclxuLyogLS0tLSAtLS0tLS0gLS0tLS0gLSBSZW5kZXIgc3R1ZmZcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmxldCBfX3JlbmRlckluV29ya3NwYWNlID0ge1xyXG4gIGNhbGVuZGFyKCl7XHJcbiAgICBsZXQgaW5kZXggPSBzZWxlY3RlZC5pbmRleDtcclxuICAgIGxldCBpbWdTcmMgPSBNb2RlbC5sb2FkLm1lZGlhKGluZGV4KS5wYXRoO1xyXG4gICAgVmlldy5nYWxsZXJ5LnVwZGF0ZUl0ZW1JbWFnZShpbmRleCwgaW1nU3JjKTtcclxuICAgIGNvbnN0IHJldHJpZXZlID0gTW9kZWwud29ya3NwYWNlO1xyXG4gICAgVmlldy53b3Jrc3BhY2UuY3JlYXRlQ2FsZW5kYXIoXHJcbiAgICAgIE1vZGVsLmxvYWQuZ2FsbGVyeVBhbmVsSXRlbShpbmRleCkubW9udGgsXHJcbiAgICAgIE1vZGVsLmxvYWQuZ2FsbGVyeVBhbmVsSXRlbShpbmRleCkueWVhcixcclxuICAgICAgcmV0cmlldmUucGFwZXJTaXplLFxyXG4gICAgICByZXRyaWV2ZS5wYXBlckxheW91dCxcclxuICAgICAgcmV0cmlldmUuZm9ybWF0TW9kZSxcclxuICAgICAgaW1nU3JjKTtcclxuICB9LFxyXG4gIGNvdmVyUGFnZSgpe1xyXG4gICAgbGV0IHJldHJpZXZlID0gTW9kZWwud29ya3NwYWNlO1xyXG4gICAgVmlldy5nYWxsZXJ5LnVwZGF0ZUNvdmVyKHJldHJpZXZlLmNvdmVyKTtcclxuICAgIFZpZXcud29ya3NwYWNlLnJlbmRlckNvdmVyKHJldHJpZXZlLnBhcGVyU2l6ZSwgcmV0cmlldmUucGFwZXJMYXlvdXQsIHJldHJpZXZlLmNvdmVyKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fcmVuZGVyR2FsbGVyeSgpe1xyXG4gIE1vZGVsLmdhbGxlcnkuZ2VuZXJhdGVJdGVtcygpO1xyXG4gIGxldCBoYW5kbGVyID0gKGVsZSkgPT4ge1xyXG4gICAgc2VsZWN0ZWQuc2VsZWN0SXRlbSA9IGVsZTtcclxuICAgIGlmIChlbGUuY2hpbGRyZW5bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWhvbGRlcicpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcclxuICAgICAgICBWaWV3LnVwbG9hZGVyLm9wZW5TaW5nbGVCcm93c2VyKCk7XHJcbiAgICAgICAgbGV0IHUgPSBWaWV3LnVwbG9hZGVyLnNpbmdsZTtcclxuICAgICAgICAgIHUub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHUuZmlsZXMubGVuZ3RoICE9IHVuZGVmaW5lZCAmJiB1LmZpbGVzLmxlbmd0aCAhPSBudWxsICYmIHUuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdS52YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgVmlldy5nYWxsZXJ5LmNsZWFyUGFuZWwoKTtcclxuICBpZiAoTW9kZWwuZ2FsbGVyeS5uZWVkc0NvdmVyKSB7IC8vIENvdmVycnJycnJycnJycnJycnJycnJycnJycnJycnJcclxuICAgIGxldCBjb3ZlciA9IFZpZXcuZ2FsbGVyeS5pbnNlcnRDb3ZlcihNb2RlbC5sb2FkLmNvdmVyKTtcclxuICAgIGNvdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgbGV0IHByb21pc2UgPSBoYW5kbGVyKFZpZXcuZ2FsbGVyeS5yb290LmNoaWxkcmVuWzBdKTtcclxuICAgICAgaWYgKGlzRW1wdHkocHJvbWlzZSkpIHJldHVybjtcclxuICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICBfX3JlbmRlckluV29ya3NwYWNlLmNvdmVyUGFnZSgpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgSXRlbXMgPSBWaWV3LmdhbGxlcnkucmVuZGVyUGFuZWwoKTtcclxuICBmb3IgKGxldCBpIGluIEl0ZW1zKSB7XHJcbiAgICBJdGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCBwcm9taXNlID0gaGFuZGxlcihJdGVtc1tpXSk7XHJcbiAgICAgIGlmIChpc0VtcHR5KHByb21pc2UpKSByZXR1cm47XHJcbiAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgX19yZW5kZXJJbldvcmtzcGFjZS5jYWxlbmRhcigpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFZpZXcudXBsb2FkZXIucmVuZGVyQnVmZmVyKE1vZGVsLmxvYWQubWVkaWEsIE1vZGVsLmdhbGxlcnkudG90YWxNb250aHMpO1xyXG59XHJcblxyXG5cclxuLyoqIEdsb2JhbCBFdmVudHMgb24gd2luZG93IE9iamVjdCovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyKGV2ZW50TmFtZSwgaGFuZGxlcil7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcclxufVxyXG5cclxucmVnaXN0ZXIoJ3dhcm5faW52YWxpZCcsIGZ1bmN0aW9uKGUpe1xyXG4gIGNvbnNvbGUubG9nKCdJbnZhbGlkIGRhdGUgcmFuZ2UnKTtcclxufSlcclxuXHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbj09PT09PT09PSAgICBJbnRlcmFjdGlvblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4vL1BhbmVsIHJlc2l6ZXJcclxuU3BsaXQoWycjdXBsb2FkZXInLCAnI2dhbGxlcnktcGFuZWwnLCcjd29ya3NwYWNlJywgJyNwcm9wZXJ0aWVzLXBhbmVsJ10sIHtcclxuICBtaW5TaXplOjEsXHJcbiAgc2l6ZXM6WzEwLCAxMCwgNjUsIDE1XSwgLy8gbXVzdCBhZGQgdXAgdG8gMTAwICglKVxyXG4gIGd1dHRlclNpemU6IDgsXHJcbn0pO1xyXG5cclxuTWljcm9Nb2RhbC5pbml0KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgX19yZW5kZXJHYWxsZXJ5LFxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==