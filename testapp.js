var fyersModel = require("fyers-api-v3").fyersModel;
let DataSocket = require("fyers-api-v3").fyersDataSocket;
const FyersOrderSocket = require("fyers-api-v3").fyersOrderSocket

var fyersOrderdata=new FyersOrderSocket("XBDVKT3M7D-100")



var fyers = new fyersModel({
  logs: "path where you want to save logs",
  enableLogging: false,
});

fyers.setAppId("XBDVKT3M7D-100");

var accesstoken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjgyNzMxNTgsImV4cCI6MTcyODM0NzQzOCwibmJmIjoxNzI4MjczMTU4LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbkExc0djbnlUNFIyZzd3MUFMbmJFeEctM1NtRENhTzlmQlYtVldhZjJBX3JydWhhc25yMmIzckZuX2UxejVwOW56RkpHcnVqSHBualVtM0pXVjRpZkVPT3Z6Uk10U3dwQWs0Tm13TmxYUUc0TWt5Zz0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.7EGGonhNemDx0EtgljP4oH10psCH-0BC_4I3laDpov4";
fyers.setAccessToken(accesstoken);
//const dataSocket = DataSocket.getInstance(accesstoken);
let bankniftysymbol ='NSE:BANKNIFTY24O0152900PE';
let acceptedprofit = 0.10;
    
// Fetch Bank Nifty spot price
async function getBankNiftyOptionPrice(symbol) {
    try {
      const response = await fyers.getQuotes([symbol]);
      if (response.s && response.d.length > 0) {
        return Math.round(response.d[0].v.lp); // Last traded price
      } else {
        throw new Error("Could not fetch Bank Nifty spot price.");
      }
    } catch (error) {
      console.error("Error fetching Bank Nifty spot price:", error);
      throw error;
    }
  }
  getBankNiftyOptionPrice(bankniftysymbol).then(res =>{
    console.log(res, res + 0.5, res * acceptedprofit  );
    let orderid=0;
    const reqBody = {
        symbol: bankniftysymbol,
        qty: 15,
        type: 1,
        side: 1,
        productType: "BO",
        limitPrice: Math.round(res + 0.5),
        stopPrice: 0,
        validity: "DAY",
        stopLoss: Math.round(res * 0.1),
        takeProfit: Math.round(res * acceptedprofit),
        offlineOrder: false,
        disclosedQty: 0
      };
      fyers.place_order(reqBody)
        .then((response) =>{
           // console.log(response);
            orderid = response.id;
    // Periodically check order status (e.g., every 5 seconds)
    setInterval(() => {
        checkOrderStatus(orderid).then(orderres=>{
            switch(orderres){
                case 'COMPLETED':
                    break;
                case 'PENDING':
                    break;

            }
        });
    }, 5000);  // Check every 5 seconds

        })
        .catch((error) => console.log(error));
    

})

async function checkOrderStatus(orderId) {
    try {
        const response = await fyers(orderId);
        console.log("Order Status:", response);
        return response;
    } catch (error) {
        console.error('Error fetching order status:', error);
    }
}

fyersOrderdata.on("error",function (errmsg) {
    console.log(errmsg)
})

fyersOrderdata.on('connect',function () {
    fyersOrderdata.subscribe([fyersOrderdata.orderUpdates])
})

fyersOrderdata.on('close',function () {
    console.log('closed')
})

//for ticks of orderupdates
fyersOrderdata.on('orders',function (msg) {
    console.log("orders",msg)
})

fyersOrderdata.autoreconnect()
fyersOrderdata.connect()