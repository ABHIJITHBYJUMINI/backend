
// main.js
import { createfyersobj } from './fyersInit.js';  // Import the placeBracketOrder function
import { placeBracketOrder } from './ExecuteBO.js';  // Import the placeBracketOrder function
import { updateOrderStatusOneTime } from './BO-status-track.js';
import { updateOrderStatus } from './BO-status-contn.js';
import {updateSingleOrderStatus} from './BO_SOrder.js';

var appid = "XBDVKT3M7D-100";
var secret = "MMW6LIQ3QS";
var authcode= "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkubG9naW4uZnllcnMuaW4iLCJpYXQiOjE3Mjc5Mzg3NTUsImV4cCI6MTcyNzk2ODc1NSwibmJmIjoxNzI3OTM4MTU1LCJhdWQiOiJbXCJ4OjBcIiwgXCJ4OjFcIiwgXCJ4OjJcIiwgXCJkOjFcIiwgXCJkOjJcIiwgXCJ4OjFcIiwgXCJ4OjBcIl0iLCJzdWIiOiJhdXRoX2NvZGUiLCJkaXNwbGF5X25hbWUiOiJZQTIzMjExIiwib21zIjoiSzEiLCJoc21fa2V5IjoiZjE4NmI3ZGM2Y2MyZGJmYmJiMzI1NmEyYTBmZWI2NThlNzllYjI2MGI4ZjNlMzhlYjYxNWU1MDYiLCJub25jZSI6IiIsImFwcF9pZCI6IlhCRFZLVDNNN0QiLCJ1dWlkIjoiN2E5MGY1Y2Q1YjhjNDI5MWJkMTZkNjU4MzA2N2JkZTIiLCJpcEFkZHIiOiIwLjAuMC4wIiwic2NvcGUiOiIifQ.v1UB0QtQ6UDALm_nRktsLYagTMdsrfw4ntAoDumh7Yk";
var genericsymbol= "NSE:BANKNIFTY";
var weeklyexpiry= "24O09";
var symboltraded= "53500";
var tradedside = "CE";
var qty= 15; // based on capital daily change

var Order_Information =  {
    parentOrder: {
      orderId: '24100300237092',
      symbol: 'NSE:BANKNIFTY24O0953000PE',
      orderType: 'BO',
      price: 140,
      status: undefined
    },
    stopOrder: {
      orderId: undefined,
      price: 70,
      status: 'PENDING',
      orderType: 'STOP_LOSS',
      symbol: 'NSE:BANKNIFTY24O0953000PE'
    },
    profitOrder: {
      orderId: undefined,
      price: 70,
      status: 'PENDING',
      orderType: 'TAKE_PROFIT',
      symbol: 'NSE:BANKNIFTY24O0953000PE'
    }
};

var Past_orders = {};

async function main(){
    createfyersobj(appid, secret, authcode).then( async fyers=>{
        const price = 22;                        // Example price
        const acceptedProfit = 0.1;                 // Profit percentage, e.g., 10%
    
        try {
            Order_Information = await placeBracketOrder(fyers, (genericsymbol + weeklyexpiry + symboltraded + tradedside), price, acceptedProfit,qty);
            
            //Order_Information = await updateSingleOrderStatus(fyers, Order_Information);
            //Order_Information = await updateOrderStatusOneTime(fyers, Order_Information );
            Past_orders = await updateOrderStatus(fyers, Order_Information );
            //update oldOders and profit for next trade also stop trading
            
            console.log("Order Information:", Past_orders);
            //check and act

        } catch (error) {
            console.error("Error in placing the bracket order:", error);
        }
    });

   

}

main();
