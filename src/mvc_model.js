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
    }
  },

  media: {},
};

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
        if (i > gallery.totalMonths || f > gallery.totalMonths) {
          break;
        }
      }
    }
    store.set('media', mediaArray);
  },
  toolbar(prop, val){
    store.set(`toolbar.${prop}`, `${val}`);
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
  get all(){
    return store.store;
  },
  get media(){
    return store.get('media');
  },
  get toolbar(){
    return store.get('toolbar');
  },
}

let gallery = {
  labelsArray: [],

  /**Returns an array with elements ["MONTHNAME", YEAR:int???] */
  generateLabels(){
    let data = store.get('toolbar');
    this.labelsArray = this.slotInt(data, (yr, mI) => {
      return [`${MONTHNAMES[mI]}`, `${yr}`];
    })
    switch (data.format) {
      case 'Wide' : {
  
      }
      case 'Glance' : {
  
      }
      case 'Flip' : {
        this.labelsArray.unshift('Cover');
      }
      default : {
  
      }
    }
    return this.labelsArray;
  },
  slotInt(format, callback = (yr, mI) => { return [yr, mI]}){
    let result = [];
    let m = parseInt(format.startmonth);
    let y = parseInt(format.startyear);
    while (y <= parseInt(format.endyear)) {
      while (m <= parseInt(format.endmonth)) {
        result.push(callback(y,m));
        m++;
      }
      m = 0;
      y++;
    }
    return result;
  },

  get totalMonths(){
  return this.labelsArray.length;
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
      'path'             :fileObject.path
  };}  

  // then use JSON.stringify on File object
  return fileObject.toJSON();
}

module.exports = {
 gallery,
 save,
 load,
 style,
  }