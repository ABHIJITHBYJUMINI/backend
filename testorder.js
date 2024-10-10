const { fyersOrderSocket } = require("fyers-api-v3");
// Replace with your Fyers credentials
const appId = "XBDVKT3M7D-100";        // Your Fyers application ID
const accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjgyNzMxNTgsImV4cCI6MTcyODM0NzQzOCwibmJmIjoxNzI4MjczMTU4LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbkExc0djbnlUNFIyZzd3MUFMbmJFeEctM1NtRENhTzlmQlYtVldhZjJBX3JydWhhc25yMmIzckZuX2UxejVwOW56RkpHcnVqSHBualVtM0pXVjRpZkVPT3Z6Uk10U3dwQWs0Tm13TmxYUUc0TWt5Zz0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.7EGGonhNemDx0EtgljP4oH10psCH-0BC_4I3laDpov4";  // Your Fyers access token
const logPath ="";  // Optional: Path to save logs (use an empty string for default)

// Initialize the WebSocket for order tracking
const skt = new fyersOrderSocket(appId, accessToken, logPath, true);

// Handle WebSocket connection
skt.on("connect", () => {
    console.log("WebSocket Connected");

    // Subscribe to order updates, trade updates, and position updates
    skt.subscribe([
        skt.orderUpdates,  // Order updates (including BO updates)
        skt.tradeUpdates,   // Trade updates
        skt.positionUpdates  // Position updates
    ]);

    console.log('Subscription successful');
});

// Handle WebSocket closure
skt.on("close", () => {
    console.log("WebSocket Connection Closed");
});

// Handle error events
skt.on("error", (errmsg) => {
    console.error("WebSocket Error:", errmsg);
});

// Monitor order updates
skt.on("orders", (msg) => {
    try {
        if (Array.isArray(msg) && msg.length) {
            msg.forEach(order => {
                if (order) {
                    // console.log(Order ID: ${order.id});
                    // console.log(Status: ${order.status});
                    // console.log(Symbol: ${order.symbol});
                    // console.log(Quantity: ${order.qty});
                    // console.log(Order Type: ${order.order_type});
                    // console.log(Created At: ${order.created_at});

                    // // Additional conditions for Bracket Order (BO)
                    // if (order.order_type === 'BO') {
                    //     if (order.status === 'EXECUTED') {
                    //         console.log(BO Executed: ${order.execution_time});
                    //     } else if (order.status === 'STOP_LOSS_TRIGGERED') {
                    //         console.log(Stop Loss Triggered: ${order.execution_time});
                    //     } else if (order.status === 'TAKE_PROFIT_BOOKED') {
                    //         console.log(Profit Booked: ${order.execution_time});
                    //     }
                    // }
                } else {
                    console.warn("Received an invalid order object:", order);
                }
            });
        } else {
            console.warn("Received an invalid message format for orders:", msg);
        }
    } catch (error) {
        console.error("Error processing orders message:", error);
    }
});

// Monitor trade updates
skt.on("trades", (msg) => {
    try {
        console.log("Trade Update Received:", msg);
        if (!Array.isArray(msg)) {
            console.warn("Received an invalid message format for trades:", msg);
        }
    } catch (error) {
        console.error("Error processing trades message:", error);
    }
});

// Monitor position updates
skt.on("positions", (msg) => {
    try {
        console.log("Position Update Received:", msg);
        if (!Array.isArray(msg)) {
            console.warn("Received an invalid message format for positions:", msg);
        }
    } catch (error) {
        console.error("Error processing positions message:", error);
    }
});

// Handle other messages
skt.on("message", (message) => {
    console.log("Message:", message);
});

// Close the WebSocket if needed (for example, on process exit)
process.on('SIGINT', () => {
    skt.close();
    process.exit();
});