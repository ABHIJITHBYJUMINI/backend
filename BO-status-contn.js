export async function updateOrderStatus(fyers, orderInformation) {
    let { parentOrder, stopOrder, profitOrder } = orderInformation;
    console.log(orderInformation,  parentOrder, stopOrder, profitOrder)
    // Set up an interval to update and print order status every 5 seconds
    const intervalId = setInterval(async () => {
        try {
            // Fetch all orders
            //const ordersResponse = await fyers.get_orders();
            //console.clear();
            //console.log("received in contn", ordersResponse);
            // Function to find order status by order ID
            const findOrderStatus = (orderId) => {
                fyers.get_filtered_orders({order_id: orderId      
                }).then(order=>{
                    console.log('from orderbook', order.orderBook);
                     const myorder = (order.orderBook).find(searchorder => searchorder.id === orderId);
                console.log("inside", order, myorder );
                return myorder ? myorder.status : undefined; // Return status if found, otherwise undefined

                })
                // const order = (ordersResponse.orderBook).find(order => order.id === orderId);
                // console.log("inside", order, orderId );
                // return order ? order.status : undefined; // Return status if found, otherwise undefined
            };

            // Update parent order status
            if (parentOrder.orderId) {
                parentOrder.status = findOrderStatus(parentOrder.orderId);
            }


            // Update stop order status
            if (stopOrder.orderId) {
                if(findOrderStatus(stopOrder.orderId) !== undefined){
                    stopOrder.status = findOrderStatus(stopOrder.orderId);
                    console.log('stoporder info', stopOrder)
                }
            }

            // Update profit order status
            if (profitOrder.orderId) {
                if(findOrderStatus(profitOrder.orderId) !== undefined){
                    profitOrder.status = findOrderStatus(profitOrder.orderId);
                    console.log('profitOrder info', profitOrder)
                }
            }
            // Log updated order information
            console.log("Updated Order Information:", JSON.stringify({
                parentOrder,
                stopOrder,
                profitOrder,
            }, null, 2)); // Print the order status with indentation

            // Clear the interval if the parent order status is completed
            if (stopOrder.status === 2) {
                clearInterval(intervalId);
                console.log("Stop trade completed, stopping updates.");
                return { OrderType: 'stopOrder', Price: stopOrder.tradedPrice, Time: stopOrder.orderDateTime.split(' ')[1], Profit: Math.round(parentOrder.tradedPrice - stopLossOrder.tradedPrice) };

            } else if (profitOrder.status === 2) {
                clearInterval(intervalId);
                console.log("Profit trade completed, stopping updates.");
                return { OrderType: 'profitOrder', Price: profitOrder.tradedPrice, Time: profitOrder.orderDateTime.split(' ')[1], Profit: Math.round(stopLossOrder.tradedPrice - parentOrder.tradedPrice) };
            }

        } catch (error) {
            console.error("Error updating order status:", error);
            clearInterval(intervalId); // Clear interval on error
        }
    }, 5000); // Check every 5 seconds

    // Return initial order information immediately
    return orderInformation;
}
