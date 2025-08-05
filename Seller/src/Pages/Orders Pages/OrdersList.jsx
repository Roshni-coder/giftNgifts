import React, { useEffect, useState } from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";

function OrdersList() {
  const [isOpenOrderdProduct, setOpenOrderdProduct] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const stoken = localStorage.getItem("stoken");

  const toggleOrderDetails = (index) => {
    setOpenOrderdProduct(isOpenOrderdProduct === index ? null : index);
  };

  const getOrders = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/orders`,
        { headers: { stoken } }
      );

      if (data.success) {
        setOrders(data.filteredOrders || []);
        setError(null);
      } else {
        setOrders([]);
        setError(data.message || "Failed to fetch orders.");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/seller/orders/${orderId}`,
        { status: newStatus },
        { headers: { stoken } }
      );

      if (data.success) {
        toast.success("Order status updated successfully!");
        // Update status in local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <div className="p-4 text-gray-600">Loading orders...</div>;
  }

  if (error || orders.length === 0) {
    return <div className="p-4 text-red-500">{error || "No orders found."}</div>;
  }

  return (
    <div className="orders my-2 bg-white rounded-xl p-6 shadow-lg">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-[24px] font-semibold text-gray-800 py-2">📦 Recent Orders</h2>
      </div>

      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table className="min-w-[1000px] w-full text-sm text-gray-700 border-collapse">
          <thead className="bg-gray-100 text-gray-700 sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4"></th>
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4">Phone</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4">Pincode</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <React.Fragment key={order._id}>
                <tr className="bg-white hover:bg-gray-50 transition text-center border-b">
                  <td className="py-4 px-4">
                    <button onClick={() => toggleOrderDetails(index)}>
                      {isOpenOrderdProduct === index ? (
                        <FaAngleUp className="text-gray-600" />
                      ) : (
                        <FaAngleDown className="text-gray-600" />
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-left">{order._id}</td>
                  <td className="py-3 px-4 text-left">{order.shippingAddress?.name}</td>
                  <td className="py-3 px-4">{order.shippingAddress?.phone}</td>
                  <td className="py-3 px-4 text-left truncate max-w-[250px]">
                    {order.shippingAddress?.address}
                  </td>
                  <td className="py-3 px-4">{order.shippingAddress?.pin}</td>
                  <td className="py-3 px-4 font-semibold text-green-700">
                    ₹{order.totalAmount}
                  </td>
                  <td className="py-3 px-4">{order.user?.name || "-"}</td>
                  <td className="py-3 px-4">{order.paymentId || "-"}</td>
                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                      className="border rounded-md px-2 py-1 text-sm focus:outline-none"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    {new Date(order.placedAt).toLocaleDateString()}
                  </td>
                </tr>

                {isOpenOrderdProduct === index && (
                  <tr>
                    <td colSpan="11" className="bg-gray-50 px-6 py-4">
                      <div className="border rounded-md overflow-x-auto">
                        <table className="w-full text-sm text-gray-700">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="py-2 px-4 text-left">Product ID</th>
                              <th className="py-2 px-4">Image</th>
                              <th className="py-2 px-4 text-left">Product</th>
                              <th className="py-2 px-4">Price</th>
                              <th className="py-2 px-4">Qty</th>
                              <th className="py-2 px-4">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody>
                            {order.items.map((item) => (
                              <tr key={item._id} className="text-center border-t">
                                <td className="py-2 px-4 text-left">
                                  {item.productId?._id || item.productId}
                                </td>
                                <td className="py-2 px-4">
                                  {item.productId?.images?.[0]?.url ? (
                                    <img
                                      src={item.productId.images[0].url}
                                      alt="Product"
                                      className="w-10 h-10 object-cover mx-auto rounded-md"
                                    />
                                  ) : (
                                    "-"
                                  )}
                                </td>
                                <td className="py-2 px-4 text-left">
                                  {item.productId?.title || "-"}
                                </td>
                                <td className="py-2 px-4">₹{item.price}</td>
                                <td className="py-2 px-4">{item.quantity}</td>
                                <td className="py-2 px-4 font-medium">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrdersList;
