import { placeBracketOrder } from './ExecuteBO.js';  // Import the placeBracketOrder function
import { updateOrderStatus } from './BO-status-contn.js';



import pkg from 'cors';
const { cors } = pkg;
import pkgexpress from 'express';
const { express } = pkgexpress;
import pkgparser from 'body-parser';
const { bodyParser } = pkgparser;

const app = pkgexpress();
const port = 3000;
app.use(pkg()); // Allow all origins

// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(pkgparser.text()); // Parses JSON requests
app.use(pkgparser.urlencoded({ extended: true })); // Parses URL-encoded requests

import { fyersModel, fyersDataSocket } from "fyers-api-v3";
var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": false });
var appidsaved = "XBDVKT3M7D-100";
var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjkxMzY0NDYsImV4cCI6MTcyOTIxMTQ0NiwibmJmIjoxNzI5MTM2NDQ2LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbkVJYy0yMmx1bXdZUnJuRjlLaTNfMVpFX0xKdDdzOWdOOTRNZDJBZEVfM0t2UGkwT3pJOWJaZWE4QndVSGZzM3lUTnBfdkhzOE92blhxY3l3VUlYSzc0WUNzWnBiY2VfYVZURTdsUFphN3pOWFd5VT0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.y0lNZLe3Pu1560MDnWSH4tDoF0AyBkwCoKMmQoUeKJE";



fyers.setAppId(appidsaved);
fyers.setAccessToken(accesstoken);

const dataSocket = fyersDataSocket.getInstance(accesstoken);
let receivedmessage = true;
let ceSymbol = "";
let peSymbol = "";

let ceSymbolnext = "";
let peSymbolnext = "";

let ceSymbolValue = "";
let peSymbolValue = "";

let ceSymbolnextValue = "";
let peSymbolnextValue = "";

let updatearray = false;
let cePrice = 0;
let pePrice = 0;
let cenextPrice = null;
let penextPrice = null;

let selectedceSymbolVal = null;
let selectedpeSymbolVal = null;

let selectedceSymbolPrice = null;
let selectedpeSymbolPrice = null;

let ceSymbolnextVal = false;
let peSymbolnextVal = false;

let currentWeeklyExpiry = "24O23";

let subslist = [];

let receivedsigal = "";

let totalLoss = 0;

var rangeprice = 100;
var orderQuantity = 15;
var positionupOrderid = "";
var positiondownOrderid = "";

var upordersymbol = '';
var downordersymbol = '';
var spotPrice = 0;


var Orderstatus = 'wait';
var fyersSaved = null;
var acceptedProfit = 0.1;//change
var qty = 15;
var Order_Information = {
  parentOrder: {
    orderId: '24101000065386' + '-BO-1',            // Parent order ID
    symbol: 'BANKNIFTY24O1652300CE',                   // Symbol of the trade
    orderType: "BO",                  // Bracket Order type
    price: 85.5,                     // Price at which the parent order was placed
    status: 2,
    executedtime: '09-Oct-2024 10:30:53'          // Status of the parent order

  },
  stopOrder: {
    orderId: '24101000065386' + '-BO-2',          // Stop-loss order ID
    symbol: 'BANKNIFTY24O1652300CE',                   // Symbol of the trade
    orderType: "STOP_LOSS",           // Order type for stop-loss
    price: 45,  // Stop-loss price
    status: 6,
    executedtime: '09-Oct-2024 10:30:53'                 // Initial status for stop-loss order


  },
  profitOrder: {
    orderId: '24101000065386' + '-BO-3',          // Take-profit order ID
    symbol: 'BANKNIFTY24O1652300CE',                    // Symbol of the trade
    orderType: "TAKE_PROFIT",         // Order type for take-profit
    price: 12,  // Take-profit price
    status: 6,
    executedtime: '09-Oct-2024 10:30:53'                 // Initial status for take-profit order
  }
};

var Past_orders = null;
var saveapimessage = '';



var appid = '';
var secret = '';
var authcode = '';
var waittillmessage = true;
var OrderSide = '';

var selectedCESymbol = "";
var selectedCESymbolPrice = 0;
var selectedPESymbol = "";
var selectedPESymbolPrice = 0;

var indextype = "NSE:BANKNIFTY";

var optionspread = 100;
var cepesymbolarr = [];
var indexspot = 0;
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function SpotPrice(retries = 3, delayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fyers.getQuotes(["NSE:NIFTYBANK-INDEX"]);
      if (response.s && response.d.length > 0) {
        return Math.round(response.d[0].v.lp); // Last traded price
      } else {
        throw new Error("Could not fetch Bank Nifty spot price.");
      }
    } catch (error) {
      console.error(`Attempt ${attempt} failed:`, error);
      if (attempt === retries) {
        throw new Error("All retries failed. Unable to fetch Bank Nifty spot price.");
      }
      await delay(delayMs); // Wait before retrying
    }
  }
}


async function getexactrangePrice(symbolarr) {
  //console.log(symbolarr)
  try {
    //console.log(symbolarr.length)
    const response = await fyers.getQuotes(symbolarr);
    //console.log(response)
    for (let i = 0; i < 30; i++) {
      //console.log(response.d[i].v.lp)
      if (i > 2 && i % 2 == 1) {
        //console.log( response.d[i].v.lp + response.d[i + 2].v.lp, 'SUM', response.d[i - 1].v.lp + response.d[i + 1].v.lp)
        //console.log("i",response.d[i - 1].v.lp + response.d[i - 1].v.lp,          response.d[i].v.lp + response.d[i].v.lp,)
        if (
          response.d[i - 1].v.lp + response.d[i + 1].v.lp > 200 &&
          response.d[i].v.lp + response.d[i + 2].v.lp < 200
        ) {
          selectedceSymbolVal = response.d[i+1].n;
          selectedceSymbolPrice = response.d[i+1].v.lp;
          selectedpeSymbolVal = response.d[i].n;
          selectedpeSymbolPrice = response.d[i].v.lp;
          //console.log(i)
          
          return i;
        }
      }
    }
    //console.log(response);
  } catch (error) {
    console.error("Error fetching Bank Nifty spot price:", error,response.d[0].n);
    throw error;
  }
}


async function main() {
  try {
    if ((new Date().getHours() > 8 && new Date().getMinutes() > 14) || (new Date().getHours() > 9 && new Date().getHours() < 16)) {
      fyersSaved = fyers;
      indexspot = await SpotPrice();
      //console.log(indexspot);
      for (let i = 0; i < 25; i++) {
        ceSymbol = `${indextype}${currentWeeklyExpiry}${Math.round(indexspot - (indexspot % optionspread)) - 300 + 100 * i
          }CE`;
        cepesymbolarr.push(ceSymbol);
        peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(
          indexspot - (indexspot % 100) + 200 - 100 * i
        )}PE`;
        cepesymbolarr.push(peSymbol);
      }

      const spotmultiPrice = await getexactrangePrice(cepesymbolarr);
     // console.log(spotmultiPrice)
      if (waittillmessage == true) {
        waittillmessage = false;
        console.log('START',    selectedceSymbolVal, selectedceSymbolPrice, selectedpeSymbolVal ,selectedpeSymbolPrice);
      }
      cepesymbolarr = [];
      
      // if(saveapimessage == '' ){
      //   for (let i = 0; i < 15; i++) {
      //     ceSymbol = `${indextype}${currentWeeklyExpiry}${Math.round(indexspot - (indexspot % optionspread)) - 300 + 100 * i
      //       }CE`;
      //     cepesymbolarr.push(ceSymbol);
      //     peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(
      //       indexspot - (indexspot % 100) + 200 - 100 * i
      //     )}PE`;
      //     cepesymbolarr.push(peSymbol);
      //   }
  
      //   const spotmultiPrice = await getexactrangePrice(cepesymbolarr);
      //   if (waittillmessage == true) {
      //     waittillmessage = false;
      //     console.log('START');
      //   }
      //   cepesymbolarr = [];
      // } else{
      //   // switch (saveapimessage) {
      //   //   case 'up':
      //   //     saveapimessage = '';
      //   //     if (Orderstatus == 'wait') {
      //   //       Orderstatus = 'InorderCE';
      //   //       console.log('CEInforet', selectedceSymbolPrice, selectedceSymbolVal);
      //   //       Order_Information = await placeBracketOrder(fyersSaved, selectedceSymbolVal, selectedceSymbolPrice, acceptedProfit, qty);
      //   //       console.log('Waiting for loss / profit');
  
      //   //       Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
      //   //       if (Past_orders.OrderType == 'stopOrder') {
      //   //         acceptedProfit = acceptedProfit + 0.1;
      //   //         Orderstatus = 'wait'
      //   //         console.log('loss / Waiting for next order');
      //   //         Order_Information = null;
      //   //         Past_orders = null; 
      //   //       }
      //   //       if (Past_orders.OrderType == 'profitOrder') {
      //   //         Orderstatus = 'STOP'
      //   //       }
      //   //     }
      //   //     break;
  
      //   //   case 'down':
      //   //       saveapimessage = '';
      //   //       Orderstatus = 'InorderPE';
      //   //       console.log('PEInforet', selectedpeSymbolPrice, selectedpeSymbolVal);
      //   //       Order_Information = await placeBracketOrder(fyersSaved, selectedpeSymbolVal, selectedpeSymbolPrice, acceptedProfit, qty);
      //   //       console.log('Waiting for loss / profit');
      //   //       Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
      //   //       if (Past_orders.OrderType == 'stopOrder') {
      //   //         acceptedProfit = acceptedProfit + 0.1;
      //   //         Orderstatus = 'wait'
      //   //         console.log('Profit / Waiting for next order');
      //   //         Order_Information = null;
      //   //         Past_orders = null; 
      //   //       }
      //   //       if (Past_orders.OrderType == 'profitOrder') {
      //   //         Orderstatus = 'STOP'
      //   //       }
      //   //      break;
      //   // }
      // }
      
    }

    const intervalId = setInterval(async () => {
      if (new Date().getHours() > 8 && new Date().getMinutes() > 14 && Orderstatus !== 'STOP') {
        const indexspot = await SpotPrice();
        for (let i = 0; i < 25; i++) {
          ceSymbol = `${indextype}${currentWeeklyExpiry}${Math.round(indexspot - (indexspot % optionspread)) - 300 + 100 * i
            }CE`;
          cepesymbolarr.push(ceSymbol);
          peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(
            indexspot - (indexspot % 100) + 200 - 100 * i
          )}PE`;
          cepesymbolarr.push(peSymbol);
        }

        const spotmultiPrice = await getexactrangePrice(cepesymbolarr);
        //console.log('291',spotmultiPrice );
        if (waittillmessage == true) {
          waittillmessage = false;
          console.log('START');
          cepesymbolarr = [];
        }
        cepesymbolarr = [];
      }
    }, 5000);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();

app.post('/api/data', async (req, res) => {
  const { input1, input2, option } = req.body;
  console.log('received', req.body, 'waittillmessage', waittillmessage);
    saveapimessage = req.body;
    if (Orderstatus == 'wait' && waittillmessage == false  ) {
      switch (saveapimessage) {
        case 'up':
          saveapimessage = '';
          if (Orderstatus == 'wait') {
            Orderstatus = 'InorderCE';
            console.log('CEInforet', selectedceSymbolPrice, selectedceSymbolVal);
            Order_Information = await placeBracketOrder(fyersSaved, selectedceSymbolVal, selectedceSymbolPrice, acceptedProfit, qty);
            console.log('Waiting for loss / profit');

            Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
            if (Past_orders.OrderType == 'stopOrder') {
              acceptedProfit = acceptedProfit + 0.1;
              Orderstatus = 'wait'
              console.log('loss / Waiting for next order');
              Order_Information = null;
              Past_orders = null; 
            }
            if (Past_orders.OrderType == 'profitOrder') {
              Orderstatus = 'STOP'
            }
          }
          break;

        case 'down':
            saveapimessage = '';
            Orderstatus = 'InorderPE';
            console.log('PEInforet', selectedpeSymbolPrice, selectedpeSymbolVal);
            Order_Information = await placeBracketOrder(fyersSaved, selectedpeSymbolVal, selectedpeSymbolPrice, acceptedProfit, qty);
            console.log('Waiting for loss / profit');
            Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
            if (Past_orders.OrderType == 'stopOrder') {
              acceptedProfit = acceptedProfit + 0.1;
              Orderstatus = 'wait'
              console.log('Profit / Waiting for next order');
              Order_Information = null;
              Past_orders = null; 
            }
            if (Past_orders.OrderType == 'profitOrder') {
              Orderstatus = 'STOP'
            }
           break;
      }
    }
  if (Orderstatus == 'STOP') {
    console.clear();
    console.log("GO HOME & REST");
  }

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


