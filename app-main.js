import pkg from 'cors';
const {cors} = pkg;
import pkgexpress from 'express';
const {express} = pkgexpress;
import pkgparser from 'body-parser';
const {bodyParser} = pkgparser;

const app = pkgexpress();
const port = 3000;
app.use(pkg()); // Allow all origins

// Use body-parser middleware to parse JSON and URL-encoded bodies
app.use(pkgparser.json()); // Parses JSON requests
app.use(pkgparser.urlencoded({ extended: true })); // Parses URL-encoded requests


// main.js
import { createfyersobj, openWebSocket, CEsymbolAndPrice, PEsymbolAndPrice, getBankNiftySpotPrice } from './fyersInit.js';  // Import the placeBracketOrder function
import { placeBracketOrder } from './ExecuteBO.js';  // Import the placeBracketOrder function
import { updateOrderStatusOneTime } from './BO-status-track.js';
import { updateOrderStatus } from './BO-status-contn.js';
import {updateSingleOrderStatus} from './BO_SOrder.js';

// server.js (Node.js Backend)

var appid = "XBDVKT3M7D-100";
var secret = "MMW6LIQ3QS";
var authcode= "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3MjgzNTg0MTAsImV4cCI6MTcyODM4ODQxMCwibmJmIjoxNzI4MzU3ODEwLCJhdWQiOiJbXCJ4OjBcIiwgXCJ4OjFcIiwgXCJ4OjJcIiwgXCJkOjFcIiwgXCJkOjJcIiwgXCJ4OjFcIiwgXCJ4OjBcIl0iLCJzdWIiOiJhdXRoX2NvZGUiLCJkaXNwbGF5X25hbWUiOiJZQTIzMjExIiwib21zIjoiSzEiLCJoc21fa2V5IjoiZjE4NmI3ZGM2Y2MyZGJmYmJiMzI1NmEyYTBmZWI2NThlNzllYjI2MGI4ZjNlMzhlYjYxNWU1MDYiLCJub25jZSI6IiIsImFwcF9pZCI6IlhCRFZLVDNNN0QiLCJ1dWlkIjoiYTQ4NDk4OWU1MWNhNDhiMDg1NmU5Y2MzOTA4ODc0ZTAiLCJpcEFkZHIiOiIwLjAuMC4wIiwic2NvcGUiOiIifQ.fGXj4uz0P2ox54bZaDfZz6mtkprvVou2SkQfqBpdFDM";
var genericsymbol= "NSE:BANKNIFTY";
var weeklyexpiry= "24O09";
var symboltraded= "51500";
var tradedside = "CE";
var qty= 15; // based on capital daily change
var  spotPrice = 0;

var Order_Information =  {
  parentOrder: {
    orderId: '24100800041136-BO-1',
    symbol: 'NSE:BANKNIFTY24O0951500CE',
    orderType: 'BO',
    price: 100,
    status: 2
  },
  stopOrder: {
    orderId: '24100800041136-BO-2',
    symbol: 'NSE:BANKNIFTY24O0951500CE',
    orderType: 'STOP_LOSS',
    price: 50,
    status: 6
  },
  profitOrder: {
    orderId: '24100800041136-BO-3',
    symbol: 'NSE:BANKNIFTY24O0951500CE',
    orderType: 'TAKE_PROFIT',
    price: 50,
    status: 6
  }
};

var Past_orders = {};

var Orderstatus= 'wait';

var fyersSaved= null;
async function main(){
    createfyersobj(appid, secret, authcode).then( async fyers=>{
      fyersSaved =  fyers;
      const price = 100;                        // Example price
        const acceptedProfit = 0.1;                 // Profit percentage, e.g., 10%
    
        try {


          
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
            if(new Date().getHours() > 9){
              spotPrice = await getBankNiftySpotPrice();
              console.log(spotPrice)
              openWebSocket(spotPrice);
            }

            console.log(spotPrice);
        } catch (error) {
            console.error("Error in placing the bracket order:", error);
        }
    });

   

}

main();


// Open WebSocket connection to receive real-time data


// Define an endpoint (e.g., /api/greet)
app.post('/api/greet', async (req, res) => {
  const { input1, input2, option } = req.body;
console.log(req.body);
if (Orderstatus == 'wait'){
  switch (req.body){
    case 'up':
      Orderstatus = 'order';
      const CEInforet = CEsymbolAndPrice();
      Order_Information = await placeBracketOrder(fyersSaved, CEInforet.CESymbol , CEInforet.CEPrice, acceptedProfit,qty);
      Past_orders = await updateOrderStatus(fyersSaved, Order_Information );
         if (Past_orders.stopOrder == 2){
              acceptedProfit = acceptedProfit + 0.1;
               Orderstatus = 'wait'
            }
      break;

    case 'down':
      Orderstatus = 'order';
      const PEInforet = CEsymbolAndPrice();
      Order_Information = await placeBracketOrder(fyersSaved, PEInforet.PESymbol , PEInforet.PEPrice, acceptedProfit,qty);
      Past_orders = await updateOrderStatus(fyersSaved, Order_Information );
         if (Past_orders.stopOrder == 2){
              acceptedProfit = acceptedProfit + 0.1;
               Orderstatus = 'wait'
            }
      break;
  }

}

});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});