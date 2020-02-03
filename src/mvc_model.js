const Cal = require('./calendar');
const Store = require('electron-store');
let MONTHNAMES = Cal.MONTHS["MINI"];

const store = new Store();

let mediaArray = [];

var thisYear = new Date().getFullYear();

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
      default: 'Flip'
    },
    size:{
      type: 'string',
      default: 'letter'
    }
  },

  media: {},
  mediaFill:{},
  cover: {},
};

//store.clear();

let save = {
  media(filesList, atIndex){
    if (atIndex != null && atIndex != undefined) {
      mediaArray[atIndex] = stringifyFile(filesList[0]);
    } else {
      let f = 0;
      let i = 0;
      while (f < filesList.length) {
        let ah = stringifyFile(filesList[f]);
        if (mediaArray[i]) { // has element/not empty
          i++;
        } else {
          mediaArray[i] = ah;
          f++
          i++;
        }
      }
    }
    store.set('media', mediaArray);
  },
  cover(file){
    let test =  stringifyFile(file);
    store.set('cover', test);
  },
  toolbar(prop, val){
    store.set(`toolbar.${prop}`, `${val}`);
  },
  mediaFill(atIndex, fillMode){
    store.set(`mediaFill.${atIndex}`) = fillMode;
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
    console.log(store.has('media'));
    mediaArray = store.get('media');
  },
  get all(){
    return store.store;
  },
  get media(){
    return store.get('media');
  },
  get cover(){
    return store.get('cover');
  },
  get toolbar(){
    return store.get('toolbar');
  },
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
  slotInt(callback = (yr, mI) => { return [yr, mI]}){
    let format = store.get('toolbar');
    let result = [];
    let mi = parseInt(format.startmonth);
    let yi = parseInt(format.startyear);

    let me = parseInt(format.endmonth);
    let ye = parseInt(format.endyear);

    while (yi <= ye) {
      //console.log(`${yi}, ${mi}`)
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
  get coverPath(){
    return store.get('cover').path;
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


//=============================================================
//====    Utility functions
//=============================================================

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

/** Creates an array of [MONTHINDEX, YEAR] from 0-11 (Jan - Dec) */
function wholeYear(year){
  let array = []
  for (let i = 0; i < 12;i++){
    array.push([i, year])
  }
  return array;
}

module.exports = {
 gallery,
 save,
 load,
 style,
 workspace,
  }