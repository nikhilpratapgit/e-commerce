import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get("/orders");

            console.log("ORDERS RESPONSE:", response.data);

            setOrders(response.data.orders || []);
        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to fetch orders"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    if (loading) {
        return <h2>Loading orders...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>My Orders</h1>

            {orders.length === 0 ? (
                <div>
                    <p>You have no orders yet.</p>

                    <Link to="/products">
                        Start Shopping
                    </Link>
                </div>
            ) : (
                <div>
                    {orders.map((order) => (
                        <div key={order.id}>
                            <h2>
                                Order #{order.orderNumber}
                            </h2>

                            <p>
                                Status: {order.status}
                            </p>

                            <p>
                                Total: ₹{order.totalAmount}
                            </p>
                            <Link to={`/orders/${order.id}`}>
                                View Details
                            </Link>
                            <p>
                                Ordered on:{" "}
                                {new Date(
                                    order.createdAt
                                ).toLocaleDateString()}
                            </p>

                            <h3>Items</h3>

                            {order.items?.map((item) => (
                                <div key={item.id}>
                                    <p>
                                        Product:{" "}
                                        {item.product?.name || "Product"}
                                    </p>

                                    <p>
                                        Quantity: {item.quantity}
                                    </p>

                                    <p>
                                        Price: ₹{item.price}
                                    </p>

                                    <p>
                                        Subtotal: ₹
                                        {item.price * item.quantity}
                                    </p>
                                </div>
                            ))}

                            <h3>Shipping Address</h3>

                            {order.shippingAddress && (
                                <>
                                    <p>
                                        {order.shippingAddress.fullName}
                                    </p>

                                    <p>
                                        {order.shippingAddress.phone}
                                    </p>

                                    <p>
                                        {order.shippingAddress.address}
                                    </p>

                                    <p>
                                        {order.shippingAddress.city},{" "}
                                        {order.shippingAddress.state}
                                    </p>

                                    <p>
                                        {order.shippingAddress.pincode},{" "}
                                        {order.shippingAddress.country}
                                    </p>
                                </>
                            )}

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Orders;