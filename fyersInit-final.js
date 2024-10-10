import { fyersModel, fyersDataSocket } from "fyers-api-v3";
var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": false });
var appidsaved = "XBDVKT3M7D-100";
var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3Mjg0NDUyMTgsImV4cCI6MTcyODUyMDIxOCwibmJmIjoxNzI4NDQ1MjE4LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbkJmc2lsNThqRXA3ajl5VWhIYndQbGpBOU1hbS1Ga2hCeGFrY2Y5TVdMWGtXRGdWSU44dzlLVURsZXBTT0dlVndzanp5cjJDWFBYQTRsNFhZU3dwXzVtVURaY2NNOHFwQjVGVFVoR2FsNFBDOGJnND0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.Iftul7TgZbGR55mqKHK-oMN54M5DJNXnuRXSQ9um2Yw";



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

let currentWeeklyExpiry = "24O09";

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
export async function getBankNiftySpotPrice() {
    try {
      const response = await fyers.getQuotes(["NSE:NIFTYBANK-INDEX"]);
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
export function openWebSocket() {
    // Event: When WebSocket is connected
    dataSocket.on("connect", function () {
      //console.log("WebSocket connected- NEW",    Math.round(spotPrice - (spotPrice % 100)));
  
      // Create CE and PE symbols with closest strikes
      ceSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${
        Math.round(spotPrice - (spotPrice % 100)) + 100
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
      peSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${
        Math.round(spotPrice - (spotPrice % 100)) + 100
      }PE`;
      peSymbolnextValue = Math.round(spotPrice - (spotPrice % 100) + 100);
      subslist.push(ceSymbol);
      subslist.push(peSymbol);
      subslist.push(ceSymbolnext);
      subslist.push(peSymbolnext);
      // Subscribe to CE and PE symbols for real-time data
      dataSocket.subscribe(subslist);
      dataSocket.mode(dataSocket.LiteMode);
    });
  
    // Event: When a new message (data) is received from the WebSocket
    dataSocket.on("message", function (message) {
      //console.log("Received real-time data:", message);
  
      switch (message.symbol) {
        case ceSymbol:
          //console.log(ceSymbol ,';', cenextPrice,  message.ltp);
          if (ceSymbolnextVal !== null) {
            if (message.ltp > rangeprice && cenextPrice > rangeprice) {
              ceSymbolValue = ceSymbolValue + 100;
              ceSymbolnextValue = ceSymbolnextValue + 100;
              updatearray = true;
            } else if (message.ltp < rangeprice && cenextPrice > rangeprice) {
              cePrice = message.ltp;
               //console.log(ceSymbol, ceSymbolnext , ":", message.ltp); //200/100
              if (pePrice !== null) {
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
        updatearray = false;
        ceSymbol =`NSE:BANKNIFTY${currentWeeklyExpiry}${ceSymbolValue}CE`;
  
        ceSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${ceSymbolnextValue}CE`;
  
        peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${peSymbolValue}PE`;
  
        peSymbolnext = `NSE:BANKNIFTY${currentWeeklyExpiry}${peSymbolnextValue}PE`;
        //subslist.splice(0, subslist.length); // Removes all elements
        //console.log("reached");
        subslist.push(ceSymbol);
        subslist.push(peSymbol);
        subslist.push(ceSymbolnext);
        subslist.push(peSymbolnext);
        dataSocket.subscribe(subslist);
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
  }

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


    export function CEsymbolAndPrice(){
        console.log('selectedceSymbolPrice', selectedceSymbolPrice);
        return {
            CEPrice : selectedceSymbolPrice,
            CESymbol : selectedceSymbolVal
        }
      }
    
      export function PEsymbolAndPrice(){
    
        console.log('selectedpeSymbolPrice', selectedpeSymbolPrice);
            return {
            PEPrice : selectedpeSymbolPrice,
            PESymbol : selectedpeSymbolVal
        }
        
      }