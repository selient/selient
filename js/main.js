
  // Information on all the map metas
  // Each has a name and a list of phases, with
  // each phase having an offset from the previous phase
  // (or start of every even hour for the first phase per meta)
  // using server time (UTC)
  var metas = {
      vb: {
          name: "Verdant Brink",
          phases: [
              { name: "",  duration: 10, color: "#84C147" },
              { name: "Night Bosses",  duration: 20, color: "#6DAC2F" },
              { name: "Daytime", duration: 75,  color: "#C4E2A5" },
              { name: "Night",  duration: 15, color: "#84C147" },
          ]
      },
      ab: {
          name: "Auric Basin",
          phases: [
              { name: "Pillars",  duration: 45, color: "#FFE37F" },
              { name: "Challenges",  duration: 15, color: "#FFD53D" },
              //{ name: "", duration: 5,  color: "#FFE37F" },
              { name: "Octovine",  duration: 20, color: "#EAB700" },
              { name: "Reset",  duration: 10, color: "#FFF1C1" },
              { name: "Pillars",  duration: 30, color: "#FFE37F" },
          ]
      },
      td: {
          name: "Tangled Depths",
          phases: [
              { name: "",  duration: 25, color: "#FFD7D7" },
              { name: "Prep",  duration: 5, color: "#ffbdbd" },
              { name: "Chak Gerent",  duration: 20, color: "#f99" },
              { name: "Help the Outposts",  duration: 70, color: "#FFD7D7" },
          ]
      },
      ds: {
          name: "Dragon's Stand",
          phases: [
              { name: "",  duration: 90, color: "linear-gradient( 90deg, #c8c5e5, #DFDDF7 )" },
              { name: "Start",  duration: 30, color: "linear-gradient( 90deg, #9f99cc, #c8c5e5 )" }
          ]
      },
      dt: {
          name: "Dry Top",
          phases: [
              { name: "Crash Site", duration: 40,  color: "#FCFADC" },
              { name: "Sandstorm",  duration: 20, color: "#DED98A" },
              { name: "Crash Site",  duration: 40, color: "#FCFADC" },
              { name: "Sandstorm",  duration: 20, color: "#DED98A" }
          ]
      }
      /*
      ,
      la: {
          name: "Lions Arch",
          phases: [
              { name: "Mad King", duration: 120,  color: "linear-gradient( 90deg, #DDD, #F5F5F5 )" }
          ]
      }
      */
  }

  // Function for moving the pointer to the correct location based on
  // the current server time
  function movePointer() {
      // Get the time (server time = UTC time)
      var currentTime = moment.utc();
      var localTime = moment();

      // Format with leading 0s so 09:08 doesn't end up as 9:8
      var hour = ("00" + currentTime.hour()).slice(-2);
      var minute = ("00" + currentTime.minute()).slice(-2);

      var localHour = ("00" + localTime.hour()).slice(-2);
      var localMinute = ("00" + localTime.minute()).slice(-2);

      // How far along are we (in  % ) of the current 2 hour event cycles?
      var percentOfTwoHours = ((hour % 2) + (minute / 60)) * 50;

      // Set the text and move the pointer to that %
      $('.pointer .server span').text(hour + ":" + minute);
      $('.pointer .local span').text(localHour + ":" + localMinute);
      $('#pacttimer .local span').text(localHour + ":" + localMinute);
      $('.pointer').css('left', percentOfTwoHours + "%");
  }

  // Function for updating the times
  function updateTimes() {

      // For each block within a map
      $('.bar>div').each(function () {

          var offset = $(this).data('offset');

          var currentTime = moment();
//          var currentTime = moment.utc();

          // What hour was the start of this 2 hour block?
          var startHour = Math.floor(currentTime.hour()/2)*2;
          var correctedTime = ""+(startHour + (offset > 59 ? 1 : 0));

          // Format the time so 9:8 becomes 09:08
          var hour = ("00" + correctedTime).slice(-2);
          var minute = ("00" + (offset%60)).slice(-2);

         	// Set the text
          $(this).find('span').text(hour + ":" + minute);
      });
  }

  // Function for setting up the bars when first loaded
  // based on the meta event info at the start
  function setupBars() {

     // For each meta event..
     $.each( metas, function( key, metaEvent ) {
  		if(!metaEvent.phases) return;

         // Create a bar for it on the page
         var bar = $('<div class="bar"></div>');
         var offset = 0;

         // For each phase within a bar
         $.each( metaEvent.phases, function( i, metaPhase ) {

             // Create a block to represent that phase, and set the color
             // and width based on the duration and color info
             var block = $('<div style="background-color: #F5F5F5;" data-offset="0"> <span></span> <strong></strong></div>');
             block.css('background',metaPhase.color);
             block.css('width',(100*metaPhase.duration/120)+"%");

             // Store the bar's offset for use in updating the time
             block.data('offset',offset);
             offset += metaPhase.duration;

             // Set the phase name for this block (e.g. Sandstorm)
             block.find('strong').text(metaPhase.name);

             // add this block to the bar
             bar.append(block);
         });

         // Set the name for the meta event and add the bar to the page
         $('.wrapper').append($('<h2>'+metaEvent.name+'</h2>'));
         $('.wrapper').append(bar);
     });
  }

  // Now lets do the things
  setupBars();

  // Start the pointer/times at the right place
  movePointer();
  updateTimes();

  // set up a timer to update the pointer and times every 5 seconds
  setInterval(movePointer,5000);
  setInterval(updateTimes,5000);

/*	gw2tpcalc.js
Original Content Copyright 2012, Erland Kelley
Guild Wars 2 is a registered trademark of NCsoft Corporation.
*/

var gx; var gb; var gs; var gp;

function init() { setInterval(function(){ calculate()},200); }

function calculate() {

// clear item details if user resets form
if (document.forms["trade"]["item-name"].value == "") clearItem();

// fix quantities
fix();

// get variables
var x = Number(document.forms["trade"]["quantity"].value); if (x < 1) x = 1;
var b = toCopper("buy");
var s = toCopper("sell");

// check to see if variables have changed
if (x == gx && b == gb && s == gs) return null;
gx = x; gb = b; gs = s;

// calculate profit variables
var c = b * x;
var r = s * x;
var l = Math.max(Math.round(r * 0.05), 1);
var f = Math.round(r * 0.10);
var p = r - c - l - f;

// display profit variables
document.getElementById("revenue").innerHTML = toGSC(r, true);
document.getElementById("cost").innerHTML = toGSC(c, true);
document.getElementById("listing-fee").innerHTML = toGSC(l, true);
document.getElementById("sale-fee").innerHTML = toGSC(f, true);
document.getElementById("profit").innerHTML = toGSC(p, true);

// calculate break even points
var evenBuy = s - Math.round((Math.max(Math.round(0.05*s*x),1) + Math.round(0.10*s*x)) / x);
var evenSell = Math.floor(b / 0.85);
if (evenSell != 0) while (profit(x, b, evenSell) < 0) evenSell ++;

// display break-even points
document.getElementById("buy-break-even").innerHTML = ((p != 0 && s != 0 && b != evenBuy) ? "even @ " + toGSC(evenBuy, false) : " ");
document.getElementById("buy-break-even").href = "javascript:setField('buy'," + evenBuy + ");";
document.getElementById("sell-break-even").innerHTML = ((p != 0 && b != 0 && s != evenSell) ? "even @ " + toGSC(evenSell, false) : " ");
document.getElementById("sell-break-even").href = "javascript:setField('sell'," + evenSell + ");";

// calculate and display profit margin percentage
document.getElementById("profit-percent").innerHTML = ((p != 0 && r != 0) ? "(" + (p > 0 ? "+" : "") + (Math.round((p / r) * 1000) / 10) + "%)" : "&nbsp;");

// color-code profit
document.getElementById("profit").className = "money" + (p < 0 ? " negative" : ((p > 0) ? " positive" : ""));

// wrap up
hasChanged = false;
return p;

}

function profit(x, b, s) {
var c = b * x;
var r = s * x;
var l = Math.round(r * 0.05);  if (l < 1) l = 1;
var f = Math.round(r * 0.10);
return (r - c - l - f);
}

function setField(field, val) {
document.forms["trade"][(field+"-gold")].value = "";
document.forms["trade"][(field+"-silver")].value = "";
document.forms["trade"][(field+"-copper")].value = val;
calculate();
}

function toCopper(field) {

if (field == "buy") {
  return	Number(document.forms["trade"]["buy-gold"].value) * 10000 +
      Number(document.forms["trade"]["buy-silver"].value) * 100 +
      Number(document.forms["trade"]["buy-copper"].value);
}

if (field == "sell") {
  return	Number(document.forms["trade"]["sell-gold"].value) * 10000 +
      Number(document.forms["trade"]["sell-silver"].value) * 100 +
      Number(document.forms["trade"]["sell-copper"].value);
}

}

function toGSC(val, useSpan) {

if (useSpan) {
  var openG = "<span class=\"gold\">";	var closeG = "</span>";
  var openS = "<span class=\"silver\">";	var closeS = "</span>";
  var openC = "<span class=\"copper\">";	var closeC = "</span>";
} else {
  var openG = "";	var closeG = "g";
  var openS = "";	var closeS = "s";
  var openC = "";	var closeC = "c";
}

var sign = (val < 0 ? -1 : 1);
var g = Math.floor(sign * val / 10000);
var s = Math.floor((sign * val - g * 10000) / 100);
var c = sign * val - g * 10000 - s * 100;


if (g) return openG + (sign * g) + closeG +
        openS + s + closeS +
        openC + c + closeC;
if (s) return openS + (sign * s) + closeS +
        openC + c + closeC;
if (c) return openC + (sign * c) + closeC;
return openC + "0" + closeC;

}

function fix() {

var quantity = document.forms["trade"]["quantity"];
var buyCopper = document.forms["trade"]["buy-copper"];
var buySilver = document.forms["trade"]["buy-silver"];
var buyGold = document.forms["trade"]["buy-gold"];
var sellCopper = document.forms["trade"]["sell-copper"];
var sellSilver = document.forms["trade"]["sell-silver"];
var sellGold = document.forms["trade"]["sell-gold"];

// numeric characters only
if (quantity.value != quantity.value.replace(/[^0-9]/g, ''))
  quantity.value = quantity.value.replace(/[^0-9]/g, '');
if (buyCopper.value != buyCopper.value.replace(/[^0-9]/g, ''))
  buyCopper.value = buyCopper.value.replace(/[^0-9]/g, '');
if (buySilver.value != buySilver.value.replace(/[^0-9]/g, ''))
  buySilver.value = buySilver.value.replace(/[^0-9]/g, '');
if (buyGold.value != buyGold.value.replace(/[^0-9]/g, ''))
  buyGold.value = buyGold.value.replace(/[^0-9]/g, '');
if (sellCopper.value != sellCopper.value.replace(/[^0-9]/g, ''))
  sellCopper.value = sellCopper.value.replace(/[^0-9]/g, '');
if (sellSilver.value != sellSilver.value.replace(/[^0-9]/g, ''))
  sellSilver.value = sellSilver.value.replace(/[^0-9]/g, '');
if (sellGold.value != sellGold.value.replace(/[^0-9]/g, ''))
  sellGold.value = sellGold.value.replace(/[^0-9]/g, '');

// convert currencies
if (buyCopper.value > 99 && (document.activeElement != buyCopper)) {
  buySilver.value = Math.floor(buyCopper.value / 100);
  buyCopper.value -= buySilver.value * 100;
  if (buySilver.value < 100) buyGold.value = "";
}

if (buySilver.value > 99 && (document.activeElement != buySilver)) {
  buyGold.value = Math.floor(buySilver.value / 100);
  buySilver.value -= buyGold.value * 100;
}

if (sellCopper.value > 99 && (document.activeElement != sellCopper)) {
  sellSilver.value = Math.floor(sellCopper.value / 100);
  sellCopper.value -= sellSilver.value * 100;
  if (sellSilver.value < 100) sellGold.value = "";
}

if (sellSilver.value > 99 && (document.activeElement != sellSilver)) {
  sellGold.value = Math.floor(sellSilver.value / 100);
  sellSilver.value -= sellGold.value * 100;
}

}

function clearItem() {
document.getElementById("item-high").innerHTML = " ";
document.getElementById("item-high").href = "";
document.getElementById("item-icon").style.backgroundImage = "";
document.getElementById("item-icon").style.borderColor = "rgba(255,255,255,0)";
//document.getElementById("chart").style.display = "none";
//if (document.getElementById("chart").src != "loading.php") document.getElementById("chart").src = "loading.php";
}

/* Requires jQuery */

//item list auto-complete
$(function() {
$("#item-name").autocomplete({

  source: "json/items.php",
  minLength: 3,
  select: function( event, ui ) {

    var itemBorder = "rgba(255,255,255,0)"; // transparent
    if (ui.item.rarity == "1") itemBorder = "#cccccc";
    if (ui.item.rarity == "2") itemBorder = "#0066cc";
    if (ui.item.rarity == "3") itemBorder = "#66cc00";
    if (ui.item.rarity == "4") itemBorder = "#ffcc19";
    if (ui.item.rarity == "5") itemBorder = "#ff9933";
    if (ui.item.rarity == "6") itemBorder = "#ff3300";
    document.getElementById("item-icon").style.borderColor = itemBorder;
    document.getElementById("item-icon").style.backgroundImage = "url('"+ui.item.img+"')";

//    document.getElementById("chart").style.display = "none";
//    document.getElementById("chart").src = "chart.php?id=" + ui.item.id;

    document.getElementById("item-high").innerHTML = "loading...";

    $.getJSON("json/prices.php?id=" + ui.item.id, function(data) {
      if (data.highSale) {
        if (data.highSale > 0) {
          document.getElementById("item-high").innerHTML = "24hr high: " + toGSC(data.highSale, false);
          document.getElementById("item-high").href = "javascript:setField('sell'," + data.highSale + ");";
        } else {
          document.getElementById("item-high").innerHTML = "";
          document.getElementById("item-high").href = "#";
        }
      }
    });
  }

});
});