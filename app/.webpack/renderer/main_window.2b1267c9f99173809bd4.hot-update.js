webpackHotUpdate("main_window",{

/***/ "./src/mvc_model.js":
/*!**************************!*\
  !*** ./src/mvc_model.js ***!
  \**************************/
/*! exports provided: default, save, load */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "save", function() { return save; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "load", function() { return load; });
/* harmony import */ var _store_dotstore__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./store/dotstore */ "./src/store/dotstore.js");
const Holidays = __webpack_require__(/*! date-holidays */ "./node_modules/date-holidays/lib/index.js")
const COUNTRIES = new Holidays().getCountries('en');
const Cal = __webpack_require__(/*! ./calendar/calendar */ "./src/calendar/calendar.js");
//const Store = require('electron-store');


let MONTHNAMES = Cal.MONTHS["MINI"];

const store = new _store_dotstore__WEBPACK_IMPORTED_MODULE_0__["default"].Store(50);

var thisYear = new Date().getFullYear();

store.clear();

const schema = {
  toolbar: {
    startmonth: {
      type: 'number',
      default: 0
    },
    startyear: {
      type: 'number',
      default: thisYear,
    },
    endmonth: {
      type: 'number',
      default: 11
    },
    endyear: {
      type: 'number',
      default: thisYear,
    },
    format: {
      type: 'string',
      default: 'flip'
    },
    size:{
      type: 'string',
      default: 'letter'
    },
    layout:{
      type: 'string',
      default: 'landscape'
    }
  },

  //
  mediaP:{},
  media: {},
  mediaFill:{},
  cover: {},
  galleryPanelItems: []
};


let MEDIAMAP = {
  M: new Map(),
  has(m, y){
    return this.M.has([m,y]);
  },
  get(m, y){
    return this.M.get([m, y]);
  },
  set(monthIndex, year, path, fill){
    obj = {path: path, fill: fill? fill : 'contain'};
    this.M.set([monthIndex, year], obj);
  },
  delete(m, y){
    this.M.delete(m, y);
  }
}


let save = {
  mediaArray: [],
  media(filesList, atIndex){
    if(this.mediaArray === undefined || this.mediaArray === null){
      for (let fi = 0; fi < filesList.length; f++) {
        let wtf = []
        wtf.push(createURL(filesList[fi]));
        this.mediaArray = wtf;
      }
    } else if (atIndex != null && atIndex != undefined) {
      this.mediaArray[atIndex] = createURL(filesList[0]);
    } else {
      let f = 0;
      let i = 0;
      while (f < filesList.length) {
        let ah = createURL(filesList[f]);
        if (this.mediaArray[i]) { // has element/not empty
          i++;
        } else {
          this.mediaArray[i] = ah;
          f++
          i++;
        }
      }
    }
    store.set('media', this.mediaArray);
  },
  galleryMedia(index, path, fill){
    store.set(`galleryPanelItems.${index}.media.path`, path);
    console.log(store.get(`galleryPanelItems.${index}.media.path`));
  },
  cover(file){
    let u = createURL(file);
    store.set('cover', createURL(file));
  },
  toolbar(prop, val){
    if (!validate.toolbar(prop, val)) {return false};
    store.set(`toolbar.${prop}`, `${val}`);
    return true
  },
  mediaFill(atIndex, fillMode){
   // store.set(`mediaFill.${atIndex}`) = fillMode;
  },
  store(key, val) {
    if (key.includes("toolbar")) {
      let prop = key.replace("toolbar.", "");
      return save.toolbar(prop, val);
    }
    store.set(key, val);
    return true
  }
}

let load = {
  toolbarInit(){
    Object.entries(schema.toolbar).forEach(pair => {
      if (!store.has(`toolbar.${pair[0]}`)){
        store.set(`toolbar.${pair[0]}`, `${pair[1].default}`);
      }
    });
    return store.get(`toolbar`);
  },
  mediaInit(){
    this.mediaArray = store.get('media');
  },
  get all(){
    return store.store;
  },
  media(index){
    return store.get('galleryPanelItems')[index].media;
  },
  galleryPanelItem(index){
    return store.get('galleryPanelItems')[index];
  },
  get cover(){
    return store.get('cover');
  },
  get toolbar(){
    return store.get('toolbar');
  },
  store(key){
    return store.get(key);
  }
}

let gallery = {
  labelsArray: [],

  /**Returns an array with elements ["MONTHNAME", YEAR:int???, monthINDEX] */
  generateLabels(){
    let data = store.get('toolbar');
    this.labelsArray = this.slotInt((yr, mI) => {
      return [`${MONTHNAMES[mI]}`, `${yr}`, mI];
    });
    return this.labelsArray;
  },
  generateItems(){
    this.generateLabels();
    let result = {};
    let existing = load.store('galleryPanelItems');
    for (let l in this.labelsArray){
      //existing[l]
      let path = null;
      let fill = 'contain';
      let yearN = this.labelsArray[l][1];
      let monthN = this.labelsArray[l][2];
      let yearMonthTag = `${yearN}${monthN}`;
      if (existing && existing[yearMonthTag]){
        path = existing[yearMonthTag].media.path;
        fill = existing[yearMonthTag].media.fill;
      }
      let obj = {
        label: this.labelsArray[l][0],
        year: yearN,
        month: monthN,
        media: {
          path: path,
          fill: fill,
        }
      }
      result[yearMonthTag] = obj;
    }
    save.store('galleryPanelItems', result);
    return result;
  },
  slotInt(callback = (yr, mI) => { return [yr, mI]}){
    let format = store.get('toolbar');
    let result = [];
    let mi = parseInt(format.startmonth);
    let yi = parseInt(format.startyear);

    let me = parseInt(format.endmonth);
    let ye = parseInt(format.endyear);

    while (yi <= ye) {
      result.push(callback(yi,mi));
      let stop = (yi == ye)? me : 11 ;
      if (mi < stop) {
        mi++;
      } else {
        mi = 0;
        yi++;
      }
    }
    return result;
  },

  get needsCover(){
    switch (workspace.formatMode){
      case 'flip':{
        return true;
      }
      case 'glance': {
        return false;
      }
      case 'wide':{
        return false;
      }
      default: {
        return false;
      }
    }
  },

  get totalMonths(){
  return this.labelsArray.length;
  }
}

let workspace = {
  get formatMode(){
    return store.get('toolbar.format');
  },
  get paperSize(){
    return store.get('toolbar.size');
  },
  get paperLayout(){
    return store.get('toolbar.layout');
  },
  get cover(){
    return store.get('cover');
  }
}

let style = {
  //  getComputedStyle(document.documentElement).getPropertyValue('--transitionTime').replace(/ms/g, "");
  /** Determine a ratio multiplier? For generating thumbnail previews I guess
   * TODO
   */
  paperRatio(){
    console.log(getComputedStyle(document.documentElement));
  }
}


let validate = {
  toolbar(propName, newVal){
    let format = store.get('toolbar');

    newVal = parseInt(newVal);
    switch (propName){
      case 'endyear':{
        return !(newVal < format.startyear);
      }
      case 'startyear':{
        return !(newVal > format.endyear);
      }
      case 'endmonth':{
        if (format.endyear == format.startyear){
          return !(newVal < format.startmonth);
        }
      }
      case 'startmonth':{
        if (format.endyear == format.startyear){
          return (newVal <= format.endmonth)
        }
      }
      default:{
        return true;
      }
    }
  }
}

let holidays = {
  US: holidayInit('US'),
  CA: holidayInit('CA'),
  MX: holidayInit('MX'),
  NA(){
    //uhh
  }
}

console.log(holidays.CA(2020))
console.log(holidays.US(2020))
console.log(holidays.MX(2020))

function holidayInit(code, lang){
  let h = new Holidays();
  let l = lang;
  if (!l) l = 'en';
  h.init(code);
  return function(year){
    return h.getHolidays(year, lang);
  }
}

//=============================================================
//====    Utility functions
//=============================================================

function createURL(file){
  return URL.createObjectURL(file);
}

function stringifyFile(fileObject){
  // implement toJSON() behavior  
  fileObject.toJSON = function() { return {
      'lastModified'     : fileObject.lastModified,
      'lastModifiedDate' : fileObject.lastModifiedDate,
      'name'             : fileObject.name,
      'size'             : fileObject.size,
      'type'             : fileObject.type,
      'path'             : fileObject.path
  };}  

  // then use JSON.stringify on File object
  return fileObject.toJSON();
}

/* harmony default export */ __webpack_exports__["default"] = ({
 gallery,
 save,
 load,
 style,
 workspace,
 holidays,
 store,
 validate
});



/***/ })

})
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbXZjX21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFpQixtQkFBTyxDQUFDLGdFQUFlO0FBQ3hDO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLHVEQUFxQjtBQUN6QztBQUNtQzs7QUFFbkM7O0FBRUEsa0JBQWtCLHVEQUFHOztBQUVyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsV0FBVztBQUNYLFdBQVc7QUFDWCxjQUFjO0FBQ2QsV0FBVztBQUNYO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxXQUFXO0FBQ1g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHVCQUF1QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG1DQUFtQyxNQUFNO0FBQ3pDLCtDQUErQyxNQUFNO0FBQ3JELEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSx1Q0FBdUM7QUFDdkMseUJBQXlCLEtBQUssTUFBTSxJQUFJO0FBQ3hDO0FBQ0EsR0FBRztBQUNIO0FBQ0EsNkJBQTZCLFFBQVE7QUFDckMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsUUFBUTtBQUN4Qyw2QkFBNkIsUUFBUSxNQUFNLGdCQUFnQjtBQUMzRDtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGVBQWUsTUFBTSxHQUFHO0FBQ3pDLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixNQUFNLEVBQUUsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGtDQUFrQyxpQkFBaUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLOztBQUVBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Im1haW5fd2luZG93LjJiMTI2N2M5Zjk5MTczODA5YmQ0LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBIb2xpZGF5cyA9IHJlcXVpcmUoJ2RhdGUtaG9saWRheXMnKVxyXG5jb25zdCBDT1VOVFJJRVMgPSBuZXcgSG9saWRheXMoKS5nZXRDb3VudHJpZXMoJ2VuJyk7XHJcbmNvbnN0IENhbCA9IHJlcXVpcmUoJy4vY2FsZW5kYXIvY2FsZW5kYXInKTtcclxuLy9jb25zdCBTdG9yZSA9IHJlcXVpcmUoJ2VsZWN0cm9uLXN0b3JlJyk7XHJcbmltcG9ydCBkb3QgZnJvbSAnLi9zdG9yZS9kb3RzdG9yZSc7XHJcblxyXG5sZXQgTU9OVEhOQU1FUyA9IENhbC5NT05USFNbXCJNSU5JXCJdO1xyXG5cclxuY29uc3Qgc3RvcmUgPSBuZXcgZG90LlN0b3JlKDUwKTtcclxuXHJcbnZhciB0aGlzWWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuXHJcbnN0b3JlLmNsZWFyKCk7XHJcblxyXG5jb25zdCBzY2hlbWEgPSB7XHJcbiAgdG9vbGJhcjoge1xyXG4gICAgc3RhcnRtb250aDoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIHN0YXJ0eWVhcjoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogdGhpc1llYXIsXHJcbiAgICB9LFxyXG4gICAgZW5kbW9udGg6IHtcclxuICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgIGRlZmF1bHQ6IDExXHJcbiAgICB9LFxyXG4gICAgZW5keWVhcjoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogdGhpc1llYXIsXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0OiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBkZWZhdWx0OiAnZmxpcCdcclxuICAgIH0sXHJcbiAgICBzaXplOntcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6ICdsZXR0ZXInXHJcbiAgICB9LFxyXG4gICAgbGF5b3V0OntcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6ICdsYW5kc2NhcGUnXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy9cclxuICBtZWRpYVA6e30sXHJcbiAgbWVkaWE6IHt9LFxyXG4gIG1lZGlhRmlsbDp7fSxcclxuICBjb3Zlcjoge30sXHJcbiAgZ2FsbGVyeVBhbmVsSXRlbXM6IFtdXHJcbn07XHJcblxyXG5cclxubGV0IE1FRElBTUFQID0ge1xyXG4gIE06IG5ldyBNYXAoKSxcclxuICBoYXMobSwgeSl7XHJcbiAgICByZXR1cm4gdGhpcy5NLmhhcyhbbSx5XSk7XHJcbiAgfSxcclxuICBnZXQobSwgeSl7XHJcbiAgICByZXR1cm4gdGhpcy5NLmdldChbbSwgeV0pO1xyXG4gIH0sXHJcbiAgc2V0KG1vbnRoSW5kZXgsIHllYXIsIHBhdGgsIGZpbGwpe1xyXG4gICAgb2JqID0ge3BhdGg6IHBhdGgsIGZpbGw6IGZpbGw/IGZpbGwgOiAnY29udGFpbid9O1xyXG4gICAgdGhpcy5NLnNldChbbW9udGhJbmRleCwgeWVhcl0sIG9iaik7XHJcbiAgfSxcclxuICBkZWxldGUobSwgeSl7XHJcbiAgICB0aGlzLk0uZGVsZXRlKG0sIHkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmxldCBzYXZlID0ge1xyXG4gIG1lZGlhQXJyYXk6IFtdLFxyXG4gIG1lZGlhKGZpbGVzTGlzdCwgYXRJbmRleCl7XHJcbiAgICBpZih0aGlzLm1lZGlhQXJyYXkgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm1lZGlhQXJyYXkgPT09IG51bGwpe1xyXG4gICAgICBmb3IgKGxldCBmaSA9IDA7IGZpIDwgZmlsZXNMaXN0Lmxlbmd0aDsgZisrKSB7XHJcbiAgICAgICAgbGV0IHd0ZiA9IFtdXHJcbiAgICAgICAgd3RmLnB1c2goY3JlYXRlVVJMKGZpbGVzTGlzdFtmaV0pKTtcclxuICAgICAgICB0aGlzLm1lZGlhQXJyYXkgPSB3dGY7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYXRJbmRleCAhPSBudWxsICYmIGF0SW5kZXggIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMubWVkaWFBcnJheVthdEluZGV4XSA9IGNyZWF0ZVVSTChmaWxlc0xpc3RbMF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGYgPSAwO1xyXG4gICAgICBsZXQgaSA9IDA7XHJcbiAgICAgIHdoaWxlIChmIDwgZmlsZXNMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgIGxldCBhaCA9IGNyZWF0ZVVSTChmaWxlc0xpc3RbZl0pO1xyXG4gICAgICAgIGlmICh0aGlzLm1lZGlhQXJyYXlbaV0pIHsgLy8gaGFzIGVsZW1lbnQvbm90IGVtcHR5XHJcbiAgICAgICAgICBpKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubWVkaWFBcnJheVtpXSA9IGFoO1xyXG4gICAgICAgICAgZisrXHJcbiAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9yZS5zZXQoJ21lZGlhJywgdGhpcy5tZWRpYUFycmF5KTtcclxuICB9LFxyXG4gIGdhbGxlcnlNZWRpYShpbmRleCwgcGF0aCwgZmlsbCl7XHJcbiAgICBzdG9yZS5zZXQoYGdhbGxlcnlQYW5lbEl0ZW1zLiR7aW5kZXh9Lm1lZGlhLnBhdGhgLCBwYXRoKTtcclxuICAgIGNvbnNvbGUubG9nKHN0b3JlLmdldChgZ2FsbGVyeVBhbmVsSXRlbXMuJHtpbmRleH0ubWVkaWEucGF0aGApKTtcclxuICB9LFxyXG4gIGNvdmVyKGZpbGUpe1xyXG4gICAgbGV0IHUgPSBjcmVhdGVVUkwoZmlsZSk7XHJcbiAgICBzdG9yZS5zZXQoJ2NvdmVyJywgY3JlYXRlVVJMKGZpbGUpKTtcclxuICB9LFxyXG4gIHRvb2xiYXIocHJvcCwgdmFsKXtcclxuICAgIGlmICghdmFsaWRhdGUudG9vbGJhcihwcm9wLCB2YWwpKSB7cmV0dXJuIGZhbHNlfTtcclxuICAgIHN0b3JlLnNldChgdG9vbGJhci4ke3Byb3B9YCwgYCR7dmFsfWApO1xyXG4gICAgcmV0dXJuIHRydWVcclxuICB9LFxyXG4gIG1lZGlhRmlsbChhdEluZGV4LCBmaWxsTW9kZSl7XHJcbiAgIC8vIHN0b3JlLnNldChgbWVkaWFGaWxsLiR7YXRJbmRleH1gKSA9IGZpbGxNb2RlO1xyXG4gIH0sXHJcbiAgc3RvcmUoa2V5LCB2YWwpIHtcclxuICAgIGlmIChrZXkuaW5jbHVkZXMoXCJ0b29sYmFyXCIpKSB7XHJcbiAgICAgIGxldCBwcm9wID0ga2V5LnJlcGxhY2UoXCJ0b29sYmFyLlwiLCBcIlwiKTtcclxuICAgICAgcmV0dXJuIHNhdmUudG9vbGJhcihwcm9wLCB2YWwpO1xyXG4gICAgfVxyXG4gICAgc3RvcmUuc2V0KGtleSwgdmFsKTtcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfVxyXG59XHJcblxyXG5sZXQgbG9hZCA9IHtcclxuICB0b29sYmFySW5pdCgpe1xyXG4gICAgT2JqZWN0LmVudHJpZXMoc2NoZW1hLnRvb2xiYXIpLmZvckVhY2gocGFpciA9PiB7XHJcbiAgICAgIGlmICghc3RvcmUuaGFzKGB0b29sYmFyLiR7cGFpclswXX1gKSl7XHJcbiAgICAgICAgc3RvcmUuc2V0KGB0b29sYmFyLiR7cGFpclswXX1gLCBgJHtwYWlyWzFdLmRlZmF1bHR9YCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldChgdG9vbGJhcmApO1xyXG4gIH0sXHJcbiAgbWVkaWFJbml0KCl7XHJcbiAgICB0aGlzLm1lZGlhQXJyYXkgPSBzdG9yZS5nZXQoJ21lZGlhJyk7XHJcbiAgfSxcclxuICBnZXQgYWxsKCl7XHJcbiAgICByZXR1cm4gc3RvcmUuc3RvcmU7XHJcbiAgfSxcclxuICBtZWRpYShpbmRleCl7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCdnYWxsZXJ5UGFuZWxJdGVtcycpW2luZGV4XS5tZWRpYTtcclxuICB9LFxyXG4gIGdhbGxlcnlQYW5lbEl0ZW0oaW5kZXgpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldCgnZ2FsbGVyeVBhbmVsSXRlbXMnKVtpbmRleF07XHJcbiAgfSxcclxuICBnZXQgY292ZXIoKXtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoJ2NvdmVyJyk7XHJcbiAgfSxcclxuICBnZXQgdG9vbGJhcigpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldCgndG9vbGJhcicpO1xyXG4gIH0sXHJcbiAgc3RvcmUoa2V5KXtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoa2V5KTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBnYWxsZXJ5ID0ge1xyXG4gIGxhYmVsc0FycmF5OiBbXSxcclxuXHJcbiAgLyoqUmV0dXJucyBhbiBhcnJheSB3aXRoIGVsZW1lbnRzIFtcIk1PTlRITkFNRVwiLCBZRUFSOmludD8/PywgbW9udGhJTkRFWF0gKi9cclxuICBnZW5lcmF0ZUxhYmVscygpe1xyXG4gICAgbGV0IGRhdGEgPSBzdG9yZS5nZXQoJ3Rvb2xiYXInKTtcclxuICAgIHRoaXMubGFiZWxzQXJyYXkgPSB0aGlzLnNsb3RJbnQoKHlyLCBtSSkgPT4ge1xyXG4gICAgICByZXR1cm4gW2Ake01PTlRITkFNRVNbbUldfWAsIGAke3lyfWAsIG1JXTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHRoaXMubGFiZWxzQXJyYXk7XHJcbiAgfSxcclxuICBnZW5lcmF0ZUl0ZW1zKCl7XHJcbiAgICB0aGlzLmdlbmVyYXRlTGFiZWxzKCk7XHJcbiAgICBsZXQgcmVzdWx0ID0ge307XHJcbiAgICBsZXQgZXhpc3RpbmcgPSBsb2FkLnN0b3JlKCdnYWxsZXJ5UGFuZWxJdGVtcycpO1xyXG4gICAgZm9yIChsZXQgbCBpbiB0aGlzLmxhYmVsc0FycmF5KXtcclxuICAgICAgLy9leGlzdGluZ1tsXVxyXG4gICAgICBsZXQgcGF0aCA9IG51bGw7XHJcbiAgICAgIGxldCBmaWxsID0gJ2NvbnRhaW4nO1xyXG4gICAgICBsZXQgeWVhck4gPSB0aGlzLmxhYmVsc0FycmF5W2xdWzFdO1xyXG4gICAgICBsZXQgbW9udGhOID0gdGhpcy5sYWJlbHNBcnJheVtsXVsyXTtcclxuICAgICAgbGV0IHllYXJNb250aFRhZyA9IGAke3llYXJOfSR7bW9udGhOfWA7XHJcbiAgICAgIGlmIChleGlzdGluZyAmJiBleGlzdGluZ1t5ZWFyTW9udGhUYWddKXtcclxuICAgICAgICBwYXRoID0gZXhpc3RpbmdbeWVhck1vbnRoVGFnXS5tZWRpYS5wYXRoO1xyXG4gICAgICAgIGZpbGwgPSBleGlzdGluZ1t5ZWFyTW9udGhUYWddLm1lZGlhLmZpbGw7XHJcbiAgICAgIH1cclxuICAgICAgbGV0IG9iaiA9IHtcclxuICAgICAgICBsYWJlbDogdGhpcy5sYWJlbHNBcnJheVtsXVswXSxcclxuICAgICAgICB5ZWFyOiB5ZWFyTixcclxuICAgICAgICBtb250aDogbW9udGhOLFxyXG4gICAgICAgIG1lZGlhOiB7XHJcbiAgICAgICAgICBwYXRoOiBwYXRoLFxyXG4gICAgICAgICAgZmlsbDogZmlsbCxcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmVzdWx0W3llYXJNb250aFRhZ10gPSBvYmo7XHJcbiAgICB9XHJcbiAgICBzYXZlLnN0b3JlKCdnYWxsZXJ5UGFuZWxJdGVtcycsIHJlc3VsdCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0sXHJcbiAgc2xvdEludChjYWxsYmFjayA9ICh5ciwgbUkpID0+IHsgcmV0dXJuIFt5ciwgbUldfSl7XHJcbiAgICBsZXQgZm9ybWF0ID0gc3RvcmUuZ2V0KCd0b29sYmFyJyk7XHJcbiAgICBsZXQgcmVzdWx0ID0gW107XHJcbiAgICBsZXQgbWkgPSBwYXJzZUludChmb3JtYXQuc3RhcnRtb250aCk7XHJcbiAgICBsZXQgeWkgPSBwYXJzZUludChmb3JtYXQuc3RhcnR5ZWFyKTtcclxuXHJcbiAgICBsZXQgbWUgPSBwYXJzZUludChmb3JtYXQuZW5kbW9udGgpO1xyXG4gICAgbGV0IHllID0gcGFyc2VJbnQoZm9ybWF0LmVuZHllYXIpO1xyXG5cclxuICAgIHdoaWxlICh5aSA8PSB5ZSkge1xyXG4gICAgICByZXN1bHQucHVzaChjYWxsYmFjayh5aSxtaSkpO1xyXG4gICAgICBsZXQgc3RvcCA9ICh5aSA9PSB5ZSk/IG1lIDogMTEgO1xyXG4gICAgICBpZiAobWkgPCBzdG9wKSB7XHJcbiAgICAgICAgbWkrKztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBtaSA9IDA7XHJcbiAgICAgICAgeWkrKztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG5cclxuICBnZXQgbmVlZHNDb3Zlcigpe1xyXG4gICAgc3dpdGNoICh3b3Jrc3BhY2UuZm9ybWF0TW9kZSl7XHJcbiAgICAgIGNhc2UgJ2ZsaXAnOntcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgICBjYXNlICdnbGFuY2UnOiB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ3dpZGUnOntcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGdldCB0b3RhbE1vbnRocygpe1xyXG4gIHJldHVybiB0aGlzLmxhYmVsc0FycmF5Lmxlbmd0aDtcclxuICB9XHJcbn1cclxuXHJcbmxldCB3b3Jrc3BhY2UgPSB7XHJcbiAgZ2V0IGZvcm1hdE1vZGUoKXtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoJ3Rvb2xiYXIuZm9ybWF0Jyk7XHJcbiAgfSxcclxuICBnZXQgcGFwZXJTaXplKCl7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCd0b29sYmFyLnNpemUnKTtcclxuICB9LFxyXG4gIGdldCBwYXBlckxheW91dCgpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldCgndG9vbGJhci5sYXlvdXQnKTtcclxuICB9LFxyXG4gIGdldCBjb3Zlcigpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldCgnY292ZXInKTtcclxuICB9XHJcbn1cclxuXHJcbmxldCBzdHlsZSA9IHtcclxuICAvLyAgZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmdldFByb3BlcnR5VmFsdWUoJy0tdHJhbnNpdGlvblRpbWUnKS5yZXBsYWNlKC9tcy9nLCBcIlwiKTtcclxuICAvKiogRGV0ZXJtaW5lIGEgcmF0aW8gbXVsdGlwbGllcj8gRm9yIGdlbmVyYXRpbmcgdGh1bWJuYWlsIHByZXZpZXdzIEkgZ3Vlc3NcclxuICAgKiBUT0RPXHJcbiAgICovXHJcbiAgcGFwZXJSYXRpbygpe1xyXG4gICAgY29uc29sZS5sb2coZ2V0Q29tcHV0ZWRTdHlsZShkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpKTtcclxuICB9XHJcbn1cclxuXHJcblxyXG5sZXQgdmFsaWRhdGUgPSB7XHJcbiAgdG9vbGJhcihwcm9wTmFtZSwgbmV3VmFsKXtcclxuICAgIGxldCBmb3JtYXQgPSBzdG9yZS5nZXQoJ3Rvb2xiYXInKTtcclxuXHJcbiAgICBuZXdWYWwgPSBwYXJzZUludChuZXdWYWwpO1xyXG4gICAgc3dpdGNoIChwcm9wTmFtZSl7XHJcbiAgICAgIGNhc2UgJ2VuZHllYXInOntcclxuICAgICAgICByZXR1cm4gIShuZXdWYWwgPCBmb3JtYXQuc3RhcnR5ZWFyKTtcclxuICAgICAgfVxyXG4gICAgICBjYXNlICdzdGFydHllYXInOntcclxuICAgICAgICByZXR1cm4gIShuZXdWYWwgPiBmb3JtYXQuZW5keWVhcik7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnZW5kbW9udGgnOntcclxuICAgICAgICBpZiAoZm9ybWF0LmVuZHllYXIgPT0gZm9ybWF0LnN0YXJ0eWVhcil7XHJcbiAgICAgICAgICByZXR1cm4gIShuZXdWYWwgPCBmb3JtYXQuc3RhcnRtb250aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ3N0YXJ0bW9udGgnOntcclxuICAgICAgICBpZiAoZm9ybWF0LmVuZHllYXIgPT0gZm9ybWF0LnN0YXJ0eWVhcil7XHJcbiAgICAgICAgICByZXR1cm4gKG5ld1ZhbCA8PSBmb3JtYXQuZW5kbW9udGgpXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIGRlZmF1bHQ6e1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcblxyXG5sZXQgaG9saWRheXMgPSB7XHJcbiAgVVM6IGhvbGlkYXlJbml0KCdVUycpLFxyXG4gIENBOiBob2xpZGF5SW5pdCgnQ0EnKSxcclxuICBNWDogaG9saWRheUluaXQoJ01YJyksXHJcbiAgTkEoKXtcclxuICAgIC8vdWhoXHJcbiAgfVxyXG59XHJcblxyXG5jb25zb2xlLmxvZyhob2xpZGF5cy5DQSgyMDIwKSlcclxuY29uc29sZS5sb2coaG9saWRheXMuVVMoMjAyMCkpXHJcbmNvbnNvbGUubG9nKGhvbGlkYXlzLk1YKDIwMjApKVxyXG5cclxuZnVuY3Rpb24gaG9saWRheUluaXQoY29kZSwgbGFuZyl7XHJcbiAgbGV0IGggPSBuZXcgSG9saWRheXMoKTtcclxuICBsZXQgbCA9IGxhbmc7XHJcbiAgaWYgKCFsKSBsID0gJ2VuJztcclxuICBoLmluaXQoY29kZSk7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKHllYXIpe1xyXG4gICAgcmV0dXJuIGguZ2V0SG9saWRheXMoeWVhciwgbGFuZyk7XHJcbiAgfVxyXG59XHJcblxyXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuLy89PT09ICAgIFV0aWxpdHkgZnVuY3Rpb25zXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlVVJMKGZpbGUpe1xyXG4gIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKGZpbGUpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBzdHJpbmdpZnlGaWxlKGZpbGVPYmplY3Qpe1xyXG4gIC8vIGltcGxlbWVudCB0b0pTT04oKSBiZWhhdmlvciAgXHJcbiAgZmlsZU9iamVjdC50b0pTT04gPSBmdW5jdGlvbigpIHsgcmV0dXJuIHtcclxuICAgICAgJ2xhc3RNb2RpZmllZCcgICAgIDogZmlsZU9iamVjdC5sYXN0TW9kaWZpZWQsXHJcbiAgICAgICdsYXN0TW9kaWZpZWREYXRlJyA6IGZpbGVPYmplY3QubGFzdE1vZGlmaWVkRGF0ZSxcclxuICAgICAgJ25hbWUnICAgICAgICAgICAgIDogZmlsZU9iamVjdC5uYW1lLFxyXG4gICAgICAnc2l6ZScgICAgICAgICAgICAgOiBmaWxlT2JqZWN0LnNpemUsXHJcbiAgICAgICd0eXBlJyAgICAgICAgICAgICA6IGZpbGVPYmplY3QudHlwZSxcclxuICAgICAgJ3BhdGgnICAgICAgICAgICAgIDogZmlsZU9iamVjdC5wYXRoXHJcbiAgfTt9ICBcclxuXHJcbiAgLy8gdGhlbiB1c2UgSlNPTi5zdHJpbmdpZnkgb24gRmlsZSBvYmplY3RcclxuICByZXR1cm4gZmlsZU9iamVjdC50b0pTT04oKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQge1xyXG4gZ2FsbGVyeSxcclxuIHNhdmUsXHJcbiBsb2FkLFxyXG4gc3R5bGUsXHJcbiB3b3Jrc3BhY2UsXHJcbiBob2xpZGF5cyxcclxuIHN0b3JlLFxyXG4gdmFsaWRhdGVcclxufVxyXG5cclxuZXhwb3J0IHtzYXZlLCBsb2FkfTsiXSwic291cmNlUm9vdCI6IiJ9