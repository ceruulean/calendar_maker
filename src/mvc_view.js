const Cal = require('./calendar');

//const mvcController = require('./mvc_controller');

//UI!!!!!!!

let months = Cal.MONTHS["FULL"];

function createMonthPicker(name, selectedIndex){
      let mp = document.createElement("select");
      mp.name = name;

      for (let i = 0; i < months.length; i++) {
        let op = document.createElement("option");
        op.value = i;
        op.innerHTML = months[i];
        if (selectedIndex != null && selectedIndex == i) {
          op.selected = true;
        }
        mp.appendChild(op);
      }

      return mp;
    }

function createYearInput(name, defaultYear){
      let yi = document.createElement("input");
      yi.name = name;
      yi.type = "text";
      yi.maxLength = 4;
      yi.size = 4;
      if (defaultYear != null) {
        yi.value = defaultYear;
      } else {
        yi.value = new Date().getFullYear();
      }
      return yi;
    }

 function createLabel(text){
      let lb = document.createElement("label");
      lb.innerText = text;
      return lb;
    }

  function createElementAttr(element, attrList, innards){
    let result = document.createElement(element);
    if (!isEmpty(attrList)) {
      let entries = Object.entries(attrList);
      for (en in entries){
        result.setAttribute(entries[en][0], entries[en][1]);
      }
    }
    if (!isEmpty(innards)) {
      result.innerHTML = innards;
    }
    return result;
  }

  function createSelectElement(name, list){
    let s = createElementAttr("select", {name:name});
    for (let l = 0; l < list.length; l++){
      let op = createElementAttr("option", {value:list[l]});
      op.innerText = list[l];
      s.appendChild(op);
    }
  return s;
  }


function toolbarInit(format){
  //console.log(rangeDefaults.endMonth);
  let toolbar = document.getElementById("toolbar");
    let div1 = createElementAttr('div', {class:"range"});

    //  Select a file: <input type="file" name="myFile">
    
    let startMonth = createMonthPicker('startmonth', format.startmonth);
    let startYear = createYearInput('startyear', format.startyear);

    div1.appendChild(createLabel("From "));
    div1.appendChild(startMonth);
    div1.appendChild(startYear);
    toolbar.appendChild(div1);

    let endMonth = createMonthPicker('endmonth', format.endmonth);
    let endYear = createYearInput('endyear', format.endyear);
    div1.appendChild(createLabel(" to "));
    div1.appendChild(endMonth);
    div1.appendChild(endYear);
    
    let div2 = createElementAttr('div', {class:"format"});
    div2.appendChild(createLabel("Format "));
    let formatMode = createSelectElement("format", [
      "Flip", "Wide", "Glance"
    ])
    div2.appendChild(formatMode);
    toolbar.appendChild(div2);

    return {
      selects: [startMonth, endMonth, formatMode],
      inputs: [startYear, endYear],
    }
}

let gallery = {
  root: document.getElementById("gallery-panel"),
  panelItems: [],
  itemComponent(label, fileData, index) {
    let wrapper = createElementAttr('div', {class:"gallery item", tabIndex: index});
    if (!isEmpty(fileData)) {
      wrapper.appendChild(createElementAttr('img', {'src' : fileData.path}));
    } else {
      wrapper.appendChild(createElementAttr('div', {class:"placeholder"}));
    }
    wrapper.appendChild(createElementAttr('label', null, label));
  
    return wrapper;
  },
  /**Returns the newly rendered gallery items */
  renderPanel(mediaLabels, filesArray){
      for (let m in mediaLabels) {
        let e = this.itemComponent(`${mediaLabels[m][0]} ${mediaLabels[m][1]}`, filesArray[m], m);
        this.root.appendChild(e);
        this.panelItems.push(e);
      }
      return this.panelItems;
    },
  insertCover(file){
    let cover = this.itemComponent(`Cover`, file, -1);
    this.root.appendChild(cover);
    return cover;
  },
  clearPanel(){
    this.root.innerHTML = "";
  }
}

let uploader = {
  buffer: document.getElementById('u-buffer'),
  single: createElementAttr('input', {type:'file', accept:'image/*,.pdf'}),
  openSingleBrowser(){
    this.single.click();
    return this.single;
  },
  bufferItem(fileData, index){
    return createElementAttr('img', {'src' : fileData.path, 'tabIndex' : index});
  },
  renderBuffer(filesArray, startIndex){
    this.buffer.innerHTML = '';
    for (let m = startIndex; m < filesArray.length; m++) {
      this.buffer.appendChild(this.bufferItem(filesArray[m]), m);
    }
  }
}

let properties = {
  renderPanel(){
//TODO
  }
}

let workspace = {
  root: document.getElementById('workspace'),
/**a monthsArr element should be [year:integer, monthIndex:integer] */
  render(monthsArr, formatPaper){
  },

  createCalendar(year, monthIndex, size, length, formatPaper, imageSrc){
    console.log(arguments);
    //if formatPaper == "Flip"
    let calPaper = new Cal.FlipCalendar(year, monthIndex, size, length, imageSrc);
    console.log(calPaper);
    this.mountCalendar(calPaper);
    return calPaper;
  },

  mountCalendar(calendar){
    this.root.innerHTML = ``;
    calendar.mount(this.root);
  }
}


let previewer = {
  //TODO
}

/** I wish this was universal or something */
function isEmpty(vbl){
  return (vbl === undefined || vbl === null)
}

module.exports = {
  createElementAttr,
  toolbarInit,
  gallery,
  uploader,
  workspace,
  properties,
  }