"use strict"

class Calendar {
  constructor(year, monthIndex){
    this.root = document.createElement("div");
    this.root.className = `calendar-wrapper`;
    this.renderCalendar(monthIndex + 1, year);
  }
  
  mount(eleement){
    eleement.appendChild(this.root);
  }
/*
* m is 1-12
* From https://stackoverflow.com/questions/222309/calculate-last-day-of-month-in-javascript
*/
static getDaysInMonth(m, y) {
    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
}
/* m is 1-12
 Returns the day as an integer (0-6, sunday-saturday)
*/
static getFirstDay(m, y){
  return new Date(y, m-1, 1).getDay();
}

static getLastDay(m, y){
  return new Date(y, m, 0).getDay();
}

static prevMonth(month){ if (month > 1) { return (month-1) } return 12};
static nextMonth(month){ if (month < 12){return month+1} return 1};
static prevYear(month, year){if (month > 1) {return year} return year-1};
static nextYear(month, year){if (month < 12){return year} return year+1};

static parseDate(MMDDYYYY){
  let arr = MMDDYYYY.split(/\//g);
  let n = (e) => {return Number.parseInt(e)};
  return {month: n(arr[0]), day: n(arr[1]), year: n(arr[2])}
}

static generateDaysLabels(mini){
  let a;
  let b = "";
  if (mini){a = Calendar.DAY["MINI"]} else {a = Calendar.DAY["FULL"]}
  for (let i = 0; i < 7; i++) {
    b += `<div>${a[i]}</div>`
  }
  return b;
}

  static get DAY(){
    return {
    FULL:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
    MINI:["Su","Mo","Tu","We","Th","Fr","Sa"]
    }

    }
  static get MONTH(){
    return {   FULL: [
  "January" ,
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
],
    MINI: [
  "Jan" ,
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",]}
  }

  get monthLabel(){
    return Calendar.MONTH[this.mini? "MINI":"FULL"];
  }
  
  static dayTemplate(num, month, year, blank, classes){
     return `<div class="${blank? "blank " : ""}day ${classes? classes:""}" data-month="${month}" data-year="${year}" data-day="${num}">${num}</div>`;
  }

  generateCalendarHTML(month, year) {
    let html = "";
    let daysInMonth = Calendar.getDaysInMonth(month, year);

    let firstDay = Calendar.getFirstDay(month, year);
    if (firstDay > 0){ //first day is not a Sunday
      let p = Calendar.getDaysInMonth(Calendar.prevMonth(month), year);
      for (let f = 0; f < firstDay; f++) {
        html = Calendar.dayTemplate(p, Calendar.prevMonth(month), Calendar.prevYear(month, year), true) + html;
        p--;
      }
    };
    for (let i = 1; i <= daysInMonth; i++) {
      html += Calendar.dayTemplate(i, month, year);
    }
    let lastDay = Calendar.getLastDay(month, year);
    if (lastDay < 6){ //last day is not a Saturday
      let u = 1;
      for (let l = 6; l > lastDay; l--) {
        html += Calendar.dayTemplate(u, Calendar.nextMonth(month), Calendar.nextYear(month, year), true);
        u++;
      }
    };

    return    `<div class="calendar">
        <div class="mainheader">
          <div class="arrow left"></div>
          <div class="display month header">
          ${this.monthLabel[month - 1]} ${year}
          </div>
          <div class="arrow right"></div>
        </div>
      
        <div class="display week header">
        ${Calendar.generateDaysLabels(this.mini)}
        </div>
      
        <div class="days week">
        ${html}
        </div>
      </div>
      `
  }

  renderCalendar(month, year){
    let result = document.createRange().createContextualFragment(this.generateCalendarHTML(month, year));
    this.root.appendChild(result);
    return result;
  }
}


/**ABSTRACT class */
class PaperCalendar{
  constructor(year, monthIndex, size, layout){
    this.root = createElementAttr('div');
  }

  mount(ele){
    ele.appendChild(this.root);
  }

  set orientation(ori){
  }

  get orientation(){
  }

  set layout(ori) {
    this.orientation = ori;
  }

  get layout(){
    return this.orientation;
  }

  set size(siz){
  }

  get size(){
  }
}

class FlipCalendar extends PaperCalendar{
  constructor(year, monthIndex, size = 'letter', orientation = 'landscape'){
    super(year, monthIndex, size, orientation);
    this.flap = document.createElement('page');
    this.root.appendChild(this.flap);

    this.paperCalendar = document.createElement('page');
    let wtf = new Cal.Calendar(year, monthIndex);
    this.paperCalendar.appendChild(wtf.root);

    this.root.appendChild(this.paperCalendar);

    this.layout = orientation;
    this.size = size;
  }

  set orientation(ori){
    this.flap.setAttribute('layout', ori);
    this.paperCalendar.setAttribute('layout', ori);
  }

  get orientation(){
    return this.flap.layout;
  }

  set size(siz){
    this.flap.setAttribute('size', siz);
    this.paperCalendar.setAttribute('size', siz);
  }

  get size(){
    return this.flap.size;
  }
}

module.exports = {
  Calendar,
  FlipCalendar,
  MONTHS: Calendar.MONTH,
  DAYS: Calendar.DAY,
  }