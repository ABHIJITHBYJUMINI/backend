import { placeBracketOrder } from './ExecuteBO.js';  // Import the placeBracketOrder function
import { spotPrice } from './spotPriceCal.js';
import {getexactrangePrice} from './exactRangeCal.js';
import pkg from "cors";
const { cors } = pkg;
import pkgexpress from "express";
const { express } = pkgexpress;
import pkgparser from "body-parser";
const { bodyParser } = pkgparser;
const app = pkgexpress();
const port = 3000;
app.use(pkg()); // Allow all origins
// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(pkgparser.text()); // Parses JSON requests
app.use(pkgparser.urlencoded({ extended: true })); // Parses URL-encoded requests

import pkgfyers from "fyers-api-v3";
const { fyersModel } = pkgfyers;
//import { fyersModel, fyersDataSocket } from "fyers-api-v3";
var fyers = new fyersModel({
  logs: "path where you want to save logs",
  enableLogging: false,
});
var appidsaved = "XBDVKT3M7D-100";
var accesstoken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3Mjk0ODE1MzYsImV4cCI6MTcyOTU1NzAxNiwibmJmIjoxNzI5NDgxNTM2LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbkZjdEFXN3d2OHhHaFgwVUtXMFR4Q3FxQWh1NE1fcDdKamktZVdtOUlnMmlIOUF2Um51MTBCWU1KNFhpMW56bENldTQ3d0F3bHVpWXJuaEVWMHhFR3h6cU9JVjBvelRlZU9ZUzZaaEhBZmFLVTJXND0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.foOf_PyFOuuLKYUaRBmJqLFdVLXsNqiUnCu9SScqjaQ";

fyers.setAppId(appidsaved);
fyers.setAccessToken(accesstoken);

var preparedarray = [];
var selectedcepesymbolAndValues = null;

var saveapimessage = '';
var Orderstatus = 'wait';

var Order_Information = null;
var Past_orders = 0;
var qty = 15;

var acceptedProfit = 0.1;//change
var selectedceSymbolVal= ''
var  selectedceSymbolPrice = 0;
var selectedpeSymbolVal= ''
var  selectedpeSymbolPrice = 0;

async function main() {
  preparedarray = await spotPrice(fyers);
  //console.log(preparedarray);
  selectedcepesymbolAndValues = await getexactrangePrice(fyers, preparedarray);
  console.log(selectedcepesymbolAndValues);
  selectedceSymbolVal = selectedcepesymbolAndValues.selectedCESymbol;
  selectedceSymbolPrice =selectedcepesymbolAndValues.selectedCESymbolPrice;
  selectedpeSymbolVal =selectedcepesymbolAndValues.selectedPESymbol;
  selectedpeSymbolPrice =selectedcepesymbolAndValues.selectedPESymbolPrice;

  console.log('CEInforet', selectedceSymbolPrice, selectedceSymbolVal);
  Order_Information = await placeBracketOrder(fyers, selectedceSymbolVal, selectedceSymbolPrice, acceptedProfit, qty);
  console.log('Waiting for loss / profit');

  Past_orders = await updateOrderStatus(fyers, Order_Information);
  if (Past_orders.OrderType == 'stopOrder') {
    acceptedProfit = acceptedProfit + 0.1;
    Orderstatus = 'wait'
    console.log('loss / Waiting for next order');
    Order_Information = null;
    Past_orders = null; 
  }
  if (Past_orders.OrderType == 'profitOrder') {
    Orderstatus = 'STOP'
    console.log("GO HOME & REST");
  }
}

app.post("/api/data", async (req, res) => {
    console.log("received", req.body);
    saveapimessage = req.body;
    preparedarray = await spotPrice(fyers);
    //console.log(preparedarray);
    selectedcepesymbolAndValues = await getexactrangePrice(fyers, preparedarray);
    selectedceSymbolVal = selectedcepesymbolAndValues.selectedCESymbol;
    selectedceSymbolPrice =selectedcepesymbolAndValues.selectedCESymbolPrice;
    selectedpeSymbolVal =selectedcepesymbolAndValues.selectedPESymbol;
    selectedpeSymbolPrice =selectedcepesymbolAndValues.selectedPESymbolPrice;
  
    switch (saveapimessage) {
      case 'up':
        saveapimessage = '';
        if (Orderstatus == 'wait') {
          Orderstatus = 'InorderCE';
          console.log('CEInforet', selectedceSymbolPrice, selectedceSymbolVal, acceptedProfit);
          Order_Information = await placeBracketOrder(fyers, selectedceSymbolVal, selectedceSymbolPrice, acceptedProfit, qty);
          console.log('Waiting for loss / profit');
          let { parentOrder, stopOrder, profitOrder } = Order_Information;
          const intervalId = setInterval(async () => {
                const findOrderStatus = (orderId) => {
                    fyers.get_orders().then(order=>{ 
                        console.log('Tradebook', order);
                        const myorder = (order.orderBook).find(searchorder => searchorder.id === orderId);
                        return myorder ? myorder.status : undefined; // Return status if found, otherwise undefined
                    });
                 };
                 const allorders = await fyers.get_orders();
                 const profitorderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-3');
                 const stoporderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-2');
                 console.log('Profit:', profitorderiffound.status, '/ Stop :', stoporderiffound.status);
                 if(profitorderiffound.status == 2){
                    clearInterval(intervalId);
                    console.log("Profit trade completed, END for day.");
                    Orderstatus = 'STOP'
                 }
                 if(stoporderiffound.status == 2){
                    console.log("Stop trade completed, Try Again.");
                    clearInterval(intervalId);
                    acceptedProfit = acceptedProfit + 0.1;
                    Orderstatus = 'wait' 
                 }
                }, 2500);
        }
        break;

      case 'down':
          saveapimessage = '';
          Orderstatus = 'InorderPE';
          console.log('PEInforet', selectedpeSymbolPrice, selectedpeSymbolVal, acceptedProfit);
          Order_Information = await placeBracketOrder(fyers, selectedpeSymbolVal, selectedpeSymbolPrice, acceptedProfit, qty);
          console.log('Waiting for loss / profit');

          let { parentOrder, stopOrder, profitOrder } = Order_Information;
          const intervalId = setInterval(async () => {
                const findOrderStatus = (orderId) => {
                    fyers.get_orders().then(order=>{ 
                        console.log('Tradebook', order);
                        const myorder = (order.orderBook).find(searchorder => searchorder.id === orderId);
                        return myorder ? myorder.status : undefined; // Return status if found, otherwise undefined
                    });
                 };
                 const allorders = await fyers.get_orders();
                 const profitorderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-3');
                 const stoporderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-2');
                 console.log('Profit:', profitorderiffound.status, '/ Stop :', stoporderiffound.status);
                 if(profitorderiffound.status == 2){
                    clearInterval(intervalId);
                    console.log("Profit trade completed, END for day.");
                    Orderstatus = 'STOP'
                    //return 1;
                 }
                 if(stoporderiffound.status == 2){
                    console.log("Stop trade completed, Try Again.");
                    clearInterval(intervalId);
                    //return 2;
                    acceptedProfit = acceptedProfit + 0.1;
                    Orderstatus = 'wait'
                 }
                }, 2500);
         break;
    }
  });
  
  // Start the server
  app.listen(port, async () => {
    console.log(`Server is running on http://localhost:${port}`);
    //const appresult = await main();
  });