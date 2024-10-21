var currentWeeklyExpiry = "24O23";
var optionspread = 100;
var indextype = "NSE:BANKNIFTY";
var selectedindex = ["NSE:NIFTYBANK-INDEX"];

var ceSymbol = '';
var peSymbol = '';

export async function spotPrice(fyers) {
    try {
      //Index is banknifty now later will be sensex of nifty
      const response = await fyers.getQuotes(selectedindex);
      const cepesymbolarr = [];
      const indexspot = response.d[0].v.lp;
      //console.log('GETCQUOTES', response.d[0].v.lp);
      if (response.s && response.d.length > 0) {
        for (let i = 0; i < 25; i++) {
          ceSymbol = `${indextype}${currentWeeklyExpiry}${
            Math.round(indexspot - (indexspot % optionspread))  + 100 * i
          }CE`; //- 300
          cepesymbolarr.push(ceSymbol);
          peSymbol = `NSE:BANKNIFTY${currentWeeklyExpiry}${Math.round(
            indexspot - (indexspot % 100)  - 100 * i
          )}PE`;//+ 200
          cepesymbolarr.push(peSymbol);
        }

        return cepesymbolarr; // Last traded price
      } else {
        throw new Error("Could not fetch Bank Nifty spot price.");
      }
    } catch (error) {
      console.error("Error fetching Bank Nifty spot price:", error);
      throw error;
    }
  }