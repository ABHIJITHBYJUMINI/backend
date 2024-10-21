export async function getexactrangePrice(fyers, symbolarr) {
    try {
      const response = await fyers.getQuotes(symbolarr);
      for (let i = 0; i < 30; i++) {        
        if (i > 2 && i % 2 == 1) {      //3 PE    
          if (
            response.d[i - 1].v.lp + response.d[i].v.lp > 200 &&
            response.d[i + 1].v.lp + response.d[i + 2].v.lp < 200
          ) {            
            return {
                selectedCESymbol: response.d[i + 3].n,
                selectedCESymbolPrice :response.d[i + 1].v.lp,
                selectedPESymbol: response.d[i].n,
                selectedPESymbolPrice: response.d[i].v.lp
            };
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Bank Nifty spot price:", error);
      throw error;
    }
  }