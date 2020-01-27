const Cal = require('./calendar');
let MONTHNAMES = Cal.MONTHS["FULL"];


function gallerySlotLabels(format){
  //console.log(format);
  let labelsArray = [];

  let m = parseInt(format.startmonth);
  let y =parseInt(format.startyear);
  while (y <= parseInt(format.endyear)) {
    while (m <= parseInt(format.endmonth)) {
      labelsArray.push(`${MONTHNAMES[m]} ${y}`);
      m++;
    }
    m = 0;
    y++;
  }
  switch (format.format) {
    case 'Wide' : {

    }
    case 'Glance' : {

    }
    case 'Flip' : {
      labelsArray.unshift('Cover');
    }
    default : {

    }
  }
  return labelsArray;
}

module.exports = {
  gallerySlotLabels: gallerySlotLabels,
  }