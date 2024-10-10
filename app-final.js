import { createfyersobj, getBankNiftySpotPrice, openWebSocket, CEsymbolAndPrice, PEsymbolAndPrice } from './fyersInit-final.js';  // Import the placeBracketOrder function
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

var Orderstatus = 'wait';
var fyersSaved = null;
var acceptedProfit = 0.1;
var qty = 15;
var Order_Information = null;

var Past_orders = null;




var appid = '';
var secret = '';
var authcode = '';

async function main() {
    createfyersobj(appid, secret, authcode).then(async fyers => {
        const price = 100;                        // Example price
        const acceptedProfit = 0.1;                 // Profit percentage, e.g., 10%
        fyersSaved = fyers;
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

            if (new Date().getHours() > 9) {
                const spotPrice = await getBankNiftySpotPrice();
                console.log('Waiting for order');
                await openWebSocket().then(_=>{
                // Define an endpoint (e.g., /api/greet)
                app.post('/api/data', async (req, res) => {
                    const { input1, input2, option } = req.body;
                    console.log('received', req.body);
                    if (Orderstatus == 'wait') {
                        switch (req.body) {
                            case 'up':
                                if (Orderstatus == 'wait') {

                                    const CEInforet = CEsymbolAndPrice();
                                    console.log('CEInforet', CEInforet);
                                    Order_Information = await placeBracketOrder(fyersSaved, CEInforet.CESymbol, CEInforet.CEPrice, acceptedProfit, qty);
                                    console.log('Waiting for loss / profit');
                                    Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
                                    if (Past_orders.stopOrder == 2) {
                                        acceptedProfit = acceptedProfit + 0.1;
                                        Orderstatus = 'wait'
                                        console.log('loss / Waiting for next order');
                                    }
                                }

                                break;

                            case 'down':
                                if (Orderstatus == 'wait') {

                                    const PEInforet = PEsymbolAndPrice();
                                    Order_Information = await placeBracketOrder(fyersSaved, PEInforet.PESymbol, PEInforet.PEPrice, acceptedProfit, qty);
                                    console.log('Waiting for loss / profit');
                                    Past_orders = await updateOrderStatus(fyersSaved, Order_Information);
                                    if (Past_orders.stopOrder == 2) {
                                        acceptedProfit = acceptedProfit + 0.1;
                                        Orderstatus = 'wait'
                                        console.log('Profit / Waiting for next order');
                                    }

                                }
                                break;
                        }
                    }

                });
                })

            }

        } catch (error) {
            console.error("Error in placing the bracket order:", error);
        }
    });



}

main();

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});


