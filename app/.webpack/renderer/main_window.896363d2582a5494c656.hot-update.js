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
    _mvc_model_js__WEBPACK_IMPORTED_MODULE_1__["default"].save.galleryMedia(atIndex, event.target.files[0]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbXZjX2NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFpQztBQUNFO0FBQ047QUFDTztBQUNOOztBQUU5Qjs7QUFFQTs7QUFFQSxjQUFjLG9EQUFJOzs7QUFHbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLG9EQUFJLGNBQWMscURBQUs7QUFDekM7QUFDQTtBQUNBO0FBQ0EsSUFBSSxxREFBSztBQUNUO0FBQ0EsR0FBRztBQUNIO0FBQ0EscUJBQXFCLHFEQUFLO0FBQzFCOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUkscURBQUs7QUFDVDtBQUNBLG1CQUFtQixrQkFBa0I7QUFDckM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLE9BQU87QUFDeEIsa0VBQWtFLGdEQUFnRDtBQUNsSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG9FQUFvRSwrQ0FBK0M7QUFDbkg7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBLEVBQUUscURBQUs7OztBQUdQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBOztBQUVBO0FBQ0E7QUFDQSxJQUFJLHFEQUFLO0FBQ1QsR0FBRztBQUNILElBQUkscURBQUs7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILG9EQUFJO0FBQ0o7QUFDQSxDQUFDOzs7QUFHRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixxREFBSztBQUN0QixJQUFJLG9EQUFJO0FBQ1IscUJBQXFCLHFEQUFLO0FBQzFCLElBQUksb0RBQUk7QUFDUixNQUFNLHFEQUFLO0FBQ1gsTUFBTSxxREFBSztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0EsbUJBQW1CLHFEQUFLO0FBQ3hCLElBQUksb0RBQUk7QUFDUixJQUFJLG9EQUFJO0FBQ1I7QUFDQTs7QUFFQTtBQUNBLEVBQUUscURBQUs7QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVEsb0RBQUk7QUFDWixnQkFBZ0Isb0RBQUk7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUEsRUFBRSxvREFBSTtBQUNOLE1BQU0scURBQUssc0JBQXNCO0FBQ2pDLGdCQUFnQixvREFBSSxxQkFBcUIscURBQUs7QUFDOUM7QUFDQSw0QkFBNEIsb0RBQUk7QUFDaEM7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDs7QUFFQSxjQUFjLG9EQUFJO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQSxFQUFFLG9EQUFJLHVCQUF1QixxREFBSyxhQUFhLHFEQUFLO0FBQ3BEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsQ0FBQzs7O0FBR0Q7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0RBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVELGtEQUFVOztBQUVLO0FBQ2Y7QUFDQSxDIiwiZmlsZSI6Im1haW5fd2luZG93Ljg5NjM2M2QyNTgyYTU0OTRjNjU2LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgVmlldyBmcm9tICcuL212Y192aWV3LmpzJztcclxuaW1wb3J0IE1vZGVsIGZyb20gJy4vbXZjX21vZGVsLmpzJztcclxuaW1wb3J0IFNwbGl0IGZyb20gJ3NwbGl0LmpzJztcclxuaW1wb3J0IE1pY3JvTW9kYWwgZnJvbSAnbWljcm9tb2RhbCc7XHJcbmltcG9ydCBNaXJyb3IgZnJvbSAnLi9taXJyb3InO1xyXG5cclxuLy9NaXJyb3Iuc2V0U3RvcmUoTW9kZWwuc3RvcmUpO1xyXG5cclxubGV0IHJlbmRlcktleU1hcCA9IG5ldyBNYXAoKTtcclxuXHJcbmxldCBpc0VtcHR5ID0gVmlldy5pc0VtcHR5O1xyXG5cclxuXHJcbi8qKlxyXG4gKiBSZWdhcmRpbmcgc2VsZWN0aW9uIG9mIGEgZ2FsbGVyeSBpdGVtXHJcbiAqL1xyXG52YXIgc2VsZWN0ZWQgPSB7XHJcbiAgaXRlbTogbnVsbCxcclxuICBzZXQgc2VsZWN0SXRlbShtKXtcclxuICAgICAgaWYgKHRoaXMuaXRlbSAhPSBudWxsIHx8IHRoaXMuaXRlbSAhPSB1bmRlZmluZWQpIHRoaXMuaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xyXG4gICAgICBtLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XHJcbiAgICB0aGlzLml0ZW0gPSBtO1xyXG4gIH0sXHJcbiAgZ2V0IGluZGV4KCl7XHJcbiAgICBpZiAoIXRoaXMuaXRlbSkgcmV0dXJuIC0xO1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbS5nZXRBdHRyaWJ1dGUoJ2luZGV4Jyk7XHJcbiAgfVxyXG59O1xyXG5cclxuLyogPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBcclxuPT09PT09PT09PT09PT09PSBJTklUID09PT09PT09PT09PT09IFxyXG4tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSovXHJcbmxldCB0b29sYmFyRm9ybSA9IFZpZXcudG9vbGJhci5pbml0KE1vZGVsLmxvYWQudG9vbGJhckluaXQoKSk7XHJcbiAgICAvKiBldmVudCBSZWdpc3RyYXRpb24gZm9yIDxTZWxlY3Q+ICovXHJcbmxldCBvbkNoYW5nZVRvb2xiYXIgPSAoZSwgcHJvcE5hbWUpID0+IHtcclxuICB0cnl7XHJcbiAgICBNb2RlbC5zYXZlLnRvb2xiYXIocHJvcE5hbWUsIGUudGFyZ2V0LnZhbHVlKTtcclxuICAgIF9fcmVuZGVyR2FsbGVyeSgpO1xyXG4gIH0gY2F0Y2goZXJyb3Ipe1xyXG4gICAgLy9UT0RPIHdhcm5pbmdcclxuICAgIGUudGFyZ2V0LnZhbHVlID0gTW9kZWwubG9hZC50b29sYmFyW3Byb3BOYW1lXTtcclxuICB9XHJcblxyXG59XHJcblxyXG4gIGxldCB1cGRhdGVQYWdlcyA9IChldmVudCkgPT4ge1xyXG4gICAgbGV0IGF0dHIgPSBldmVudC50YXJnZXQubmFtZTtcclxuICAgIGxldCBuZXdWYWwgPSBldmVudC50YXJnZXQudmFsdWU7XHJcbiAgICBNb2RlbC5zYXZlLnRvb2xiYXIoYXR0ciwgbmV3VmFsKTtcclxuICAgIGxldCBwYWdlcyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdwYWdlJyk7XHJcbiAgICBmb3IgKGxldCBwID0gMDsgcCA8IHBhZ2VzLmxlbmd0aDsgcCsrKSB7XHJcbiAgICAgIHBhZ2VzW3BdLnNldEF0dHJpYnV0ZShhdHRyLCBuZXdWYWwpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICBzZWxlY3RzOiBbc3RhcnRNb250aCwgZW5kTW9udGgsIGZvcm1hdE1vZGUsIHNpemUsIGxheW91dF0sXHJcbiAgICBpbnB1dHM6IFtzdGFydFllYXIsIGVuZFllYXJdLFxyXG4gICovXHJcbiAgZm9yIChsZXQgcyA9IDA7IHMgPCAzOyBzKyspIHtcclxuICAgIHRvb2xiYXJGb3JtLnNlbGVjdHNbc10uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7b25DaGFuZ2VUb29sYmFyKGUsIHRvb2xiYXJGb3JtLnNlbGVjdHNbc10ubmFtZSl9KTtcclxuICB9XHJcbiAgdG9vbGJhckZvcm0uc2VsZWN0c1szXS5hZGRFdmVudExpc3RlbmVyKCdjaGFuZ2UnLCBmdW5jdGlvbihlKXtcclxuICAgIHVwZGF0ZVBhZ2VzKGUpO1xyXG4gIH0pO1xyXG4gIHRvb2xiYXJGb3JtLnNlbGVjdHNbNF0uYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7XHJcbiAgICB1cGRhdGVQYWdlcyhlKTtcclxuICB9KTtcclxuICAvLyBmb3IgKGxldCBpIGluIHRvb2xiYXJGb3JtLmlucHV0cykge1xyXG4gIC8vICAgdG9vbGJhckZvcm0uaW5wdXRzW2ldLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpe29uQ2hhbmdlVG9vbGJhcihlLCB0b29sYmFyRm9ybS5pbnB1dHNbaV0ubmFtZSl9KTtcclxuICAvLyB9XHJcblxyXG4gIGxldCBzdGFydHllYXIgPSBbXHJcbiAgICBfX3JlbmRlckdhbGxlcnkoKVxyXG4gIF1cclxuXHJcbiAgLy9NaXJyb3IuU1RPUkVXQVRDSC5zZXQoJ3N0YXJ0eWVhcicsIHN0YXJ0eWVhcik7XHJcblxyXG4gIF9fcmVuZGVyR2FsbGVyeSgpO1xyXG5cclxuICBNb2RlbC5sb2FkLm1lZGlhSW5pdCgpO1xyXG5cclxuXHJcbi8qIFxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG49PT09PT09PSBGaWxlIFVwbG9hZCByZWdpc3RyYXRpb25cclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuKi9cclxuXHJcblxyXG5sZXQgdXBsb2FkTXVsdGlwbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndXBsb2FkLW11bHRpcGxlJyk7XHJcblxyXG5sZXQgbWVkaWFVcGxvYWRIYW5kbGVyID0gKGV2ZW50LCBhdEluZGV4KSA9PiB7XHJcbiAgaWYgKGF0SW5kZXggPT0gLTEpIHtcclxuICAgIE1vZGVsLnNhdmUuY292ZXIoZXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcclxuICB9IGVsc2Uge1xyXG4gICAgTW9kZWwuc2F2ZS5nYWxsZXJ5TWVkaWEoYXRJbmRleCwgZXZlbnQudGFyZ2V0LmZpbGVzWzBdKTtcclxuICB9XHJcbiAgLy9fX3JlbmRlckdhbGxlcnkoKTtcclxufVxyXG5cclxudXBsb2FkTXVsdGlwbGUuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgZnVuY3Rpb24oZSl7XHJcbiAgbWVkaWFVcGxvYWRIYW5kbGVyKGUpO1xyXG4gICAgX19yZW5kZXJHYWxsZXJ5KCk7XHJcbiAgfSk7XHJcblZpZXcudXBsb2FkZXIuc2luZ2xlLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIGZ1bmN0aW9uKGUpIHtcclxuICBtZWRpYVVwbG9hZEhhbmRsZXIoZSwgc2VsZWN0ZWQuaW5kZXgpXHJcbn0pXHJcblxyXG5cclxuLyogLS0tLSAtLS0tLS0gLS0tLS0gLSBSZW5kZXIgc3R1ZmZcclxuPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cclxuXHJcbmxldCBfX3JlbmRlckluV29ya3NwYWNlID0ge1xyXG4gIGNhbGVuZGFyKCl7XHJcbiAgICBsZXQgaW5kZXggPSBzZWxlY3RlZC5pbmRleDtcclxuICAgIGxldCBpbWdTcmMgPSBNb2RlbC5sb2FkLm1lZGlhKGluZGV4KS5wYXRoO1xyXG4gICAgVmlldy5nYWxsZXJ5LnVwZGF0ZUl0ZW1JbWFnZShpbmRleCwgaW1nU3JjKTtcclxuICAgIGNvbnN0IHJldHJpZXZlID0gTW9kZWwud29ya3NwYWNlO1xyXG4gICAgVmlldy53b3Jrc3BhY2UuY3JlYXRlQ2FsZW5kYXIoXHJcbiAgICAgIE1vZGVsLmxvYWQuZ2FsbGVyeVBhbmVsSXRlbShpbmRleCkubW9udGgsXHJcbiAgICAgIE1vZGVsLmxvYWQuZ2FsbGVyeVBhbmVsSXRlbShpbmRleCkueWVhcixcclxuICAgICAgcmV0cmlldmUucGFwZXJTaXplLFxyXG4gICAgICByZXRyaWV2ZS5wYXBlckxheW91dCxcclxuICAgICAgcmV0cmlldmUuZm9ybWF0TW9kZSxcclxuICAgICAgaW1nU3JjKTtcclxuICB9LFxyXG4gIGNvdmVyUGFnZSgpe1xyXG4gICAgbGV0IHJldHJpZXZlID0gTW9kZWwud29ya3NwYWNlO1xyXG4gICAgVmlldy5nYWxsZXJ5LnVwZGF0ZUNvdmVyKHJldHJpZXZlLmNvdmVyKTtcclxuICAgIFZpZXcud29ya3NwYWNlLnJlbmRlckNvdmVyKHJldHJpZXZlLnBhcGVyU2l6ZSwgcmV0cmlldmUucGFwZXJMYXlvdXQsIHJldHJpZXZlLmNvdmVyKTtcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIF9fcmVuZGVyR2FsbGVyeSgpe1xyXG4gIE1vZGVsLmdhbGxlcnkuZ2VuZXJhdGVJdGVtcygpO1xyXG4gIGxldCBoYW5kbGVyID0gKGVsZSkgPT4ge1xyXG4gICAgc2VsZWN0ZWQuc2VsZWN0SXRlbSA9IGVsZTtcclxuICAgIGlmIChlbGUuY2hpbGRyZW5bMF0uY2xhc3NMaXN0LmNvbnRhaW5zKCdwbGFjZWhvbGRlcicpKSB7XHJcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcclxuICAgICAgICBWaWV3LnVwbG9hZGVyLm9wZW5TaW5nbGVCcm93c2VyKCk7XHJcbiAgICAgICAgbGV0IHUgPSBWaWV3LnVwbG9hZGVyLnNpbmdsZTtcclxuICAgICAgICAgIHUub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHUuZmlsZXMubGVuZ3RoICE9IHVuZGVmaW5lZCAmJiB1LmZpbGVzLmxlbmd0aCAhPSBudWxsICYmIHUuZmlsZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XHJcbiAgICAgICAgICAgICAgdS52YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgcmVqZWN0KGZhbHNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfTtcclxuICAgICAgICB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgVmlldy5nYWxsZXJ5LmNsZWFyUGFuZWwoKTtcclxuICBpZiAoTW9kZWwuZ2FsbGVyeS5uZWVkc0NvdmVyKSB7IC8vIENvdmVycnJycnJycnJycnJycnJycnJycnJycnJycnJcclxuICAgIGxldCBjb3ZlciA9IFZpZXcuZ2FsbGVyeS5pbnNlcnRDb3ZlcihNb2RlbC5sb2FkLmNvdmVyKTtcclxuICAgIGNvdmVyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24oKXtcclxuICAgICAgbGV0IHByb21pc2UgPSBoYW5kbGVyKFZpZXcuZ2FsbGVyeS5yb290LmNoaWxkcmVuWzBdKTtcclxuICAgICAgaWYgKGlzRW1wdHkocHJvbWlzZSkpIHJldHVybjtcclxuICAgICAgcHJvbWlzZS50aGVuKCgpID0+IHtcclxuICAgICAgICBfX3JlbmRlckluV29ya3NwYWNlLmNvdmVyUGFnZSgpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBsZXQgSXRlbXMgPSBWaWV3LmdhbGxlcnkucmVuZGVyUGFuZWwoKTtcclxuICBmb3IgKGxldCBpIGluIEl0ZW1zKSB7XHJcbiAgICBJdGVtc1tpXS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uKCl7XHJcbiAgICAgIGxldCBwcm9taXNlID0gaGFuZGxlcihJdGVtc1tpXSk7XHJcbiAgICAgIGlmIChpc0VtcHR5KHByb21pc2UpKSByZXR1cm47XHJcbiAgICAgIHByb21pc2UudGhlbigoKSA9PiB7XHJcbiAgICAgICAgX19yZW5kZXJJbldvcmtzcGFjZS5jYWxlbmRhcigpO1xyXG4gICAgICB9KVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIFZpZXcudXBsb2FkZXIucmVuZGVyQnVmZmVyKE1vZGVsLmxvYWQubWVkaWEsIE1vZGVsLmdhbGxlcnkudG90YWxNb250aHMpO1xyXG59XHJcblxyXG5cclxuLyoqIEdsb2JhbCBFdmVudHMgb24gd2luZG93IE9iamVjdCovXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyKGV2ZW50TmFtZSwgaGFuZGxlcil7XHJcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoZXZlbnROYW1lLCBoYW5kbGVyKTtcclxufVxyXG5cclxucmVnaXN0ZXIoJ3dhcm5faW52YWxpZCcsIGZ1bmN0aW9uKGUpe1xyXG4gIGNvbnNvbGUubG9nKCdJbnZhbGlkIGRhdGUgcmFuZ2UnKTtcclxufSlcclxuXHJcblxyXG4vKiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbj09PT09PT09PSAgICBJbnRlcmFjdGlvblxyXG49PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXHJcblxyXG4vL1BhbmVsIHJlc2l6ZXJcclxuU3BsaXQoWycjdXBsb2FkZXInLCAnI2dhbGxlcnktcGFuZWwnLCcjd29ya3NwYWNlJywgJyNwcm9wZXJ0aWVzLXBhbmVsJ10sIHtcclxuICBtaW5TaXplOjEsXHJcbiAgc2l6ZXM6WzEwLCAxMCwgNjUsIDE1XSwgLy8gbXVzdCBhZGQgdXAgdG8gMTAwICglKVxyXG4gIGd1dHRlclNpemU6IDgsXHJcbn0pO1xyXG5cclxuTWljcm9Nb2RhbC5pbml0KCk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiAgX19yZW5kZXJHYWxsZXJ5LFxyXG59Il0sInNvdXJjZVJvb3QiOiIifQ==