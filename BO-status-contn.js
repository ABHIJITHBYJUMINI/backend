export async function updateOrderStatus(fyers, orderInformation) {
    const { parentOrder, stopOrder, profitOrder } = orderInformation;

    // Set up an interval to update and print order status every 5 seconds
    const intervalId = setInterval(async () => {
        try {
            // Fetch all orders
            const ordersResponse = await fyers.get_orders();
            
            // Function to find order status by order ID
            const findOrderStatus = (orderId) => {
                const order = (ordersResponse.orderBook).find(order => order.id.includes(orderId));
                return order ? order.status : undefined; // Return status if found, otherwise undefined
            };

            // Update parent order status
            if (parentOrder.orderId) {
                parentOrder.status = findOrderStatus(parentOrder.orderId);
            }

            // Update stop order status
            if (stopOrder.orderId) {
                stopOrder.status = findOrderStatus(stopOrder.orderId);
            }

            // Update profit order status
            if (profitOrder.orderId) {
                profitOrder.status = findOrderStatus(profitOrder.orderId);
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
                return {OrderType: 'stopOrder', Price:stopOrder.tradedPrice, Time : stopOrder.orderDateTime.split(' ')[1], Profit: Math.round(parentOrder.tradedPrice - stopLossOrder.tradedPrice) };

            } else if(profitOrder.status === 2){
                clearInterval(intervalId);
                console.log("Profit trade completed, stopping updates.");
                return {OrderType: 'profitOrder', Price:profitOrder.tradedPrice, Time : profitOrder.orderDateTime.split(' ')[1], Profit: Math.round(stopLossOrder.tradedPrice - parentOrder.tradedPrice) };
            }

        } catch (error) {
            console.error("Error updating order status:", error);
            clearInterval(intervalId); // Clear interval on error
        }
    }, 5000); // Check every 5 seconds

    // Return initial order information immediately
    return orderInformation;
}
