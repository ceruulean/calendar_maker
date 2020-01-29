const View = require('./mvc_view.js');
const Model = require('./mvc_model.js');

var selected = {
  month: null,
  set selectMonth(m){
    try{
      this.month.classList.remove('selected');
      m.classList.add('selected');
    //  Model.gallery.slotInt;
    //  View.workspace.render(monthsArr, formatPaper);
    } catch {

    }
    this.month = m;
  },
  get index(){
    return this.month.tabIndex;
  }
};

/* INIT */
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
  //console.log('uploadalot')
    Model.save.media(event.target.files, atIndex);
    __renderGallery();
}

uploadMultiple.addEventListener('change', function(e){mediaUploadHandler(e)});

View.uploader.single.addEventListener('change', function(e) {mediaUploadHandler(e, selected.index)})

function __renderGallery(){
  let Items = View.gallery.renderPanel(Model.gallery.generateLabels(), Model.load.media);
  //unregister things?
  //update labels, blah blah
  let handler = (ele) => {
    selected.selectMonth = ele;
    if (ele.children[0].classList.contains('placeholder')) {
      View.uploader.openSingleBrowser();
    }
  }
  for (let i = 0; i < Items.length; i++) {
    //console.log(i);
    Items[i].addEventListener('click', function(){handler(Items[i])});
  }
  View.uploader.renderBuffer(Model.load.media, Model.gallery.totalMonths);
}

//=============================================================
//====    Receive events from model/main process
//=============================================================


module.exports = {
  
  }