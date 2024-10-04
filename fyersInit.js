// createFyersObj.js
import { fyersModel } from "fyers-api-v3";

export async function createfyersobj(appid, secret, authcode) {
    var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": true });
    fyers.setAppId(appid);
    var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3MjgwMTMzNTYsImV4cCI6MTcyODA4ODIzNiwibmJmIjoxNzI4MDEzMzU2LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbV8yUXNyeURLRkJZTzdObUJSTEZEQXdNaEVmMzhQWk1ORGRWdUFBNk55ZWc4d2d1NXgwM2NWajIwbmJ4Tk8wN2xfa2JTYXpJNFp3RnZqOXU4OFB5bndfQjQwNzYxOW5aYkZzdTFYUUdfWTBLN08xMD0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.HJArZd8uCpE6cbLSAUU-L8GIXiuqzbz3qzo63d4LKRQ";
    // await fyers.generate_access_token({ "client_id": appid, "secret_key": secret, "auth_code": authcode }).then((response) => {
    //     if (response.s == 'ok') {
    //         fyers.setAccessToken(response.access_token);
    //         console.log(response.access_token);
    //     } else {
    //         console.log("error generating access token", response)
    //     }
    // })
    fyers.setAccessToken(accesstoken);
    return fyers;
}
