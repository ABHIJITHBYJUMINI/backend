// createFyersObj.js
import { fyersModel } from "fyers-api-v3";

export async function createfyersobj(appid, secret, authcode) {
    var fyers = new fyersModel({ "logs": "path where you want to save logs", "enableLogging": true });
    fyers.setAppId(appid);
    var accesstoken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJhcGkuZnllcnMuaW4iLCJpYXQiOjE3Mjc5Mzg3ODgsImV4cCI6MTcyODAwMTg0OCwibmJmIjoxNzI3OTM4Nzg4LCJhdWQiOlsieDowIiwieDoxIiwieDoyIiwiZDoxIiwiZDoyIiwieDoxIiwieDowIl0sInN1YiI6ImFjY2Vzc190b2tlbiIsImF0X2hhc2giOiJnQUFBQUFCbV9rRGt0dkY2RjVCMHlwck5uOUhVVGR4d19YTENObzFwazU0QkIya3lpMkpVTjJHVGx2R0N4Tnl1N3NOT0hYT0FNVVZJVVhHV2ZWOG9zTW1wUU9WSjYzX3lPZVU1dmcwN2E4RGVIOWFRU21HYTBkMD0iLCJkaXNwbGF5X25hbWUiOiJBQkhJSklUSCBCWUpVIE1JTkkiLCJvbXMiOiJLMSIsImhzbV9rZXkiOiJmMTg2YjdkYzZjYzJkYmZiYmIzMjU2YTJhMGZlYjY1OGU3OWViMjYwYjhmM2UzOGViNjE1ZTUwNiIsImZ5X2lkIjoiWUEyMzIxMSIsImFwcFR5cGUiOjEwMCwicG9hX2ZsYWciOiJOIn0.w7oH2OVyKUIZn7NX6fj9xcIXQcXxeSq1FxsXaEbKZ9g";
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
