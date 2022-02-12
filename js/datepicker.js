const SELECTION = {
  from: {},
  to: {}
};

let datepickerMonths = [];

const TABLE = "table";

class Month {
  // Month name to month Object
  #MONTHS = new Map();

  monthAsInteger;
  year;
  name;
  numDays;
  firstDayOfWeek;
  #previousMonth;
  #nextMonth;
  disabledDays = [];

  constructor(month, year) {
    let isLeapYear = ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
    this.#initMonths(isLeapYear);
    this.monthAsInteger = month;
    this.year = year;
    this.name = this.#MONTHS.get(month).name;
    this.numDays = this.#MONTHS.get(month).days;
    this.firstDayOfWeek = new Date(year, month, 0).getDay();
    this.#calculateDisabledDays();
  }

  #initMonths(isLeapYear) {
    this.#MONTHS.set(0, { name: "January", days: 31 })
    this.#MONTHS.set(1, { name: "February", days: isLeapYear ? 29 : 28 })
    this.#MONTHS.set(2, { name: "March", days: 31 })
    this.#MONTHS.set(3, { name: "April", days: 30 })
    this.#MONTHS.set(4, { name: "May", days: 31 })
    this.#MONTHS.set(5, { name: "June", days: 30 })
    this.#MONTHS.set(6, { name: "July", days: 31 })
    this.#MONTHS.set(7, { name: "August", days: 31 })
    this.#MONTHS.set(8, { name: "September", days: 30 })
    this.#MONTHS.set(9, { name: "October", days: 31 })
    this.#MONTHS.set(10, { name: "November", days: 30 })
    this.#MONTHS.set(11, { name: "December", days: 31 })
  }

  #calculateDisabledDays(){
    let today = new Date();
    if(this.monthAsInteger == today.getMonth()){
      for(let i = 1; i <= today.getDate(); i++){
        this.disabledDays.push(i);
      }
    }
  }

  get previousMonth() {
    if (!this.#previousMonth) {
      if (this.monthAsInteger == 0) {
        this.#previousMonth = new Month(11, this.year - 1);
      } else {
        this.#previousMonth = new Month(this.monthAsInteger - 1, this.year);
      }

      this.#previousMonth.nextMonth = this;
    }

    return this.#previousMonth;
  }

  get nextMonth() {
    if (!this.#nextMonth) {
      if (this.monthAsInteger == 11) {
        this.#nextMonth = new Month(0, this.year + 1);
      } else {
        this.#nextMonth = new Month(this.monthAsInteger + 1, this.year);
      }

      this.#nextMonth.previousMonth = this;
    }

    return this.#nextMonth;
  }

  set previousMonth(previousMonth) {
    this.#previousMonth = previousMonth;
  }

  set nextMonth(nextMonth) {
    this.#nextMonth = nextMonth;
  }

  #buildTableWithHeading() {
    const daysOfWeek = ["Mon", "Tue", "Wen", "Th", "Fri", "Sat", "Sun"]
    let tr = document.createElement("tr");

    for (let i = 0; i < daysOfWeek.length; i++) {
      let th = document.createElement("th");
      th.innerHTML = daysOfWeek[i];
      tr.appendChild(th);
    }

    const monthContainer = document.getElementById("calendar").appendChild(document.createElement("div"));
    monthContainer.classList.toggle("month-container");

    const singleMonth = monthContainer.appendChild(document.createElement("div"));
    singleMonth.classList.toggle("single-month");

    let monthName = document.createElement("h3");
    monthName.innerHTML = `${this.name} - ${this.year}`;
    singleMonth.appendChild(monthName);

    const table = singleMonth.appendChild(document.createElement("table"));
    table.id = TABLE;
    table.appendChild(tr);
    return table;
  }

  draw() {
    let table = this.#buildTableWithHeading();
    let day = 0;
    let dayOfTheWeek = 0;
    let currentRow = document.createElement("tr");

    while (day <= this.numDays) {
      if (dayOfTheWeek > 6) {
        //new week
        dayOfTheWeek = 0;
        table.appendChild(currentRow);
        currentRow = document.createElement("tr");
      }

      if (day === 0) {
        //draw previous month as empty tds
        for (let i = 0; i < this.firstDayOfWeek; i++) {
          currentRow.appendChild(document.createElement("td"));
        }
        dayOfTheWeek = this.firstDayOfWeek;
      } else {
        let td = this.#createTableData(day, table);
        currentRow.appendChild(td);
        dayOfTheWeek++;
      }

      day++;
    }

    table.appendChild(currentRow);
  }

  #createTableData(day, table) {
    let td = document.createElement("td");
    
    td.classList.add(this.disabledDays.includes(day) ? "disabled" : "selectable");
    td.classList.add("date");
    td.classList.add(`${this.name}`);

    td.innerHTML = day;

    td.addEventListener("click", (el, ev) => this.#select(day, td, table));

    return td;
  }

  #select(day) {
    //If the day is disabled no need to do anything. 
    if(this.disabledDays.includes(day)){
      return;
    }

    // If both are selected, reset and select only first
    if (SELECTION.from.month && SELECTION.to.month) {
      console.log(1)
      SELECTION.from = { day, month : this };
      SELECTION.to = {};
    }else if(!SELECTION.from.month) {
      console.log(2)
      //If we don't have a from selection, then this is it. 
      SELECTION.from = { day, month : this };
    } else if (this.isAfter(SELECTION.from.month)) {
      console.log(3)
      //If we have a from selection and this is greater than it we select it as to
      SELECTION.to = { day, month : this };
    } else if (this.monthAsInteger < SELECTION.from.month.monthAsInteger || 
      (this.monthAsInteger === SELECTION.from.month.monthAsInteger && day <= SELECTION.from.day)) {
        console.log(4)
      //If this is selected 2nd, but it's less than the first, we set it as first.
      SELECTION.from = { day, month : this};
      SELECTION.to = {};
    } else {
      //Else we select it as to date.
      console.log(5)
      SELECTION.to = { day, month : this};
    }

    //Here we set the from/to dates of the input-boxes
    if(SELECTION.from.month){
      let dateFrom = new Date(SELECTION.from.month.year, SELECTION.from.month.monthAsInteger, SELECTION.from.day + 1);
      document.getElementById("from-date").value = dateFrom.toISOString().split("T")[0];
    }else{
      document.getElementById("from-date").value = undefined;
    }

    if(SELECTION.to.month){
      let dateTo = new Date(SELECTION.to.month.year, SELECTION.to.month.monthAsInteger, SELECTION.to.day + 1);
      document.getElementById("to-date").value = dateTo.toISOString().substring(0, 10);
    }else{
      document.getElementById("to-date").value = undefined;
    }

    //And we apply the styles.
    applyStyles();
  }

  isAfter(month) {
    return (this.year > month.year ||
      this.year == month.year && this.month > month.month);
  }

  isBefore(month) {
    return (this.year < month.year ||
      this.year == month.year && this.month < month.month);
  }
}

buildDatePicker(new Month(new Date().getMonth(), 2022));

function buildDatePicker(fistMonth) {
  datepickerMonths = [];

  if(screen.width <= 1200){
    //Single month for screen less than 1200
    datepickerMonths.push(fistMonth);
  }else if(screen.width <= 1600){
    //Two months for screen less than 1600
    datepickerMonths.push(fistMonth);
    datepickerMonths.push(fistMonth.nextMonth);
  }else{
    //Three months at a time on desktop
    datepickerMonths.push(fistMonth, fistMonth.nextMonth, fistMonth.nextMonth.nextMonth);
  }

  drawMonths();
}

function drawMonths() {
  document.getElementById("calendar").innerHTML = "";
  datepickerMonths.forEach(month => month.draw())
  applyStyles();
}

function applyStyles() {
  datepickerMonths.forEach(m => applyStyle(m))
}

function applyStyle(month) {
  Array.from(document.getElementsByClassName(`${month.name}`)).forEach(d => d.classList.remove("selected", "light-selected"));
  let dates = Array.from(document.getElementsByClassName(`${month.name}`));

  if(SELECTION.from.month === undefined){
    return;
  }

  //Apply style to outer bounds - first and last elements
  if (SELECTION.from.month.monthAsInteger === month.monthAsInteger) {
    dates[SELECTION.from.day - 1].classList.toggle("selected");
  }

  if (SELECTION.to.month && SELECTION.to.month.monthAsInteger === month.monthAsInteger) {
    dates[SELECTION.to.day - 1].classList.toggle("selected");
  }

  //Apply styles to elements between
  if(!SELECTION.from || !SELECTION.to){
    return;
  }

  if (SELECTION.from.month.monthAsInteger === month.monthAsInteger && SELECTION.to.month && SELECTION.to.month.monthAsInteger === month.monthAsInteger) {
    //Both start and end are in this month. Apply style to elements between.
    dates.slice(SELECTION.from.day, SELECTION.to.day - 1).forEach(el => el.classList.toggle("light-selected"));
  } else if (SELECTION.from.month.monthAsInteger === month.monthAsInteger && SELECTION.to.month) {
    //Only start is in this month. Apply style from start untill end of month.
    dates.slice(SELECTION.from.day).forEach(d => d.classList.toggle("light-selected"));
  } else if (SELECTION.from.month.monthAsInteger !== month.monthAsInteger && SELECTION.to.month && SELECTION.to.month.monthAsInteger === month.monthAsInteger) {
    //Only end is in this month. Apply style from begining of month untill end.
    dates.slice(0, SELECTION.to.day - 1).forEach(d => d.classList.toggle("light-selected"));
  }
}

document.getElementById("previous-month").addEventListener("click", () => {
  let currentMonth = new Month(new Date().getMonth(), 2022);
  
  //Can't go before current month
  let firstMonth = datepickerMonths[0].previousMonth;
  if(firstMonth.isBefore(currentMonth)){
    return;
  }

  datepickerMonths.unshift(datepickerMonths[0].previousMonth);
  datepickerMonths.pop();
  drawMonths();
});

document.getElementById("next-month").addEventListener("click", () => {
  datepickerMonths.push(datepickerMonths[datepickerMonths.length - 1].nextMonth);
  datepickerMonths.shift();
  drawMonths();
});

var tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
var tomorrowAsStr = tomorrow.toISOString().split('T')[0];
document.getElementById("from-date").setAttribute('min', tomorrowAsStr);

document.getElementById("from-date").onchange = (ev) => {
  let newDate = new Date(ev.target.value);

  let newMonth = new Month(newDate.getMonth(), newDate.getFullYear());

  SELECTION.from.day = newDate.getDate();
  SELECTION.from.month = newMonth;

  minimumToDate = newDate.toISOString().split('T')[0];
  console.log(minimumToDate);  
  document.getElementById("to-date").setAttribute('min', minimumToDate);

  buildDatePicker(newMonth);
};

document.getElementById("to-date").onchange = (ev) => {
  let newDate = new Date(ev.target.value);

  let newMonth = new Month(newDate.getMonth(), newDate.getFullYear());

  SELECTION.to.day = newDate.getDate();
  SELECTION.to.month = newMonth;

  buildDatePicker(newMonth);
};

document.getElementById("book-now").addEventListener("click", () => redirect());

function redirect(){
  if(!SELECTION.from.month || !SELECTION.to.month){
    //Maybe show a message?
    return;
  }

  const id = document.getElementById("datepicker").getAttribute("rental-id");
  const guests = "2";
  const adults = "2";

  const checkIn = new Date(SELECTION.from.month.year, SELECTION.from.month.monthAsInteger, SELECTION.from.day + 1).toISOString().split("T")[0];
  const checkOut = new Date(SELECTION.to.month.year, SELECTION.to.month.monthAsInteger, SELECTION.to.day + 1).toISOString().split("T")[0];
  
  const url = `https://www.airbnb.com/book/stays/${id}?numberOfGuests=${guests}&numberOfAdults=${adults}
    &checkin=${checkIn}&checkout=${checkOut}&guestCurrency=EUR&productId=${id}`;

  window.location.href = url;
}