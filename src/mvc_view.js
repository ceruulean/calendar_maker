const Cal = require('./calendar');
//const mvcController = require('./mvc_controller');

//UI!!!!!!!

let months = Cal.MONTHS["FULL"];

function isEmpty(vbl){
  return (vbl === undefined || vbl === null)
}

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
}

function galleryPanelRender(mediaLabels, imageData){
let galleryPanel = document.getElementById("gallery-panel");
  galleryPanel.innerHTML = "";
//galleryPanel.appendChild(createElementAttr('div', {class: ''}, 'Add Images'));
  for (let m = 0; m < mediaLabels.length; m++) {
    galleryPanel.appendChild(galleryItemComponent(mediaLabels[m], imageData[m]));
  }
}

function propertiesPanelRender(){

}

function workspaceRender(){

}

function previewRender(){
  
}

let galleryItemComponent = (label, imgData) => {
  let wrapper = createElementAttr('div', {class:"gallery item"});
  if (!isEmpty(imgData)) {
    wrapper.appendChild(createElementAttr('img', {'data-src' : imgData}));
  } else {
    wrapper.appendChild(createElementAttr('div', {class:"placeholder"}));
  }
  wrapper.appendChild(createElementAttr('label', null, label));

  return wrapper;
}


module.exports = {
  toolbarInit: toolbarInit,
  galleryPanelRender: galleryPanelRender,
  }