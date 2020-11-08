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
    store.set(`galleryPanelItems.${index}.media.path`, createURL(path));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvbXZjX21vZGVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBLGlCQUFpQixtQkFBTyxDQUFDLGdFQUFlO0FBQ3hDO0FBQ0EsWUFBWSxtQkFBTyxDQUFDLHVEQUFxQjtBQUN6QztBQUNtQzs7QUFFbkM7O0FBRUEsa0JBQWtCLHVEQUFHOztBQUVyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0EsV0FBVztBQUNYLFdBQVc7QUFDWCxjQUFjO0FBQ2QsV0FBVztBQUNYO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxXQUFXO0FBQ1g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLHVCQUF1QjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLG1DQUFtQyxNQUFNO0FBQ3pDLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSx1Q0FBdUM7QUFDdkMseUJBQXlCLEtBQUssTUFBTSxJQUFJO0FBQ3hDO0FBQ0EsR0FBRztBQUNIO0FBQ0EsNkJBQTZCLFFBQVE7QUFDckMsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnQ0FBZ0MsUUFBUTtBQUN4Qyw2QkFBNkIsUUFBUSxNQUFNLGdCQUFnQjtBQUMzRDtBQUNBLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLGVBQWUsTUFBTSxHQUFHO0FBQ3pDLEtBQUs7QUFDTDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixNQUFNLEVBQUUsT0FBTztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNILGtDQUFrQyxpQkFBaUI7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLOztBQUVBO0FBQ0E7QUFDQTs7QUFFZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDIiwiZmlsZSI6Im1haW5fd2luZG93LjE3ZWEwZjllZGNkY2U5YTA2MzE0LmhvdC11cGRhdGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBIb2xpZGF5cyA9IHJlcXVpcmUoJ2RhdGUtaG9saWRheXMnKVxyXG5jb25zdCBDT1VOVFJJRVMgPSBuZXcgSG9saWRheXMoKS5nZXRDb3VudHJpZXMoJ2VuJyk7XHJcbmNvbnN0IENhbCA9IHJlcXVpcmUoJy4vY2FsZW5kYXIvY2FsZW5kYXInKTtcclxuLy9jb25zdCBTdG9yZSA9IHJlcXVpcmUoJ2VsZWN0cm9uLXN0b3JlJyk7XHJcbmltcG9ydCBkb3QgZnJvbSAnLi9zdG9yZS9kb3RzdG9yZSc7XHJcblxyXG5sZXQgTU9OVEhOQU1FUyA9IENhbC5NT05USFNbXCJNSU5JXCJdO1xyXG5cclxuY29uc3Qgc3RvcmUgPSBuZXcgZG90LlN0b3JlKDUwKTtcclxuXHJcbnZhciB0aGlzWWVhciA9IG5ldyBEYXRlKCkuZ2V0RnVsbFllYXIoKTtcclxuXHJcbnN0b3JlLmNsZWFyKCk7XHJcblxyXG5jb25zdCBzY2hlbWEgPSB7XHJcbiAgdG9vbGJhcjoge1xyXG4gICAgc3RhcnRtb250aDoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogMFxyXG4gICAgfSxcclxuICAgIHN0YXJ0eWVhcjoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogdGhpc1llYXIsXHJcbiAgICB9LFxyXG4gICAgZW5kbW9udGg6IHtcclxuICAgICAgdHlwZTogJ251bWJlcicsXHJcbiAgICAgIGRlZmF1bHQ6IDExXHJcbiAgICB9LFxyXG4gICAgZW5keWVhcjoge1xyXG4gICAgICB0eXBlOiAnbnVtYmVyJyxcclxuICAgICAgZGVmYXVsdDogdGhpc1llYXIsXHJcbiAgICB9LFxyXG4gICAgZm9ybWF0OiB7XHJcbiAgICAgIHR5cGU6ICdzdHJpbmcnLFxyXG4gICAgICBkZWZhdWx0OiAnZmxpcCdcclxuICAgIH0sXHJcbiAgICBzaXplOntcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6ICdsZXR0ZXInXHJcbiAgICB9LFxyXG4gICAgbGF5b3V0OntcclxuICAgICAgdHlwZTogJ3N0cmluZycsXHJcbiAgICAgIGRlZmF1bHQ6ICdsYW5kc2NhcGUnXHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgLy9cclxuICBtZWRpYVA6e30sXHJcbiAgbWVkaWE6IHt9LFxyXG4gIG1lZGlhRmlsbDp7fSxcclxuICBjb3Zlcjoge30sXHJcbiAgZ2FsbGVyeVBhbmVsSXRlbXM6IFtdXHJcbn07XHJcblxyXG5cclxubGV0IE1FRElBTUFQID0ge1xyXG4gIE06IG5ldyBNYXAoKSxcclxuICBoYXMobSwgeSl7XHJcbiAgICByZXR1cm4gdGhpcy5NLmhhcyhbbSx5XSk7XHJcbiAgfSxcclxuICBnZXQobSwgeSl7XHJcbiAgICByZXR1cm4gdGhpcy5NLmdldChbbSwgeV0pO1xyXG4gIH0sXHJcbiAgc2V0KG1vbnRoSW5kZXgsIHllYXIsIHBhdGgsIGZpbGwpe1xyXG4gICAgb2JqID0ge3BhdGg6IHBhdGgsIGZpbGw6IGZpbGw/IGZpbGwgOiAnY29udGFpbid9O1xyXG4gICAgdGhpcy5NLnNldChbbW9udGhJbmRleCwgeWVhcl0sIG9iaik7XHJcbiAgfSxcclxuICBkZWxldGUobSwgeSl7XHJcbiAgICB0aGlzLk0uZGVsZXRlKG0sIHkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmxldCBzYXZlID0ge1xyXG4gIG1lZGlhQXJyYXk6IFtdLFxyXG4gIG1lZGlhKGZpbGVzTGlzdCwgYXRJbmRleCl7XHJcbiAgICBpZih0aGlzLm1lZGlhQXJyYXkgPT09IHVuZGVmaW5lZCB8fCB0aGlzLm1lZGlhQXJyYXkgPT09IG51bGwpe1xyXG4gICAgICBmb3IgKGxldCBmaSA9IDA7IGZpIDwgZmlsZXNMaXN0Lmxlbmd0aDsgZisrKSB7XHJcbiAgICAgICAgbGV0IHd0ZiA9IFtdXHJcbiAgICAgICAgd3RmLnB1c2goY3JlYXRlVVJMKGZpbGVzTGlzdFtmaV0pKTtcclxuICAgICAgICB0aGlzLm1lZGlhQXJyYXkgPSB3dGY7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoYXRJbmRleCAhPSBudWxsICYmIGF0SW5kZXggIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIHRoaXMubWVkaWFBcnJheVthdEluZGV4XSA9IGNyZWF0ZVVSTChmaWxlc0xpc3RbMF0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbGV0IGYgPSAwO1xyXG4gICAgICBsZXQgaSA9IDA7XHJcbiAgICAgIHdoaWxlIChmIDwgZmlsZXNMaXN0Lmxlbmd0aCkge1xyXG4gICAgICAgIGxldCBhaCA9IGNyZWF0ZVVSTChmaWxlc0xpc3RbZl0pO1xyXG4gICAgICAgIGlmICh0aGlzLm1lZGlhQXJyYXlbaV0pIHsgLy8gaGFzIGVsZW1lbnQvbm90IGVtcHR5XHJcbiAgICAgICAgICBpKys7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMubWVkaWFBcnJheVtpXSA9IGFoO1xyXG4gICAgICAgICAgZisrXHJcbiAgICAgICAgICBpKys7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBzdG9yZS5zZXQoJ21lZGlhJywgdGhpcy5tZWRpYUFycmF5KTtcclxuICB9LFxyXG4gIGdhbGxlcnlNZWRpYShpbmRleCwgcGF0aCwgZmlsbCl7XHJcbiAgICBzdG9yZS5zZXQoYGdhbGxlcnlQYW5lbEl0ZW1zLiR7aW5kZXh9Lm1lZGlhLnBhdGhgLCBjcmVhdGVVUkwocGF0aCkpO1xyXG4gIH0sXHJcbiAgY292ZXIoZmlsZSl7XHJcbiAgICBsZXQgdSA9IGNyZWF0ZVVSTChmaWxlKTtcclxuICAgIHN0b3JlLnNldCgnY292ZXInLCBjcmVhdGVVUkwoZmlsZSkpO1xyXG4gIH0sXHJcbiAgdG9vbGJhcihwcm9wLCB2YWwpe1xyXG4gICAgaWYgKCF2YWxpZGF0ZS50b29sYmFyKHByb3AsIHZhbCkpIHtyZXR1cm4gZmFsc2V9O1xyXG4gICAgc3RvcmUuc2V0KGB0b29sYmFyLiR7cHJvcH1gLCBgJHt2YWx9YCk7XHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH0sXHJcbiAgbWVkaWFGaWxsKGF0SW5kZXgsIGZpbGxNb2RlKXtcclxuICAgLy8gc3RvcmUuc2V0KGBtZWRpYUZpbGwuJHthdEluZGV4fWApID0gZmlsbE1vZGU7XHJcbiAgfSxcclxuICBzdG9yZShrZXksIHZhbCkge1xyXG4gICAgaWYgKGtleS5pbmNsdWRlcyhcInRvb2xiYXJcIikpIHtcclxuICAgICAgbGV0IHByb3AgPSBrZXkucmVwbGFjZShcInRvb2xiYXIuXCIsIFwiXCIpO1xyXG4gICAgICByZXR1cm4gc2F2ZS50b29sYmFyKHByb3AsIHZhbCk7XHJcbiAgICB9XHJcbiAgICBzdG9yZS5zZXQoa2V5LCB2YWwpO1xyXG4gICAgcmV0dXJuIHRydWVcclxuICB9XHJcbn1cclxuXHJcbmxldCBsb2FkID0ge1xyXG4gIHRvb2xiYXJJbml0KCl7XHJcbiAgICBPYmplY3QuZW50cmllcyhzY2hlbWEudG9vbGJhcikuZm9yRWFjaChwYWlyID0+IHtcclxuICAgICAgaWYgKCFzdG9yZS5oYXMoYHRvb2xiYXIuJHtwYWlyWzBdfWApKXtcclxuICAgICAgICBzdG9yZS5zZXQoYHRvb2xiYXIuJHtwYWlyWzBdfWAsIGAke3BhaXJbMV0uZGVmYXVsdH1gKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KGB0b29sYmFyYCk7XHJcbiAgfSxcclxuICBtZWRpYUluaXQoKXtcclxuICAgIHRoaXMubWVkaWFBcnJheSA9IHN0b3JlLmdldCgnbWVkaWEnKTtcclxuICB9LFxyXG4gIGdldCBhbGwoKXtcclxuICAgIHJldHVybiBzdG9yZS5zdG9yZTtcclxuICB9LFxyXG4gIG1lZGlhKGluZGV4KXtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoJ2dhbGxlcnlQYW5lbEl0ZW1zJylbaW5kZXhdLm1lZGlhO1xyXG4gIH0sXHJcbiAgZ2FsbGVyeVBhbmVsSXRlbShpbmRleCl7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCdnYWxsZXJ5UGFuZWxJdGVtcycpW2luZGV4XTtcclxuICB9LFxyXG4gIGdldCBjb3Zlcigpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldCgnY292ZXInKTtcclxuICB9LFxyXG4gIGdldCB0b29sYmFyKCl7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCd0b29sYmFyJyk7XHJcbiAgfSxcclxuICBzdG9yZShrZXkpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldChrZXkpO1xyXG4gIH1cclxufVxyXG5cclxubGV0IGdhbGxlcnkgPSB7XHJcbiAgbGFiZWxzQXJyYXk6IFtdLFxyXG5cclxuICAvKipSZXR1cm5zIGFuIGFycmF5IHdpdGggZWxlbWVudHMgW1wiTU9OVEhOQU1FXCIsIFlFQVI6aW50Pz8/LCBtb250aElOREVYXSAqL1xyXG4gIGdlbmVyYXRlTGFiZWxzKCl7XHJcbiAgICBsZXQgZGF0YSA9IHN0b3JlLmdldCgndG9vbGJhcicpO1xyXG4gICAgdGhpcy5sYWJlbHNBcnJheSA9IHRoaXMuc2xvdEludCgoeXIsIG1JKSA9PiB7XHJcbiAgICAgIHJldHVybiBbYCR7TU9OVEhOQU1FU1ttSV19YCwgYCR7eXJ9YCwgbUldO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gdGhpcy5sYWJlbHNBcnJheTtcclxuICB9LFxyXG4gIGdlbmVyYXRlSXRlbXMoKXtcclxuICAgIHRoaXMuZ2VuZXJhdGVMYWJlbHMoKTtcclxuICAgIGxldCByZXN1bHQgPSB7fTtcclxuICAgIGxldCBleGlzdGluZyA9IGxvYWQuc3RvcmUoJ2dhbGxlcnlQYW5lbEl0ZW1zJyk7XHJcbiAgICBmb3IgKGxldCBsIGluIHRoaXMubGFiZWxzQXJyYXkpe1xyXG4gICAgICAvL2V4aXN0aW5nW2xdXHJcbiAgICAgIGxldCBwYXRoID0gbnVsbDtcclxuICAgICAgbGV0IGZpbGwgPSAnY29udGFpbic7XHJcbiAgICAgIGxldCB5ZWFyTiA9IHRoaXMubGFiZWxzQXJyYXlbbF1bMV07XHJcbiAgICAgIGxldCBtb250aE4gPSB0aGlzLmxhYmVsc0FycmF5W2xdWzJdO1xyXG4gICAgICBsZXQgeWVhck1vbnRoVGFnID0gYCR7eWVhck59JHttb250aE59YDtcclxuICAgICAgaWYgKGV4aXN0aW5nICYmIGV4aXN0aW5nW3llYXJNb250aFRhZ10pe1xyXG4gICAgICAgIHBhdGggPSBleGlzdGluZ1t5ZWFyTW9udGhUYWddLm1lZGlhLnBhdGg7XHJcbiAgICAgICAgZmlsbCA9IGV4aXN0aW5nW3llYXJNb250aFRhZ10ubWVkaWEuZmlsbDtcclxuICAgICAgfVxyXG4gICAgICBsZXQgb2JqID0ge1xyXG4gICAgICAgIGxhYmVsOiB0aGlzLmxhYmVsc0FycmF5W2xdWzBdLFxyXG4gICAgICAgIHllYXI6IHllYXJOLFxyXG4gICAgICAgIG1vbnRoOiBtb250aE4sXHJcbiAgICAgICAgbWVkaWE6IHtcclxuICAgICAgICAgIHBhdGg6IHBhdGgsXHJcbiAgICAgICAgICBmaWxsOiBmaWxsLFxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXN1bHRbeWVhck1vbnRoVGFnXSA9IG9iajtcclxuICAgIH1cclxuICAgIHNhdmUuc3RvcmUoJ2dhbGxlcnlQYW5lbEl0ZW1zJywgcmVzdWx0KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxuICBzbG90SW50KGNhbGxiYWNrID0gKHlyLCBtSSkgPT4geyByZXR1cm4gW3lyLCBtSV19KXtcclxuICAgIGxldCBmb3JtYXQgPSBzdG9yZS5nZXQoJ3Rvb2xiYXInKTtcclxuICAgIGxldCByZXN1bHQgPSBbXTtcclxuICAgIGxldCBtaSA9IHBhcnNlSW50KGZvcm1hdC5zdGFydG1vbnRoKTtcclxuICAgIGxldCB5aSA9IHBhcnNlSW50KGZvcm1hdC5zdGFydHllYXIpO1xyXG5cclxuICAgIGxldCBtZSA9IHBhcnNlSW50KGZvcm1hdC5lbmRtb250aCk7XHJcbiAgICBsZXQgeWUgPSBwYXJzZUludChmb3JtYXQuZW5keWVhcik7XHJcblxyXG4gICAgd2hpbGUgKHlpIDw9IHllKSB7XHJcbiAgICAgIHJlc3VsdC5wdXNoKGNhbGxiYWNrKHlpLG1pKSk7XHJcbiAgICAgIGxldCBzdG9wID0gKHlpID09IHllKT8gbWUgOiAxMSA7XHJcbiAgICAgIGlmIChtaSA8IHN0b3ApIHtcclxuICAgICAgICBtaSsrO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG1pID0gMDtcclxuICAgICAgICB5aSsrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0sXHJcblxyXG4gIGdldCBuZWVkc0NvdmVyKCl7XHJcbiAgICBzd2l0Y2ggKHdvcmtzcGFjZS5mb3JtYXRNb2RlKXtcclxuICAgICAgY2FzZSAnZmxpcCc6e1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ2dsYW5jZSc6IHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnd2lkZSc6e1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZ2V0IHRvdGFsTW9udGhzKCl7XHJcbiAgcmV0dXJuIHRoaXMubGFiZWxzQXJyYXkubGVuZ3RoO1xyXG4gIH1cclxufVxyXG5cclxubGV0IHdvcmtzcGFjZSA9IHtcclxuICBnZXQgZm9ybWF0TW9kZSgpe1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldCgndG9vbGJhci5mb3JtYXQnKTtcclxuICB9LFxyXG4gIGdldCBwYXBlclNpemUoKXtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoJ3Rvb2xiYXIuc2l6ZScpO1xyXG4gIH0sXHJcbiAgZ2V0IHBhcGVyTGF5b3V0KCl7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCd0b29sYmFyLmxheW91dCcpO1xyXG4gIH0sXHJcbiAgZ2V0IGNvdmVyKCl7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KCdjb3ZlcicpO1xyXG4gIH1cclxufVxyXG5cclxubGV0IHN0eWxlID0ge1xyXG4gIC8vICBnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZSgnLS10cmFuc2l0aW9uVGltZScpLnJlcGxhY2UoL21zL2csIFwiXCIpO1xyXG4gIC8qKiBEZXRlcm1pbmUgYSByYXRpbyBtdWx0aXBsaWVyPyBGb3IgZ2VuZXJhdGluZyB0aHVtYm5haWwgcHJldmlld3MgSSBndWVzc1xyXG4gICAqIFRPRE9cclxuICAgKi9cclxuICBwYXBlclJhdGlvKCl7XHJcbiAgICBjb25zb2xlLmxvZyhnZXRDb21wdXRlZFN0eWxlKGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkpO1xyXG4gIH1cclxufVxyXG5cclxuXHJcbmxldCB2YWxpZGF0ZSA9IHtcclxuICB0b29sYmFyKHByb3BOYW1lLCBuZXdWYWwpe1xyXG4gICAgbGV0IGZvcm1hdCA9IHN0b3JlLmdldCgndG9vbGJhcicpO1xyXG5cclxuICAgIG5ld1ZhbCA9IHBhcnNlSW50KG5ld1ZhbCk7XHJcbiAgICBzd2l0Y2ggKHByb3BOYW1lKXtcclxuICAgICAgY2FzZSAnZW5keWVhcic6e1xyXG4gICAgICAgIHJldHVybiAhKG5ld1ZhbCA8IGZvcm1hdC5zdGFydHllYXIpO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgJ3N0YXJ0eWVhcic6e1xyXG4gICAgICAgIHJldHVybiAhKG5ld1ZhbCA+IGZvcm1hdC5lbmR5ZWFyKTtcclxuICAgICAgfVxyXG4gICAgICBjYXNlICdlbmRtb250aCc6e1xyXG4gICAgICAgIGlmIChmb3JtYXQuZW5keWVhciA9PSBmb3JtYXQuc3RhcnR5ZWFyKXtcclxuICAgICAgICAgIHJldHVybiAhKG5ld1ZhbCA8IGZvcm1hdC5zdGFydG1vbnRoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSAnc3RhcnRtb250aCc6e1xyXG4gICAgICAgIGlmIChmb3JtYXQuZW5keWVhciA9PSBmb3JtYXQuc3RhcnR5ZWFyKXtcclxuICAgICAgICAgIHJldHVybiAobmV3VmFsIDw9IGZvcm1hdC5lbmRtb250aClcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZGVmYXVsdDp7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmxldCBob2xpZGF5cyA9IHtcclxuICBVUzogaG9saWRheUluaXQoJ1VTJyksXHJcbiAgQ0E6IGhvbGlkYXlJbml0KCdDQScpLFxyXG4gIE1YOiBob2xpZGF5SW5pdCgnTVgnKSxcclxuICBOQSgpe1xyXG4gICAgLy91aGhcclxuICB9XHJcbn1cclxuXHJcbmNvbnNvbGUubG9nKGhvbGlkYXlzLkNBKDIwMjApKVxyXG5jb25zb2xlLmxvZyhob2xpZGF5cy5VUygyMDIwKSlcclxuY29uc29sZS5sb2coaG9saWRheXMuTVgoMjAyMCkpXHJcblxyXG5mdW5jdGlvbiBob2xpZGF5SW5pdChjb2RlLCBsYW5nKXtcclxuICBsZXQgaCA9IG5ldyBIb2xpZGF5cygpO1xyXG4gIGxldCBsID0gbGFuZztcclxuICBpZiAoIWwpIGwgPSAnZW4nO1xyXG4gIGguaW5pdChjb2RlKTtcclxuICByZXR1cm4gZnVuY3Rpb24oeWVhcil7XHJcbiAgICByZXR1cm4gaC5nZXRIb2xpZGF5cyh5ZWFyLCBsYW5nKTtcclxuICB9XHJcbn1cclxuXHJcbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4vLz09PT0gICAgVXRpbGl0eSBmdW5jdGlvbnNcclxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVVUkwoZmlsZSl7XHJcbiAgcmV0dXJuIFVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHN0cmluZ2lmeUZpbGUoZmlsZU9iamVjdCl7XHJcbiAgLy8gaW1wbGVtZW50IHRvSlNPTigpIGJlaGF2aW9yICBcclxuICBmaWxlT2JqZWN0LnRvSlNPTiA9IGZ1bmN0aW9uKCkgeyByZXR1cm4ge1xyXG4gICAgICAnbGFzdE1vZGlmaWVkJyAgICAgOiBmaWxlT2JqZWN0Lmxhc3RNb2RpZmllZCxcclxuICAgICAgJ2xhc3RNb2RpZmllZERhdGUnIDogZmlsZU9iamVjdC5sYXN0TW9kaWZpZWREYXRlLFxyXG4gICAgICAnbmFtZScgICAgICAgICAgICAgOiBmaWxlT2JqZWN0Lm5hbWUsXHJcbiAgICAgICdzaXplJyAgICAgICAgICAgICA6IGZpbGVPYmplY3Quc2l6ZSxcclxuICAgICAgJ3R5cGUnICAgICAgICAgICAgIDogZmlsZU9iamVjdC50eXBlLFxyXG4gICAgICAncGF0aCcgICAgICAgICAgICAgOiBmaWxlT2JqZWN0LnBhdGhcclxuICB9O30gIFxyXG5cclxuICAvLyB0aGVuIHVzZSBKU09OLnN0cmluZ2lmeSBvbiBGaWxlIG9iamVjdFxyXG4gIHJldHVybiBmaWxlT2JqZWN0LnRvSlNPTigpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCB7XHJcbiBnYWxsZXJ5LFxyXG4gc2F2ZSxcclxuIGxvYWQsXHJcbiBzdHlsZSxcclxuIHdvcmtzcGFjZSxcclxuIGhvbGlkYXlzLFxyXG4gc3RvcmUsXHJcbiB2YWxpZGF0ZVxyXG59XHJcblxyXG5leHBvcnQge3NhdmUsIGxvYWR9OyJdLCJzb3VyY2VSb290IjoiIn0=