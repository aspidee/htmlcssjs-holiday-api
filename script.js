// funzione che prende il nome del mese del calendario
function getMonthName(month) {
// istanziamo l'oggetto moment che rappresenta la data corrente
  var mom = moment();
// passiamo dalla data corrente passando il nostro parametro month
  mom.month(month);
// stampiamo il nome del mese per esteso
  var monthName = mom.format("MMMM");

  return monthName;
}


// funzione che stampa il numero dei giorni del mese rispettivo
function getMonthDayCount(year, month) {

  var mom = moment();

  mom.year(year);
  mom.month(month);
  //funzione dedicata (non ha bisogno di parametri in ingresso)
  var dayCount = mom.daysInMonth();

  return dayCount;
}


// funzione che stampa il titolo del calendario con i giorni rispettivi di ogni singolo mese
function printTitle(year, month){

  var h1MonthName = $("#month"); // titolo mese
  var monthName = getMonthName(month); // nome del mese
  var dayCount = getMonthDayCount(year, month); // numero di giorni

  //stampiamo per esteso i valori nel titolo del mese
  h1MonthName.text(monthName + " " + year + " : 1 - " + dayCount);
}


// funzione che stampa tutti i giorni di tu
function printDays(year, month) {
  // ci richiamiamo la funzione del numero dei giorni
  var dayCount = getMonthDayCount(year, month);

  var daysList = $(".calendar"); //days_list

  var template = $("#box-template").html();
  var compiled = Handlebars.compile(template);

  var dayOfBox = 0;
  var dayOfWeek = printWeekDays(year, month, 1);
  var day = 1;

  for (var i = 0; i < 35; i++) {

    if (dayOfBox > 6) {
      dayOfBox = 0
    }

    if (dayOfWeek > 6) {
      dayOfWeek = 0
    }

    if (day > dayCount) {

      var box = compiled();
      daysList.append(box);

    } else if (dayOfWeek == dayOfBox) {

      var templateDay = {

        machineDate : getMachineDate(year, month, day),
        value : day
      }

      var box = compiled(templateDay);
      daysList.append(box);
      dayOfWeek++;
      day++;
    } else {

      var box = compiled();
      daysList.append(box);
    }

    dayOfBox++;
  }
}


// funzione che restituisce il nostro formato data
function getHumanDate(year, month, day) {

  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date = mom.format("DD MMMM YY");
  return date;
}


// funzione che prende il formato della nostra lista in ingresso
function getMachineDate(year, month, day) {

  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);

  var date = mom.format("YYYY-MM-DD");
  return date;
}

//non mi stampa i nomi
function printWeekDays(year, month, day) {

  var mom = moment();
  mom.year(year);
  mom.month(month);
  mom.date(day);
  return mom.day();
}


// funzione che stampa i valori della nostra chiamata ajax
function printHolidays(year, month) {

  var outputData = {
    // scriviamo i nostri valori della chiamata
    year : year,
    month : month
  }

  $.ajax ({

    url : "https://flynn.boolean.careers/exercises/api/holidays",
    method : "GET",
    data : outputData,
    success : function(inputData, state) {
      // verifichiamo che la success sia true
      if (inputData.success) {
        //richiamiamo la funzione printAPI e gli passiamo le informazioni che ci siamo recuperati nell'ajax
        var holidays = inputData.response;
        printAPI(holidays);

      } else {

        console.log("Communication error");
      }
    },

    error : function(request, state, error) {
      console.log("request", request);
      console.log("state", state);
      console.log("error", error);
    }
  });
}

//funzione che stampa il risultato della nostra chiamata ajax che avrà come parametro in ingresso l'intero array delle festività
function printAPI(holidays) {

  for (var i = 0; i < holidays.length; i++) {

    var holiday = holidays[i];
    var holidayName = holiday.name;
    var holidayDate = holiday.date;
    // var selector = "p[data-date='" + holidayDate + "']";

    var holidayDayName = document.createElement("p");
    $(holidayDayName).text(holidayName).addClass("holidays");

    var boxHoliday = $(".box[data-date='" + holidayDate + "']")
    boxHoliday.addClass("holiday").append(holidayDayName);
  }
}


function init() {

  var backMonth = $("#back");
  var nextMonth = $("#next");
  var daysList = $(".calendar");

  var year = 2018;
  var month = 0;

  printTitle(year, month);
  printDays(year, month);
  printHolidays(year, month);



  nextMonth.click(function(){

    daysList.html("");
    month++;

    if (month > 11) {
      month = 0;
    }

    printTitle(year, month);
    printDays(year, month);
    printHolidays(year, month);

  });

  backMonth.click(function() {

    daysList.html("");
    month--;

    if (month < 0) {
      month = 11;
    }

    printTitle(year, month);
    printDays(year, month);
    printHolidays(year, month);

  });
}

$(document).ready(init);
