export async function updateOrderStatus(fyers, orderInformation) {
    let { parentOrder, stopOrder, profitOrder } = orderInformation;
    const intervalId = setInterval(async () => {
        try {
            const findOrderStatus = (orderId) => {
                fyers.get_orders().then(order=>{ 
                    console.log('Tradebook', order);
                    const myorder = (order.orderBook).find(searchorder => searchorder.id === orderId);
                    return myorder ? myorder.status : undefined; // Return status if found, otherwise undefined
                });
             };
             const allorders = await fyers.get_orders();
             const profitorderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-3');
             const stoporderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-2');
             console.log('Profit:', profitorderiffound.status, '/ Stop :', stoporderiffound.status);
             if(profitorderiffound.status == 2){
                clearInterval(intervalId);
                console.log("Profit trade completed, END for day.");
                return { OrderType: 'profitOrder', Price: 100, Profit: Math.round(100) };
             }
             //const stoptradestatus = findOrderStatus(stopOrder.orderId);
             if(stoporderiffound.status == 2){
                clearInterval(intervalId);
                console.log("Stop trade completed, Try Again.");
                return { OrderType: 'stopOrder', Price: 100, Profit: Math.round(100) };
             }
        } catch (error) {
            console.error("Error updating order status:", error);
            clearInterval(intervalId); // Clear interval on error
        }
    }, 2500);
    return orderInformation;
}
