import { promises as fs } from 'fs'; // Import the promises version of fs
export async function placeBracketOrder(fyers, symbol, price, acceptedProfit, qty) {
    //try {
        const stopLoss = 0.1;       // Customize your stop-loss percentage
        // Prepare the request body for the bracket order (BO)
        console.log('price', price, 'stopLoss', Math.round(price * stopLoss), 'StopProfit', Math.round(price * acceptedProfit));
        const reqBody = {
            symbol: symbol,                  // Symbol to trade
            qty: qty,                        // Quantity
            type: 1,                         // Order type: 1 (Limit Order)
            side: 1,                         // 1 = Buy, -1 = Sell
            productType: "BO",               // Bracket Order type
            limitPrice: price + 0.5,               // Price at which the order is placed
            stopPrice: 0,                    // Stop Price (0 for BO)
            validity: "DAY",                 // Validity of the order
            stopLoss: Math.round(price * stopLoss),     // Stop Loss value
            takeProfit: Math.round(price * acceptedProfit),  // Take Profit value
            offlineOrder: false,             // Online order
            disclosedQty: 0                  // Disclosed quantity (0 for full)
        };

        // Execute the order using Fyers API
        const response = await fyers.place_order(reqBody);

        // Check if the order was successful
        if (response.s === "ok") {
            const orderDetails = response.id + '-BO-1';  // Parent order ID
            console.log(orderDetails);

            // const findOrderStatus = async ( mystring) => {
            //     await fyers.get_orders().then(order=>{ 
            //        // console.log('Orderbook', order);
            //         const myorder = (order.orderBook).find(searchorder => searchorder.parentId === orderDetails && (searchorder.id).slice(-5) === mystring );
            //         console.log('myorder', myorder)
            //         return myorder ? myorder.id : undefined;
            //     })
            //  };

            const allorders = await fyers.get_orders();
             // Convert the orders object to a string
        //const ordersString = JSON.stringify(allorders, null, 2); // `null, 2` for pretty formatting

        // Write the string to a text file
        // fs.writeFile('allorders.txt', ordersString, (err) => {
        //     if (err) {
        //         console.error('Error writing to file:', err);
        //     } else {
        //         console.log('Orders successfully written to allorders.txt');
        //     }
        // });
            const profitorderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === orderDetails && (searchorder.id).slice(-5) === '-BO-3');
            const stoporderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === orderDetails && (searchorder.id).slice(-5) === '-BO-2');
            //console.log('Found', profitorderiffound, stoporderiffound);
            if (profitorderiffound !== undefined && stoporderiffound !== undefined) {
                // Return a JSON array with order info
                const response = {
                    parentOrder: {
                        orderId: orderDetails,  // Parent order ID
                        symbol: symbol,         // Symbol of the trade
                        orderType: "BO",        // Bracket Order type
                        price: price,           // Price at which the parent order was placed
                        status: 2
                    },
                    stopOrder: {
                        orderId: stoporderiffound.id,  // Stop-loss order ID
                        symbol: stoporderiffound.symbol,                // Symbol of the trade
                        orderType: "STOP_LOSS",        // Order type for stop-loss
                        price: Math.round(price * stopLoss),  // Stop-loss price
                        status: 6
                    },
                    profitOrder: {
                        orderId: profitorderiffound.id,  // Take-profit order ID
                        symbol: profitorderiffound.symbol,                  // Symbol of the trade
                        orderType: "TAKE_PROFIT",        // Order type for take-profit
                        price: Math.round(price * acceptedProfit),  // Take-profit price
                        status: 6
                    }
                };

                //console.log(response);
                return response;
            } else {
                throw new Error("Order IDs not received properly.");
            }
        }


    //}
}