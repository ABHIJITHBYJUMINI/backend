// placeBracketOrder.js
export async function placeBracketOrder(fyers, symbol, price, acceptedProfit, qty) {
    try {
        const stopLoss = 0.25;       // Customize your stop-loss percentage
        // Prepare the request body for the bracket order (BO)
        const reqBody = {
            symbol: symbol,                  // Symbol to trade
            qty: qty,                        // Quantity
            type: 1,                         // Order type: 1 (Limit Order)
            side: 1,                         // 1 = Buy, -1 = Sell
            productType: "BO",               // Bracket Order type
            limitPrice: price,               // Price at which the order is placed
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
            const orderDetails = response.id;  // Parent order ID
            console.log(response);
            // Return a JSON array with order info
            return {
                parentOrder: {
                    orderId: orderDetails,            // Parent order ID
                    symbol: symbol,                   // Symbol of the trade
                    orderType: "BO",                  // Bracket Order type
                    price: price,                     // Price at which the parent order was placed
                    status: response.status,          // Status of the parent order
                },
                stopOrder: {
                    orderId: response.sl_id,          // Stop-loss order ID
                    price: Math.round(price * stopLoss),  // Stop-loss price
                    status: "PENDING",                // Initial status for stop-loss order
                    orderType: "STOP_LOSS",           // Order type for stop-loss
                    symbol: symbol                    // Symbol of the trade
                },
                profitOrder: {
                    orderId: response.tp_id,          // Take-profit order ID
                    price: Math.round(price * acceptedProfit),  // Take-profit price
                    status: "PENDING",                // Initial status for take-profit order
                    orderType: "TAKE_PROFIT",         // Order type for take-profit
                    symbol: symbol                    // Symbol of the trade
                }
            };
        } else {
            throw new Error("Order placement failed.");
        }
    } catch (error) {
        console.error("Error placing bracket order:", error);
        return { error: error.message };
    }
}
