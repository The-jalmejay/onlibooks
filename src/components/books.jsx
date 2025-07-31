import React, { useEffect, useState } from "react";
import {  useNavigate, useLocation } from "react-router-dom";
import http from "./httpService";
import LeftOptionPanel from "./leftOptionPanel";
import "./css/books.css";
import Loader from "./loader";
import authservice from "./authservice";
function useQuery() {
  return new URLSearchParams(useLocation().search);
}
const defaultParams = {
  q: "Harry Potter",
  langRestrict: "en",
  startIndex: 0,
  maxResults: options.maxResults || 8,
};
const Books = (props) => {
  const [data, setData] = useState({});
  const [mybook, setmybook] = useState([]);
  const location = useLocation();
  const [removingBookId, setRemovingBookId] = useState(null);
  const query = useQuery();
  const q = query.get("q") || "";
  const searchParams = new URLSearchParams(location.search);
  const navigate = useNavigate();
  const [checkOption, setCheckOption] = useState({});
  const [options, setOptions] = useState({});
  const [loading, setLoading] = useState(false);
  const startIndex = +(searchParams.get("startIndex") || 0);

  // Fetch Options from  API
  useEffect(() => {
    fetchOptions();
  }, [location.search]);

  const fetchOptions = async () => {
    try {
      const response = await http.get(`/options`);
      setOptions(response.data);
      setCheckOption(response.data);
    } catch (error) {
      console.error("Error fetching Options:", error);
    }
  };
  

  // Build default query string from defaultParams
  useEffect(() => {
    if (!q) {
      const params = new URLSearchParams(defaultParams).toString();
      navigate(`${location.pathname}?${params}`, { replace: true });
    }
  }, [q, navigate, location.pathname]);

  useEffect(() => {
    fetchOPtion();
  }, [defaultParams]);

  const fetchOPtion = async () => {
    try {
      const response = await http.get("/options");
      const fetched = response.data || {};

      // Ensure max is a valid number
      const max = parseInt(fetched.max);
      setOptions({ ...fetched, max: isNaN(max) ? 8 : max }); // fallback to 8
    } catch (err) {
      console.log("Error fetching Options", err);
    }
  };

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const params = new URLSearchParams(location.search);
        if (!params.has("maxResults") && options.maxResults) {
          params.set("maxResults", options.maxResults);
        } else if (!params.has("maxResults")) {
          params.set("maxResults", 8); // fallback
        }

        console.log(options.maxResults);
        const query = params.toString();
        const response = await http.get(`/books?${query}`);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [location.search, options.maxResults]);

  const handlePageChange = (incr) => {
    console.log(incr, typeof incr);
    const searchParams = new URLSearchParams(location.search); // fresh params
    const currentIndex = +(searchParams.get("startIndex") || 0);
    const newStart = currentIndex + incr;
    callURL("/books", {
      ...Object.fromEntries(searchParams.entries()),
      startIndex: newStart,
    });
  };

  const handleonOptionChange = (options) => {
    options.startIndex = 0;
    options.maxResults = options.maxResults||8;
    callURL("/books", options);
  };
  const callURL = (url, options) => {
    const searchString = makeSearchString(options);
    navigate(`${url}?${searchString}`);
  };
  const makeSearchString = (options) => {
    const params = new URLSearchParams();
    for (const key in options) {
      if (options[key] !== undefined && options[key] !== null) {
        params.append(key, options[key]);
      }
    }
    if (!params.has("maxResults")) {
      params.set("maxResults", options.maxResults || 8);
    }
    return params.toString();
  };

  const HandleaddToMyBook = async (book) => {
    console.log("book", book);
    try {
      const { id, volumeInfo } = book;
      const cartItem = {
        bookId: id,
        title: volumeInfo.title || "Untitled",
        authors: volumeInfo.authors || [],
        thumbnail: volumeInfo.imageLinks?.smallThumbnail || "./imgnot.png",
        quantity: 1,
      };
      let us = authservice.getUser();
      let item = {
        user: us,
        ...cartItem,
      };
      if (!us) {
        alert("Login First");
        navigate("/login");
      } else {
        await http.post("/cart", item); // Add to backend cart
        await fetchCart();
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const fetchCart = async () => {
    try {
      let us = authservice.getUser();
      const res = await http.get(`/cart?user=${us}`);
      setmybook(res.data.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (bookId) => {
    try {
      setRemovingBookId(bookId);
      let us = authservice.getUser();
      await http.post(`/cart`, { user: us, bookId, quantity: -1 });
      await fetchCart();
    } catch (err) {
      console.error("Error updating cart:", err);
    } finally {
      setRemovingBookId(null);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const { items = [] } = data;
  const { maxResults } = options;
  const defaultCheckOption = {
    langRestrict: true,
    filter: true,
    printType: true,
    orderBy: true,
    maxResults: 8
  };
  console.log(loading);
  const user = authservice.getUser();
  return (
    <div className="container py-4 book-top">
      <div className="row">
        {/* Sidebar Panel */}
        <div className="col-md-3 mb-4">
          <LeftOptionPanel
            options={Object.fromEntries(searchParams.entries())}
            checkOption={user ? checkOption : defaultCheckOption}
            onOptionChange={handleonOptionChange}
          />
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          {items.length > 0 ? (
            <div className="text-center mb-3">
              <h3 className="text-primary fw-semibold">
                {items.length > 0 ? `Results for "${q}"` : "No Data Found"}
              </h3>
              {items.length > 0 && (
                <p className="text-muted small">
                  Showing <strong>{startIndex + 1}</strong> to{" "}
                  <strong>{startIndex + items.length}</strong> entries
                </p>
              )}
            </div>
          ) : (
            <div className="text-center mb-3">
              <Loader />
            </div>
          )}

          {/* Book Grid */}
          <div className="row g-4">
            {items.map((e, index) => {
              const thumbnail =
                e.volumeInfo.imageLinks?.smallThumbnail || "./imgnot.png";
              const title = e.volumeInfo.title || "Untitled";
              const authors =
                e.volumeInfo.authors?.join(", ") || "Unknown Author";

              const isAdded = mybook.some((f) => f.bookId === e.id);

              return (
                <div className="col-6 col-md-4 col-lg-3" key={index}>
                  <div className="card h-100 shadow-sm border-0 hover-card custom-bg">
                    <img
                      src={thumbnail ? thumbnail : "./imgnot.png"}
                      className="card-img-top"
                      alt={title}
                      style={{ height: "180px", objectFit: "cover" }}
                    />
                    <div className="card-body d-flex flex-column text-center">
                      <h6 className="card-title fw-bold text-dark">{title}</h6>
                      <p className="card-text text-muted small mb-2">
                        {authors}
                      </p>

                      {isAdded ? (
                        <button
                          className="btn btn-outline-danger btn-sm mt-auto"
                          onClick={() => removeFromCart(e.id)}
                          disabled={removingBookId === e.id}
                        >
                          {removingBookId === e.id
                            ? "Removing..."
                            : "Remove from MyBooks"}
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-primary btn-sm mt-auto"
                          onClick={() => HandleaddToMyBook(e)}
                        >
                          Add to MyBooks
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4">
            {startIndex > 1 && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => handlePageChange(-maxResults)}
              >
                ← Previous
              </button>
            )}
            {checkOption.maxResults <= items.length && (
              <button
                className="btn btn-secondary btn-sm ms-auto"
                onClick={() => handlePageChange(+maxResults)}
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Books;
