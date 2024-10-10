
var saveParentTime = '';

export async function updateOrderStatus(fyers, orderInformation) {
    let { parentOrder, stopOrder, profitOrder } = orderInformation;
    //console.log(orderInformation,  parentOrder, stopOrder, profitOrder)
    // Set up an interval to update and print order status every 5 seconds
    
    // function extractTimeFromVariable2(variable2) {
    //     const timePart = variable2.split(' ')[1]; // Extracts '12:03:40'
    //     const [hours, minutes] = timePart.split(':'); // Get '12' and '03'
        
    //     // Combine hours and minutes in HR:MIN format
    //     return `${hours}:${minutes}`;
    // }


    // function compareTimes(variable1, variable2) {
    //     // Convert both time strings to Date objects
    //     const currentDate = new Date(); // Use current date for the comparison baseline
        
    //     const time1 = new Date(`${currentDate.toDateString()} ${variable1}:00`); // variable1 in HH:MM
    //     const time2 = new Date(`${currentDate.toDateString()} ${extractTimeFromVariable2(variable2)}:00`); // variable2 time in HH:MM
        
    //     // Compare the two times
    //     if (time2 > time1) {
    //         console.log("Variable 2 time is greater than Variable 1 time.");
    //         return true;
    //     } else {
    //         console.log("Variable 2 time is not greater than Variable 1 time.");
    //         return false;
    //     }
    // }
    
    const intervalId = setInterval(async () => {
        try {
            // Fetch all orders
            //const ordersResponse = await fyers.get_orders();
            //console.clear();
            //console.log("received in contn", ordersResponse);
            // Function to find order status by order ID



            
            const findOrderStatus = (orderId) => {
                fyers.get_orders().then(order=>{ 
                    console.log('Tradebook', order);
                    const myorder = (order.orderBook).find(searchorder => searchorder.id === orderId);
                    return myorder ? myorder.status : undefined; // Return status if found, otherwise undefined
                    //console.log('from orderbook', order.orderBook);
                    
                //console.log("inside", order, myorder , "next", myorder ? myorder.status : undefined);
                //return myorder ? myorder.status : undefined; // Return status if found, otherwise undefined

                })
                // const order = (ordersResponse.orderBook).find(order => order.id === orderId);
                // console.log("inside", order, orderId );
                // return order ? order.status : undefined; // Return status if found, otherwise undefined
             };

             const allorders = await fyers.get_orders();
             const profitorderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-3');
             const stoporderiffound = (allorders.orderBook).find(searchorder => searchorder.parentId === parentOrder.orderId && (searchorder.id).slice(-5) === '-BO-2');
             console.log('profit', profitorderiffound.status, 'stop', stoporderiffound.status);


             //const profittradestatus = findOrderStatus(profitOrder.orderId);
             if(profitorderiffound.status == 2){
                clearInterval(intervalId);
                console.log("Profit trade completed, stopping updates.");
                return { OrderType: 'profitOrder', Price: 100, Profit: Math.round(100) };
             }
             //const stoptradestatus = findOrderStatus(stopOrder.orderId);
             if(stoporderiffound.status ==2){
                clearInterval(intervalId);
                console.log("Stop trade completed, stopping updates.");
                return { OrderType: 'stopOrder', Price: 100, Profit: Math.round(100) };
             }
            // Update parent order status
            // if (parentOrder.orderId) {
            //     parentOrder.status = findOrderStatus(parentOrder.orderId);
            // }

            // // Update stop order status
            // if (stopOrder.orderId) {
            //     if(findOrderStatus(stopOrder.orderId) !== undefined){                    
            //         stopOrder.status = findOrderStatus(stopOrder.orderId);
            //         console.log('stoporder info', stopOrder)
            //     }
            // }

            // // // Update profit order status
            // if (profitOrder.orderId) {
            //     if(findOrderStatus(profitOrder.orderId) !== undefined){
            //         profitOrder.status = findOrderStatus(profitOrder.orderId);
            //         console.log('profitOrder info', profitOrder)
            //     }
            // }
            // Log updated order information
            // console.log("Updated Order Information:", JSON.stringify({
            //     parentOrder,
            //     stopOrder,
            //     profitOrder,
            // }, null, 2)); // Print the order status with indentation

            // Clear the interval if the parent order status is completed
            // if (stopOrder.status === 2) {
            //     clearInterval(intervalId);
            //     console.log("Stop trade completed, stopping updates.");
            //     return { OrderType: 'stopOrder', Price: stopOrder.tradedPrice, Time: stopOrder.orderDateTime.split(' ')[1], Profit: Math.round(parentOrder.tradedPrice - stopLossOrder.tradedPrice) };

            // } else if (profitOrder.status === 2) {
            //     clearInterval(intervalId);
            //     console.log("Profit trade completed, stopping updates.");
            //     return { OrderType: 'profitOrder', Price: profitOrder.tradedPrice, Time: profitOrder.orderDateTime.split(' ')[1], Profit: Math.round(stopLossOrder.tradedPrice - parentOrder.tradedPrice) };
            // }

        } catch (error) {
            console.error("Error updating order status:", error);
            clearInterval(intervalId); // Clear interval on error
        }
    }, 5000); // Check every 5 seconds

    // Return initial order information immediately
    return orderInformation;
}
