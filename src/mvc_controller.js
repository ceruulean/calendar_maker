const electron = require('electron');
const {ipcRenderer} = electron;
const View = require('./mvc_view.js');

let selects = document.getElementsByTagName('select')

function wow() {
 // console.log(selects);
  for (let s = 0; s< selects.length; s++) {
      selects[s].addEventListener('change', (e) => {
      e.preventDefault();
       ipcRenderer.send(`select:format`, selects[s].name, e.target.value); // (eventName, data that we want to send) - eventName in the form a colon based system. (name of the thing you are dealing with:verb) - video:submit. electron app has to be set up to receive this message as well.
      });
  }
}



View.toolbarInit(ipcRenderer.sendSync('sync:init', 'toolbar'));
View.galleryPanelRender(ipcRenderer.sendSync('sync:galleryPanel', 'galleryPanel'), []);

//=============================================================
//====    Receive events from model/main process
//=============================================================

ipcRenderer.on('update:galleryPanel', (event, labels) => {
  View.galleryPanelRender(labels, []);
 // console.log(labels);
  });


  //const { path } = document.querySelector('input').files[0];


module.exports = {
  test: function(){
    console.log("test")
    },
  wow: wow,
  }