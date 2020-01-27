const { app, BrowserWindow, ipcMain } = require('electron');
//const Controller = require('./mvc_controller');
const Store = require('electron-store');
const Model = require('./src/mvc_model.js');
 


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

var thisYear = new Date().getFullYear();

const schema = {
  format: {
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

const store = new Store({schema});

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({
    width: 1500,
    height: 1000,
    webPreferences: {
      nodeIntegration: true,
    }
  })

  // and load the index.html of the app.
  win.loadFile('./src/index.html')

  // Open the DevTools.
  win.webContents.openDevTools()

  ipcMain.on('sync:init', (e, arg) => {
    Object.entries(schema.format).forEach(pair => {
      if (!store.has(`format.${pair[0]}`)){
        store.set(`format.${pair[0]}`, `${pair[1].default}`);
      }
    });

    e.returnValue = store.get('format');
  });

  ipcMain.on('sync:galleryPanel', (e, arg) => {
   // console.log('format');
    e.returnValue = Model.gallerySlotLabels(store.get('format'))
    });

  ipcMain.on('select:format', (e, key, value) => {
    store.set(`format.${key}`, value);
    e.reply('update:galleryPanel', Model.gallerySlotLabels(store.get('format')));
  })

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

