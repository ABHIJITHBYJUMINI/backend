export async function updateOrderStatusOneTime(fyers, orderInformation) {
    const { parentOrder, stopOrder, profitOrder } = orderInformation;
    console.log(orderInformation);
    try {
        // Fetch all orders
        const ordersResponse = await fyers.get_orders();
        console.log(ordersResponse.orderBook);
        // Function to find order status by order ID
        const findOrderStatus = (orderId) => {
            const order = (ordersResponse.orderBook).find(order => order.id.includes(orderId));
            return order ? order.status : undefined; // Return status if found, otherwise undefined
        };

        // Update parent order status
        if (parentOrder.orderId) {
            console.log('parentOrder.orderId', parentOrder.orderId)
;            parentOrder.status = findOrderStatus(parentOrder.orderId);
        }

        // Update stop order status
        if (stopOrder.orderId !== undefined ) {
            stopOrder.status = findOrderStatus(stopOrder.orderId);
        }

        // Update profit order status
        if (profitOrder.orderId !== undefined) {
            profitOrder.status = findOrderStatus(profitOrder.orderId);
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


