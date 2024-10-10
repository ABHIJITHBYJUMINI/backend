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
var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3Mjg1MzIxMzAsImV4cCI6MTcyODYwNjY1MCwibmJmIjoxNzI4NTMyMTMwLCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbkIwNmlOWE05Vk04bEhHS0hiU2FHVDYwNzM1TVJoYkZQUm81MHJZTjFLRTBWbjNyd3JyckdhdUJQWTBhVTRycUwyd0hwaXJFYTBxUzN1ejktMEI0RHZNM0l3NkotVGZ4NVdJZVlERE45OHB3WnJyUT0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.gUuQiQ8szNaKZ2Etjb_w2SO2mSS7vnx9tQF7Nwfxj0Q";



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
let cePrice = null;
let pePrice = null;
let cenextPrice = null;
let penextPrice = null;

let selectedceSymbolVal = null;
let selectedpeSymbolVal = null;

let selectedceSymbolPrice = null;
let selectedpeSymbolPrice = null;

let ceSymbolnextVal = null;
let peSymbolnextVal = null;

let currentWeeklyExpiry = "24O16";

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
var acceptedProfit = 0.1;
var qty = 15;
var Order_Information =  {
  parentOrder: {
      orderId: '24101000065386' + '-BO-1',            // Parent order ID
      symbol: 'BANKNIFTY24O1652300CE',                   // Symbol of the trade
      orderType: "BO",                  // Bracket Order type
      price: 85.5,                     // Price at which the parent order was placed
      status: 2,
      executedtime : '09-Oct-2024 10:30:53'          // Status of the parent order
      
  },
  stopOrder: {
      orderId: '24101000065386' + '-BO-2',          // Stop-loss order ID
      symbol: 'BANKNIFTY24O1652300CE' ,                   // Symbol of the trade
      orderType: "STOP_LOSS",           // Order type for stop-loss
      price: 45,  // Stop-loss price
      status: 6,
      executedtime : '09-Oct-2024 10:30:53'                 // Initial status for stop-loss order
      
     
  },
  profitOrder: {
      orderId: '24101000065386' + '-BO-3',          // Take-profit order ID
      symbol: 'BANKNIFTY24O1652300CE',                    // Symbol of the trade
      orderType: "TAKE_PROFIT",         // Order type for take-profit
      price: 12,  // Take-profit price
      status: 6,
      executedtime : '09-Oct-2024 10:30:53'                 // Initial status for take-profit order
  }
} ;

var Past_orders = null;
var saveapimessage = '';



var appid = '';
var secret = '';
var authcode = '';
var waittillmessage = true;
var OrderSide = '';
export async function getBankNiftySpotPrice() {
  try {
    const response = await fyers.getQuotes(["NSE:NIFTYBANK-INDEX"]);
    //console.log('GETCQUOTES', response);
    if (response.s && response.d.length > 0) {
      spotPrice = (Math.round(response.d[0].v.lp));
      return Math.round(response.d[0].v.lp); // Last traded price
    } else {
      throw new Error("Could not fetch Bank Nifty spot price.");
    }
  } catch (error) {
    console.error("Error fetching Bank Nifty spot price:", error);
    throw error;
  }
}

// Open WebSocket connection to receive real-time data
//export function openWebSocket() {
// Event: When WebSocket is connected
dataSocket.on("connect", async function () {
  //console.log("WebSocket connected- NEW",    Math.round(spotPrice - (spotPrice % 100)));
  //createfyersobj(appid, secret, authcode).then(async fyers => {
  //console.log('CONNECTED');
  fyersSaved = fyers;
  //try {



  //Order_Information = await placeBracketOrder(fyers, (genericsymbol + weeklyexpiry + symboltraded + tradedside), price, acceptedProfit,qty);
  //console.log(Order_Information);
  //Order_Information = await updateSingleOrderStatus(fyers, Order_Information);
  //Order_Information = await updateOrderStatusOneTime(fyers, Order_Information );
  //Past_orders = await updateOrderStatus(fyers, Order_Information );

  // if (Past_orders.stopOrder == 2){
  //   acceptedProfit = acceptedProfit + 0.1;
  // }
  //update oldOders and profit for next trade also stop trading

  //console.log("Order Information:", Past_orders);
  //check and act

  //console.log(new Date().getHours())
  if (new Date().getHours() > 8) {
    spotPrice = await getBankNiftySpotPrice();
    //console.log('Waiting for order', spotPrice);
    // Define an endpoint (e.g., /api/greet)


    //openWebSocket();


  }

  // } catch (error) {
  //     console.error("Error in placing the bracket order:", error);
  // }

  // Create CE and PE symbols with closest strikes
  ceSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(spotPrice - (spotPrice % 100)) + 100
    }CE`;
  ceSymbolValue = Math.round(spotPrice - (spotPrice % 100)) + 100;
  ceSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(
    spotPrice - (spotPrice % 100)
  )}CE`;
  ceSymbolnextValue = Math.round(spotPrice - (spotPrice % 100));
  peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(
    spotPrice - (spotPrice % 100)
  )}PE`;
  peSymbolValue = Math.round(spotPrice - (spotPrice % 100));
  peSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(spotPrice - (spotPrice % 100)) + 100
    }PE`;
  peSymbolnextValue = Math.round(spotPrice - (spotPrice % 100) + 100);
  subslist.push(ceSymbol);
  subslist.push(peSymbol);
  subslist.push(ceSymbolnext);
  subslist.push(peSymbolnext);
  // Subscribe to CE and PE symbols for real-time data
  dataSocket.subscribe(subslist);
  //console.log('subslist', subslist)
  dataSocket.mode(dataSocket.LiteMode);
});

// Event: When a new message (data) is received from the WebSocket
dataSocket.on("message", async function (message) {
  //console.log("Received real-time data:", message);


  switch (message.symbol) {
    case ceSymbol:
      // /console.log(ceSymbol ,';', cenextPrice,  message.ltp);
      if (ceSymbolnextVal !== null) {
        if (message.ltp > rangeprice && cenextPrice > rangeprice) {
          ceSymbolValue = ceSymbolValue + 100;
          ceSymbolnextValue = ceSymbolnextValue + 100;
          updatearray = true;
        } else if (message.ltp < rangeprice && cenextPrice > rangeprice) {
          cePrice = message.ltp;
          //console.log(ceSymbol, ceSymbolnext , ":", message.ltp); //200/100
          if (pePrice !== null) {
            if (waittillmessage == true) {
              waittillmessage = false;
              console.log('START');
            }

            if (
              Math.abs(cePrice - pePrice) > Math.abs(cenextPrice - pePrice)
            ) {
              //console.log('selected: CE Price : ', cenextPrice);
              selectedceSymbolVal = ceSymbolnext;
              selectedceSymbolPrice = cenextPrice;
              //Trend received
              //do trade in cenextPrice
              //Trend change received
              //check the BO if the loss has beeen booked - update the total loss else ignore it
              //if no trades then act on the trend change signal wwith proper stop profit
            } else {
              //console.log('selected: CE Price : ', cePrice);
              selectedceSymbolVal = ceSymbol;
              selectedceSymbolPrice = cePrice;
              //do trade in cePrice
              //Trend received
              //do trade in cePrice
              //Trend change received
              //check the BO if the loss has beeen booked - update the total loss else ignore it
              //if no trades then act on the trend change signal wwith proper stop profit
            }
          }
        } else if (message.ltp < rangeprice && cenextPrice < rangeprice) {
          ceSymbolValue = ceSymbolValue - 100;
          ceSymbolnextValue = ceSymbolnextValue - 100;
          updatearray = true;
        }
      }
      break;
    case ceSymbolnext:
      //console.log(peSymbolnext , message.ltp);
      ceSymbolnextVal = true;
      cenextPrice = message.ltp;
      break;

    case peSymbol:
      if (peSymbolnextVal !== null) {
        //console.log(peSymbol ,';', penextPrice,  message.ltp);
        if (message.ltp > rangeprice && penextPrice > rangeprice) {
          peSymbolValue = peSymbolValue - 100;
          peSymbolnextValue = peSymbolnextValue - 100;
          updatearray = true;
        } else if (message.ltp < rangeprice && penextPrice > rangeprice) {
          //console.log(peSymbol, ":", message.ltp, peSymbolnext); // 800/900
          pePrice = message.ltp;
          if (Math.abs(pePrice - cePrice) > Math.abs(penextPrice - cePrice)) {
            //console.log('selected: PE Price : ', penextPrice);
            selectedpeSymbolVal = peSymbolnext;
            selectedpeSymbolPrice = penextPrice;
            //Trend received
            //do trade in penextPrice
            //Trend change received
            //check the BO if the loss has beeen booked - update the total loss else ignore it
            //if no trades then act on the trend change signal wwith proper stop profit
          } else {
            //console.log('selected: PE Price : ', pePrice);
            selectedpeSymbolVal = peSymbol;
            selectedpeSymbolPrice = pePrice;
            //do trade in pePrice
            //Trend received
            //do trade in pePrice
            //Trend change received
            //check the BO if the loss has beeen booked - update the total loss else ignore it
            //if no trades then act on the trend change signal wwith proper stop profit
          }
        } else if (message.ltp < rangeprice && penextPrice < rangeprice) {
          peSymbolValue = peSymbolValue + 100;
          peSymbolnextValue = peSymbolnextValue + 100;
          updatearray = true;
        }
      }
      break;

    case peSymbolnext:
      //console.log(peSymbolnext , message.ltp);
      peSymbolnextVal = true;
      penextPrice = message.ltp;
      break;
  }

  if (updatearray == true) {
    console.log('reached')
    updatearray = false;
    subslist.pop(ceSymbol);
    subslist.pop(peSymbol);
    subslist.pop(ceSymbolnext);
    subslist.pop(peSymbolnext);
    ceSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${ceSymbolValue}CE`;

    ceSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${ceSymbolnextValue}CE`;

    peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${peSymbolValue}PE`;

    peSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${peSymbolnextValue}PE`;
    //subslist.splice(0, subslist.length); // Removes all elements
    //console.log("reached");
    subslist.push(ceSymbol);
    subslist.push(peSymbol);
    subslist.push(ceSymbolnext);
    subslist.push(peSymbolnext);
    setTimeout(() => {
      dataSocket.subscribe(subslist);
    }, 500); // 500 milliseconds = 0.5 seconds

  
  } else {

  }
});

// Event: Handle WebSocket errors
dataSocket.on("error", function (error) {
  console.error("WebSocket error:", error);
});

// Event: When WebSocket connection is closed
dataSocket.on("close", function () {
  console.log("WebSocket connection closed.");
});

// Connect the WebSocket
dataSocket.connect();
//}

export async function createfyersobj(appid, secret, authcode) {
  // await fyers.generate_access_token({ "client_id": appid, "secret_key": secret, "auth_code": authcode }).then((response) => {
  //         if (response.s == 'ok') {
  //             fyers.setAccessToken(response.access_token);
  //             console.log(response.access_token);
  //         } else {
  //             console.log("error generating access token", response)
  //         }
  //     })
  //fyers.setAccessToken(accesstoken);
  return fyers;
}


export function CEsymbolAndPrice() {
  console.log('selectedceSymbolPrice', selectedceSymbolPrice);
  return {
    CEPrice: selectedceSymbolPrice,
    CESymbol: selectedceSymbolVal
  }
}

export function PEsymbolAndPrice() {

  console.log('selectedpeSymbolPrice', selectedpeSymbolPrice);
  return {
    PEPrice: selectedpeSymbolPrice,
    PESymbol: selectedpeSymbolVal
  }

}

app.post('/api/data', async (req, res) => {
  const { input1, input2, option } = req.body;
  console.log('received', req.body, 'waittillmessage', waittillmessage);


  if (waittillmessage == false && Orderstatus !== 'STOP') {
    console.log('waittillmessage', selectedceSymbolVal)
    saveapimessage = req.body; 


    
    if (Orderstatus == 'wait' && saveapimessage !== '') {
      switch (saveapimessage) {
        case 'up':
          if (Orderstatus == 'wait') {
            Orderstatus = 'InorderCE';
            //const CEInforet = CEsymbolAndPrice();
            console.log('CEInforet', selectedceSymbolPrice, selectedceSymbolVal);
            Order_Information = await placeBracketOrder(fyersSaved, selectedceSymbolVal, selectedceSymbolPrice, acceptedProfit, qty);
            console.log('Waiting for loss / profit');

            Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
            if (Past_orders.OrderType ==  'stopOrder') {
              acceptedProfit = acceptedProfit + 0.1;
              Orderstatus = 'wait'
              console.log('loss / Waiting for next order');
            }
            if (Past_orders.OrderType == 'profitOrder') {
              Orderstatus = 'STOP'
            }

            
          }
          break;

        case 'down':
          if (Orderstatus == 'wait') {
            Orderstatus = 'InorderPE';
            //const PEInforet = PEsymbolAndPrice();
            console.log('CEInforet', selectedpeSymbolPrice, selectedpeSymbolVal);
            Order_Information = await placeBracketOrder(fyersSaved, selectedpeSymbolVal, selectedpeSymbolPrice, acceptedProfit, qty);
            console.log('Waiting for loss / profit');
            Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
            if (Past_orders.OrderType ==  'stopOrder') {
              acceptedProfit = acceptedProfit + 0.1;
              Orderstatus = 'wait'
              console.log('Profit / Waiting for next order');
            }
            if (Past_orders.OrderType == 'profitOrder') {
              Orderstatus = 'STOP'
            }
            //Orderstatus = 'InorderPE';
          }
          break;
      }

      if(Orderstatus == 'InorderCE'){

      }
  
      if(Orderstatus == 'InorderPE'){

      }
    }

    
  }
  if(Orderstatus == 'STOP'){
    console.clear();
    console.log("GO HOME & REST");
  }

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});


