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
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.save.media(event.target.files, atIndex);
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
    let imgSrc = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.media(index).path;
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].gallery.updateItemImage(index, imgSrc);
    const retrieve = _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.workspace;
    _mvc_view_js__WEBPACK_IMPORTED_MODULE_0__["default"].workspace.createCalendar(
      _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.galleryPanelItem(index).month,
      _mvc_model_js__WEBPACK_IMPORTED_MODULE_1___default.a.load.galleryPanelItem(index).year,
      retrieve.paperSize,
      retrieve.paperLayout,
      retrieve.formatMode,
      imgSrc);
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
  for (let i in Items) {
    Items[i].addEventListener('click', function(){
      let promise = handler(Items[i]);
      if (isEmpty(promise)) return;
      promise.then(() => {
        __renderInWorkspace.calendar();
      })
    });
  }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbXZjX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQWlDO0FBQ0U7QUFDTjtBQUNPO0FBQ047O0FBRTlCOztBQUVBOztBQUVBLGNBQWMsb0RBQUk7OztBQUdsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0Isb0RBQUksY0FBYyxvREFBSztBQUN6QztBQUNBO0FBQ0E7QUFDQSxJQUFJLG9EQUFLO0FBQ1Q7QUFDQSxHQUFHO0FBQ0g7QUFDQSxxQkFBcUIsb0RBQUs7QUFDMUI7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsSUFBSSxvREFBSztBQUNUO0FBQ0EsbUJBQW1CLGtCQUFrQjtBQUNyQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QixrRUFBa0UsZ0RBQWdEO0FBQ2xIO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0Esb0VBQW9FLCtDQUErQztBQUNuSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUEsRUFBRSxvREFBSzs7O0FBR1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBLElBQUksb0RBQUs7QUFDVCxHQUFHO0FBQ0gsSUFBSSxvREFBSztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsb0RBQUk7QUFDSjtBQUNBLENBQUM7OztBQUdEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLG9EQUFLO0FBQ3RCLElBQUksb0RBQUk7QUFDUixxQkFBcUIsb0RBQUs7QUFDMUIsSUFBSSxvREFBSTtBQUNSLE1BQU0sb0RBQUs7QUFDWCxNQUFNLG9EQUFLO0FBQ1g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxtQkFBbUIsb0RBQUs7QUFDeEIsSUFBSSxvREFBSTtBQUNSLElBQUksb0RBQUk7QUFDUjtBQUNBOztBQUVBO0FBQ0EsRUFBRSxvREFBSztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsUUFBUSxvREFBSTtBQUNaLGdCQUFnQixvREFBSTtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQSxFQUFFLG9EQUFJO0FBQ04sTUFBTSxvREFBSyxzQkFBc0I7QUFDakMsZ0JBQWdCLG9EQUFJLHFCQUFxQixvREFBSztBQUM5QztBQUNBLDRCQUE0QixvREFBSTtBQUNoQztBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBLGNBQWMsb0RBQUk7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBLEVBQUUsb0RBQUksdUJBQXVCLG9EQUFLLGFBQWEsb0RBQUs7QUFDcEQ7OztBQUdBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3REFBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQsa0RBQVU7O0FBRUs7QUFDZjtBQUNBLEMiLCJmaWxlIjoibWFpbl93aW5kb3cuODdhNzI4YjE1YzQ5ZTc2NjU2ZWQuaG90LXVwZGF0ZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBWaWV3IGZyb20gJy4vbXZjX3ZpZXcuanMnO1xyXG5pbXBvcnQgTW9kZWwgZnJvbSAnLi9tdmNfbW9kZWwuanMnO1xyXG5pbXBvcnQgU3BsaXQgZnJvbSAnc3BsaXQuanMnO1xyXG5pbXBvcnQgTWljcm9Nb2RhbCBmcm9tICdtaWNyb21vZGFsJztcclxuaW1wb3J0IE1pcnJvciBmcm9tICcuL21pcnJvcic7XHJcblxyXG4vL01pcnJvci5zZXRTdG9yZShNb2RlbC5zdG9yZSk7XHJcblxyXG5sZXQgcmVuZGVyS2V5TWFwID0gbmV3IE1hcCgpO1xyXG5cclxubGV0IGlzRW1wdHkgPSBWaWV3LmlzRW1wdHk7XHJcblxyXG5cclxuLyoqXHJcbiAqIFJlZ2FyZGluZyBzZWxlY3Rpb24gb2YgYSBnYWxsZXJ5IGl0ZW1cclxuICovXHJcbnZhciBzZWxlY3RlZCA9IHtcclxuICBpdGVtOiBudWxsLFxyXG4gIHNldCBzZWxlY3RJdGVtKG0pe1xyXG4gICAgICBpZiAodGhpcy5pdGVtICE9IG51bGwgfHwgdGhpcy5pdGVtICE9IHVuZGVmaW5lZCkgdGhpcy5pdGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XHJcbiAgICAgIG0uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcclxuICAgIHRoaXMuaXRlbSA9IG07XHJcbiAgfSxcclxuICBnZXQgaW5kZXgoKXtcclxuICAgIGlmICghdGhpcy5pdGVtKSByZXR1cm4gLTE7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtLmdldEF0dHJpYnV0ZSgnaW5kZXgnKTtcclxuICB9XHJcbn07XHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IFxyXG49PT09PT09PT09PT09PT09IElOSVQgPT09PT09PT09PT09PT0gXHJcbi0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tKi9cclxubGV0IHRvb2xiYXJGb3JtID0gVmlldy50b29sYmFyLmluaXQoTW9kZWwubG9hZC50b29sYmFySW5pdCgpKTtcclxuICAgIC8qIGV2ZW50IFJlZ2lzdHJhdGlvbiBmb3IgPFNlbGVjdD4gKi9cclxubGV0IG9uQ2hhbmdlVG9vbGJhciA9IChlLCBwcm9wTmFtZSkgPT4ge1xyXG4gIHRyeXtcclxuICAgIE1vZGVsLnNhdmUudG9vbGJhcihwcm9wTmFtZSwgZS50YXJnZXQudmFsdWUpO1xyXG4gICAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcbiAgfSBjYXRjaChlcnJvcil7XHJcbiAgICAvL1RPRE8gd2FybmluZ1xyXG4gICAgZS50YXJnZXQudmFsdWUgPSBNb2RlbC5sb2FkLnRvb2xiYXJbcHJvcE5hbWVdO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbiAgbGV0IHVwZGF0ZVBhZ2VzID0gKGV2ZW50KSA9PiB7XHJcbiAgICBsZXQgYXR0ciA9IGV2ZW50LnRhcmdldC5uYW1lO1xyXG4gICAgbGV0IG5ld1ZhbCA9IGV2ZW50LnRhcmdldC52YWx1ZTtcclxuICAgIE1vZGVsLnNhdmUudG9vbGJhcihhdHRyLCBuZXdWYWwpO1xyXG4gICAgbGV0IHBhZ2VzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ3BhZ2UnKTtcclxuICAgIGZvciAobGV0IHAgPSAwOyBwIDwgcGFnZXMubGVuZ3RoOyBwKyspIHtcclxuICAgICAgcGFnZXNbcF0uc2V0QXR0cmlidXRlKGF0dHIsIG5ld1ZhbCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgIHNlbGVjdHM6IFtzdGFydE1vbnRoLCBlbmRNb250aCwgZm9ybWF0TW9kZSwgc2l6ZSwgbGF5b3V0XSxcclxuICAgIGlucHV0czogW3N0YXJ0WWVhciwgZW5kWWVhcl0sXHJcbiAgKi9cclxuICBmb3IgKGxldCBzID0gMDsgcyA8IDM7IHMrKykge1xyXG4gICAgdG9vbGJhckZvcm0uc2VsZWN0c1tzXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtvbkNoYW5nZVRvb2xiYXIoZSwgdG9vbGJhckZvcm0uc2VsZWN0c1tzXS5uYW1lKX0pO1xyXG4gIH1cclxuICB0b29sYmFyRm9ybS5zZWxlY3RzWzNdLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpe1xyXG4gICAgdXBkYXRlUGFnZXMoZSk7XHJcbiAgfSk7XHJcbiAgdG9vbGJhckZvcm0uc2VsZWN0c1s0XS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtcclxuICAgIHVwZGF0ZVBhZ2VzKGUpO1xyXG4gIH0pO1xyXG4gIC8vIGZvciAobGV0IGkgaW4gdG9vbGJhckZvcm0uaW5wdXRzKSB7XHJcbiAgLy8gICB0b29sYmFyRm9ybS5pbnB1dHNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7b25DaGFuZ2VUb29sYmFyKGUsIHRvb2xiYXJGb3JtLmlucHV0c1tpXS5uYW1lKX0pO1xyXG4gIC8vIH1cclxuXHJcbiAgbGV0IHN0YXJ0eWVhciA9IFtcclxuICAgIF9fcmVuZGVyR2FsbGVyeSgpXHJcbiAgXVxyXG5cclxuICAvL01pcnJvci5TVE9SRVdBVENILnNldCgnc3RhcnR5ZWFyJywgc3RhcnR5ZWFyKTtcclxuXHJcbiAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcblxyXG4gIE1vZGVsLmxvYWQubWVkaWFJbml0KCk7XHJcblxyXG5cclxuLyogXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbj09PT09PT09IEZpbGUgVXBsb2FkIHJlZ2lzdHJhdGlvblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4qL1xyXG5cclxuXHJcbmxldCB1cGxvYWRNdWx0aXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd1cGxvYWQtbXVsdGlwbGUnKTtcclxuXHJcbmxldCBtZWRpYVVwbG9hZEhhbmRsZXIgPSAoZXZlbnQsIGF0SW5kZXgpID0+IHtcclxuICBpZiAoYXRJbmRleCA9PSAtMSkge1xyXG4gICAgTW9kZWwuc2F2ZS5jb3ZlcihldmVudC50YXJnZXQuZmlsZXNbMF0pO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBNb2RlbC5zYXZlLm1lZGlhKGV2ZW50LnRhcmdldC5maWxlcywgYXRJbmRleCk7XHJcbiAgfVxyXG4gIC8vX19yZW5kZXJHYWxsZXJ5KCk7XHJcbn1cclxuXHJcbnVwbG9hZE11bHRpcGxlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpe1xyXG4gIG1lZGlhVXBsb2FkSGFuZGxlcihlKTtcclxuICAgIF9fcmVuZGVyR2FsbGVyeSgpO1xyXG4gIH0pO1xyXG5WaWV3LnVwbG9hZGVyLnNpbmdsZS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgbWVkaWFVcGxvYWRIYW5kbGVyKGUsIHNlbGVjdGVkLmluZGV4KVxyXG59KVxyXG5cclxuXHJcbi8qIC0tLS0gLS0tLS0tIC0tLS0tIC0gUmVuZGVyIHN0dWZmXHJcbj09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG5sZXQgX19yZW5kZXJJbldvcmtzcGFjZSA9IHtcclxuICBjYWxlbmRhcigpe1xyXG4gICAgbGV0IGluZGV4ID0gc2VsZWN0ZWQuaW5kZXg7XHJcbiAgICBsZXQgaW1nU3JjID0gTW9kZWwubG9hZC5tZWRpYShpbmRleCkucGF0aDtcclxuICAgIFZpZXcuZ2FsbGVyeS51cGRhdGVJdGVtSW1hZ2UoaW5kZXgsIGltZ1NyYyk7XHJcbiAgICBjb25zdCByZXRyaWV2ZSA9IE1vZGVsLndvcmtzcGFjZTtcclxuICAgIFZpZXcud29ya3NwYWNlLmNyZWF0ZUNhbGVuZGFyKFxyXG4gICAgICBNb2RlbC5sb2FkLmdhbGxlcnlQYW5lbEl0ZW0oaW5kZXgpLm1vbnRoLFxyXG4gICAgICBNb2RlbC5sb2FkLmdhbGxlcnlQYW5lbEl0ZW0oaW5kZXgpLnllYXIsXHJcbiAgICAgIHJldHJpZXZlLnBhcGVyU2l6ZSxcclxuICAgICAgcmV0cmlldmUucGFwZXJMYXlvdXQsXHJcbiAgICAgIHJldHJpZXZlLmZvcm1hdE1vZGUsXHJcbiAgICAgIGltZ1NyYyk7XHJcbiAgfSxcclxuICBjb3ZlclBhZ2UoKXtcclxuICAgIGxldCByZXRyaWV2ZSA9IE1vZGVsLndvcmtzcGFjZTtcclxuICAgIFZpZXcuZ2FsbGVyeS51cGRhdGVDb3ZlcihyZXRyaWV2ZS5jb3Zlcik7XHJcbiAgICBWaWV3LndvcmtzcGFjZS5yZW5kZXJDb3ZlcihyZXRyaWV2ZS5wYXBlclNpemUsIHJldHJpZXZlLnBhcGVyTGF5b3V0LCByZXRyaWV2ZS5jb3Zlcik7XHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBfX3JlbmRlckdhbGxlcnkoKXtcclxuICBNb2RlbC5nYWxsZXJ5LmdlbmVyYXRlSXRlbXMoKTtcclxuICBsZXQgaGFuZGxlciA9IChlbGUpID0+IHtcclxuICAgIHNlbGVjdGVkLnNlbGVjdEl0ZW0gPSBlbGU7XHJcbiAgICBpZiAoZWxlLmNoaWxkcmVuWzBdLmNsYXNzTGlzdC5jb250YWlucygncGxhY2Vob2xkZXInKSkge1xyXG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XHJcbiAgICAgICAgVmlldy51cGxvYWRlci5vcGVuU2luZ2xlQnJvd3NlcigpO1xyXG4gICAgICAgIGxldCB1ID0gVmlldy51cGxvYWRlci5zaW5nbGU7XHJcbiAgICAgICAgICB1Lm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZih1LmZpbGVzLmxlbmd0aCAhPSB1bmRlZmluZWQgJiYgdS5maWxlcy5sZW5ndGggIT0gbnVsbCAmJiB1LmZpbGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xyXG4gICAgICAgICAgICAgIHUudmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIHJlamVjdChmYWxzZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIFZpZXcuZ2FsbGVyeS5jbGVhclBhbmVsKCk7XHJcbiAgaWYgKE1vZGVsLmdhbGxlcnkubmVlZHNDb3ZlcikgeyAvLyBDb3ZlcnJycnJycnJycnJycnJycnJycnJycnJycnJyXHJcbiAgICBsZXQgY292ZXIgPSBWaWV3LmdhbGxlcnkuaW5zZXJ0Q292ZXIoTW9kZWwubG9hZC5jb3Zlcik7XHJcbiAgICBjb3Zlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCBwcm9taXNlID0gaGFuZGxlcihWaWV3LmdhbGxlcnkucm9vdC5jaGlsZHJlblswXSk7XHJcbiAgICAgIGlmIChpc0VtcHR5KHByb21pc2UpKSByZXR1cm47XHJcbiAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgX19yZW5kZXJJbldvcmtzcGFjZS5jb3ZlclBhZ2UoKTtcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbGV0IEl0ZW1zID0gVmlldy5nYWxsZXJ5LnJlbmRlclBhbmVsKCk7XHJcbiAgZm9yIChsZXQgaSBpbiBJdGVtcykge1xyXG4gICAgSXRlbXNbaV0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbigpe1xyXG4gICAgICBsZXQgcHJvbWlzZSA9IGhhbmRsZXIoSXRlbXNbaV0pO1xyXG4gICAgICBpZiAoaXNFbXB0eShwcm9taXNlKSkgcmV0dXJuO1xyXG4gICAgICBwcm9taXNlLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIF9fcmVuZGVySW5Xb3Jrc3BhY2UuY2FsZW5kYXIoKTtcclxuICAgICAgfSlcclxuICAgIH0pO1xyXG4gIH1cclxuICBWaWV3LnVwbG9hZGVyLnJlbmRlckJ1ZmZlcihNb2RlbC5sb2FkLm1lZGlhLCBNb2RlbC5nYWxsZXJ5LnRvdGFsTW9udGhzKTtcclxufVxyXG5cclxuXHJcbi8qKiBHbG9iYWwgRXZlbnRzIG9uIHdpbmRvdyBPYmplY3QqL1xyXG5mdW5jdGlvbiByZWdpc3RlcihldmVudE5hbWUsIGhhbmRsZXIpe1xyXG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgaGFuZGxlcik7XHJcbn1cclxuXHJcbnJlZ2lzdGVyKCd3YXJuX2ludmFsaWQnLCBmdW5jdGlvbihlKXtcclxuICBjb25zb2xlLmxvZygnSW52YWxpZCBkYXRlIHJhbmdlJyk7XHJcbn0pXHJcblxyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG49PT09PT09PT0gICAgSW50ZXJhY3Rpb25cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xyXG5cclxuLy9QYW5lbCByZXNpemVyXHJcblNwbGl0KFsnI3VwbG9hZGVyJywgJyNnYWxsZXJ5LXBhbmVsJywnI3dvcmtzcGFjZScsICcjcHJvcGVydGllcy1wYW5lbCddLCB7XHJcbiAgbWluU2l6ZToxLFxyXG4gIHNpemVzOlsxMCwgMTAsIDY1LCAxNV0sIC8vIG11c3QgYWRkIHVwIHRvIDEwMCAoJSlcclxuICBndXR0ZXJTaXplOiA4LFxyXG59KTtcclxuXHJcbk1pY3JvTW9kYWwuaW5pdCgpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gIF9fcmVuZGVyR2FsbGVyeSxcclxufSJdLCJzb3VyY2VSb290IjoiIn0=