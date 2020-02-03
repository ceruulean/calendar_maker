const View = require('./mvc_view.js');
const Model = require('./mvc_model.js');
var Split = require('split.js')


/**
 * Regarding selection of a gallery item
 */
var selected = {
  item: null,
  set selectItem(m){
    try{
      this.item.classList.remove('selected');
      m.classList.add('selected');
    } catch {

    }
    this.item = m;
  },
  get index(){
    if (!this.item) return -1;
    return this.item.tabIndex;
  }
};

/* =============================== 
================ INIT ============== 
--------------------------------------*/
let toolbarForm = View.toolbar.init(Model.load.toolbarInit());
    /* event Registration for <Select> */
let onChangeToolbar = (e, propName) => {
  console.log(e);
  Model.save.toolbar(propName, e.target.value);
  __renderGallery();
}

  let updatePages = (event) => {
    let attr = event.target.name;
    let newVal = event.target.value;
    Model.save.toolbar(attr, newVal);
    let pages = document.getElementsByTagName('page');
    for (let p = 0; p < pages.length; p++) {
      console.log(p);
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
  for (let i in toolbarForm.inputs) {
    toolbarForm.inputs[i].addEventListener('change', function(e){onChangeToolbar(e, toolbarForm.inputs[i].name)});
  }
  __renderGallery();


/* 
=========================================
======== File Upload registration
=========================================
*/


let uploadMultiple = document.getElementById('upload-multiple');

let mediaUploadHandler = (event, atIndex) => {
  if (atIndex === -1) {
    Model.save.cover(event.target.files[0]);
  } else {
    Model.save.media(event.target.files, atIndex);
  }
  __renderGallery();
}

uploadMultiple.addEventListener('change', function(e){mediaUploadHandler(e)});
View.uploader.single.addEventListener('change', function(e) {mediaUploadHandler(e, selected.index)})


/* ---- ------ ----- - Render stuff
========================================= */

let __renderInWorkspace = {
  calendar(){
    let labels = Model.gallery.labelsArray;
    let index = selected.index;
    const retrieve = Model.workspace;
    View.workspace.createCalendar(
      labels[index][1],
      labels[index][2],
      retrieve.paperSize,
      retrieve.paperLayout,
      retrieve.formatMode,
      Model.load.media[index].path);
  },
  coverPage(){
    let retrieve = Model.workspace;
    View.workspace.renderCover(retrieve.paperSize, retrieve.paperLayout, retrieve.coverPath);
  }
}

function __renderGallery(){

  let handler = (ele) => {
    selected.selectItem = ele;
    if (ele.children[0].classList.contains('placeholder')) {
      View.uploader.openSingleBrowser();
    }
  }

  View.gallery.clearPanel();
console.log(Model.gallery.needsCover);
  if (Model.gallery.needsCover) { // Coverrrrrrrrrrrrrrrrrrrrrrrrrrr
    let cover = View.gallery.insertCover(Model.load.cover);
    cover.addEventListener('click', function(){
      handler(View.gallery.root.children[0]);
      __renderInWorkspace.coverPage();
    });
  }

  let Items = View.gallery.renderPanel(Model.gallery.generateLabels(), Model.load.media);

  for (let i = 0; i < Items.length; i++) {
    Items[i].addEventListener('click', function(){
      handler(Items[i]);
      __renderInWorkspace.calendar();
    });
  }
  View.uploader.renderBuffer(Model.load.media, Model.gallery.totalMonths);
}

/* =============================================================
=========    Interaction
============================================================= */

//Panel resizer
Split(['#uploader', '#gallery-panel','#workspace', '#properties-panel'], {
  minSize:1,
  sizes:[10, 10, 65, 15], // must add up to 100 (%)
  gutterSize: 8,
});

module.exports = {
  
  }