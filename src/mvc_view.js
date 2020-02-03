const Cal = require('./calendar');

//const mvcController = require('./mvc_controller');

//UI!!!!!!!

let months = Cal.MONTHS["FULL"];

let toolbar = {
  sizeSelector: createElementAttr("select", {name:'size'}),
  init(format){

    let createMonthPicker = (name, selectedIndex) => {
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
    
    let createYearInput = (name, defaultYear) => {
      let yi = createElementAttr('input', {
        name: name,
        type: 'text',
        maxLength: 4,
        size: 4,
      })
      // yi.name = name;
      // yi.type = "text";
      // yi.maxLength = 4;
      // yi.size = 4;
      if (defaultYear != null) {
        yi.value = defaultYear;
      } else {
        yi.value = new Date().getFullYear();
      }
      return yi;
    }

    let setDefaultOption = (option, prop) => {
      if (option.value == format[prop]){
        option.selected = true;
      }
    }

    let createSelectElement = (name, list, propName) => {
      let s = createElementAttr("select", {name:name});
      for (let l = 0; l < list.length; l++){
        let op = createOption(list[l].toLowerCase(), list[l]);
        setDefaultOption(op, propName);
        s.appendChild(op);
      }
      return s;
      }

      let toolbar = document.getElementById("toolbar");
      let div1 = createElementAttr('div', {class:"range"});
  
      //  Select a file: <input type="file" name="myFile">
      
      let startMonth = createMonthPicker('startmonth', format.startmonth);
      let startYear = createYearInput('startyear', format.startyear);
  
      div1.appendChild(createLabel(`From `));
      div1.appendChild(startMonth);
      div1.appendChild(startYear);
      toolbar.appendChild(div1);
  
      let endMonth = createMonthPicker('endmonth', format.endmonth);
      let endYear = createYearInput('endyear', format.endyear);
      div1.appendChild(createLabel(` to `));
      div1.appendChild(endMonth);
      div1.appendChild(endYear);
      
      let div2 = createElementAttr('div', {class:"format"});
      div2.appendChild(createLabel(`Format `));
      let formatMode = createSelectElement("format", [
        "Flip", "Wide", "Glance"
      ], "format");
      div2.appendChild(formatMode);
      toolbar.appendChild(div2);
      
      div2.appendChild(createLabel(` Size `));
      this.sizeSelector.appendChild(createOption('letter', `Letter (8.5" x 11")`));
      this.sizeSelector.appendChild(createOption('tabloid', `Tabloid (11" x 17")`));
      this.sizeSelector.appendChild(createOption('ARCHB', `Arch B (12" x 18")`));
        for (let child in this.sizeSelector.children) {
          setDefaultOption(this.sizeSelector.children[child], 'size');
        }
      div2.appendChild(this.sizeSelector);

      div2.appendChild(createLabel(` Layout `));
      let layout = createSelectElement("layout", ["Landscape", "Portrait"], "layout");
      div2.appendChild(layout);
  
      return {
        selects: [startMonth, endMonth, formatMode, this.sizeSelector, layout],
        inputs: [startYear, endYear],
      }
  }
}

let gallery = {
  root: document.getElementById("galleryItems"),
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
        let test = filesArray? filesArray[m] : null ;
        let e = this.itemComponent(`${mediaLabels[m][0]} ${mediaLabels[m][1]}`, test, m);
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
  single: createElementAttr('input', {type:'file', accept:'image/*,'}),
  openSingleBrowser(){
    this.single.click();
    return this.single;
  },
  bufferItem(fileData, index){
    return createElementAttr('img', {'src' : fileData.path, 'tabIndex' : index});
  },
  renderBuffer(filesArray, startIndex){
    if (isEmpty(filesArray)) return;
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
  root: document.getElementById('calendarSpace'),
/**a monthsArr element should be [year:integer, monthIndex:integer] */
  clear(){
    this.root.innerHTML = ``;
  },
  render(monthsArr, formatPaper){
  },

  createCalendar(year, monthIndex, size, layout, formatPaper, imageSrc){
    //formatPaper is flip/glance/wide TODO check
    let calPaper = new Cal.FlipCalendar(year, monthIndex, size, layout, imageSrc);
    this.mountCalendar(calPaper);
    return calPaper;
  },

  mountCalendar(calendar){
    this.clear();
    calendar.mount(this.root);
  },

  renderCover(size, layout, imageSrc){
    let p = Cal.createPage(size, layout);
    this.clear();
    let i = createElementAttr('img', {src: imageSrc});
    p.appendChild(i);
    this.root.appendChild(p);
    return p;
  }
}


let previewer = {
  //TODO
}

/** I wish this was universal or something */
function isEmpty(vbl){
  return (vbl === undefined || vbl === null)
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

function createLabel(text){
  let lb = document.createElement("label");
  lb.innerText = text;
  return lb;
}

function createOption(value, innerText) {
  let o = document.createElement('option');
  o.value = value;
  o.innerText = innerText;
  return o
}


module.exports = {
  createElementAttr,
  toolbar,
  gallery,
  uploader,
  workspace,
  properties,
  }