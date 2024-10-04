export async function updateSingleOrderStatus(fyers, orderInformation) {
    let { parentOrder, stopOrder, profitOrder } = orderInformation;
    console.log(orderInformation);
    try {
        // Fetch all orders
        const ordersResponsestop = await fyers.get_filtered_orders(stopOrder.orderId);
        console.log(ordersResponsestop);

        const ordersResponseprofit = await fyers.get_filtered_orders(profitOrder.orderId);
        console.log(ordersResponseprofit);

        // Function to find order status by order ID

        const findOrderStatus = (orderId) => {
            const order = (ordersResponse.orderBook).find(order => order.id === orderId);
            return order ? order.status : undefined; // Return status if found, otherwise undefined
        };

        // Update parent order status
        if (parentOrder.orderId) {
            console.log('parentOrder.orderId', parentOrder.orderId)
;            //parentOrder.status = findOrderStatus(parentOrder.orderId);
        }

        // Update stop order status
        if (stopOrder.orderId !== undefined ) {
            stopOrder = findOrderStatus(stopOrder.orderId);
        }

        // Update profit order status
        if (profitOrder.orderId !== undefined) {
            profitOrder = findOrderStatus(profitOrder.orderId);
        }

        // Return updated order information
        return {
            parentOrder,
            stopOrder,
            profitOrder,
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
    }
}


