const View = require('./mvc_view.js');
const Model = require('./mvc_model.js');


/**
 * Regarding selection of a gallery item
 */
var selected = {
  month: null,
  set selectMonth(m){
    try{
      this.month.classList.remove('selected');
      m.classList.add('selected');
      let labels = Model.gallery.labelsArray;
      let index = m.tabIndex;
      View.workspace.createCalendar(labels[index][1],
                                    labels[index][2],
                                    'letter', `landscape`,
                                    Model.workspace.formatMode,
                                    Model.load.media[index].path);
    } catch {

    }
    this.month = m;
  },
  get index(){
    if (!this.month) return -1;
    return this.month.tabIndex;
  }
};

/* =============================== 
================ INIT ============== */
let toolbarForm = View.toolbarInit(Model.load.toolbarInit());


/* event Registration for <Select> */
let onChangeToolbar = (e, propName) => {
  Model.save.toolbar(propName, e.target.value);
  __renderGallery();
}

  for (let s in toolbarForm.selects) {
    toolbarForm.selects[s].addEventListener('change', function(e){onChangeToolbar(e, toolbarForm.selects[s].name)});
  }
  for (let i in toolbarForm.inputs) {
    toolbarForm.inputs[i].addEventListener('change', function(e){onChangeToolbar(e, toolbarForm.inputs[i].name)});
  }

  __renderGallery();


/* 

File Upload registration

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


/**
 * 
 * Render stuff
 * 
 * 
 */
function __renderGallery(){
  View.gallery.clearPanel();
  if (Model.gallery.needsCover) {
    let cover = View.gallery.insertCover(Model.load.cover);
    cover.addEventListener('click', function(){
      if (ele.children[0].classList.contains('placeholder')) {
        View.uploader.openSingleBrowser();
      }
    });
  }

  let Items = View.gallery.renderPanel(Model.gallery.generateLabels(), Model.load.media);

  let handler = (ele) => {
    selected.selectMonth = ele;
    if (ele.children[0].classList.contains('placeholder')) {
      View.uploader.openSingleBrowser();
    }
  }
  for (let i = 0; i < Items.length; i++) {
    Items[i].addEventListener('click', function(){handler(Items[i])});
  }
  View.uploader.renderBuffer(Model.load.media, Model.gallery.totalMonths);
}

//=============================================================
//====    Receive events from model/main process
//=============================================================


module.exports = {
  
  }