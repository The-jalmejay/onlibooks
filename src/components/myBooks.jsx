import React, { useEffect, useState } from "react";
import http from "./httpService";
import "./css/myBooks.css";
import authservice from "./authservice";
const MyBookds = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      let us = authservice.getUser();
      const res = await http.get(`/cart?user=${us}`);
      setCartItems(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      let us = authservice.getUser();
      await http.post(`/cart`, { user: us, bookId, quantity: -1 });
      fetchCart(); // refresh cart after update
    } catch (err) {
      console.error("Error updating cart:", err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);
  const handlebuy = () => {
    alert("successful!")
    // navigator("/")
  };
  return (
    <div className="container py-4 mybooks-top">
      <h2 className="text-center text-warning mb-4 border-bottom pb-2">
        My Cart List
      </h2>
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : cartItems.length === 0 ? (
        <p className="text-center text-muted">No items in cart.</p>
      ) : (
        <>
          {" "}
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3 justify-content-center">
            {cartItems.map((item) => (
              <div className="col" key={item.bookId}>
                <div
                  className="card h-100 shadow-sm"
                  style={{ fontSize: "0.9rem" }}
                >
                  <img
                    src={item.thumbnail}
                    className="card-img-top"
                    alt={item.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div
                    className="card-body bg-success text-white py-2 px-3"
                    style={{ minHeight: "auto" }}
                  >
                    <h6 className="card-title mb-1">{item.title}</h6>
                    <p className="card-text mb-1">{item.authors?.join(", ")}</p>
                    <p className="card-text mb-2">Qty: {item.quantity}</p>
                    <button
                      className="btn btn-dark btn-sm w-100"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      Remove from Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}{" "}
          </div>
          <div className="d-flex justify-content-end mt-4">
            <button className="but px-4" onclick={()=>handlebuy()}>
              Buy Now
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyBookds;
