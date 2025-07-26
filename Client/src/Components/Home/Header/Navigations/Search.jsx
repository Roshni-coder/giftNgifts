import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import { IoSearchSharp } from "react-icons/io5";
import { SearchResultlist } from "./SearchResultlist";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [input, setInput] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const wrapperRef = useRef(null);
  const navigate = useNavigate();

  // Fetch product list
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/client/search`);
        setProducts(res.data.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchData();
  }, []);

  // Handle click outside dropdown to close results
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowResult(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (value.trim() === "") {
      setFilteredProducts([]);
      setShowResult(false);
      return;
    }

    const searchTerm = value.toLowerCase();

    const filtered = products.filter((product) => {
      const title = product.title?.toLowerCase() || "";
      const category = product.categoryname?.name?.toLowerCase() || "";
      const subcategory = product.subcategory?.name?.toLowerCase() || "";

      return (
        title.includes(searchTerm) ||
        category.includes(searchTerm) ||
        subcategory.includes(searchTerm)
      );
    });

    setFilteredProducts(filtered);
    setShowResult(true);
  };

  const handleSelect = (product) => {
    setInput(""); // Clear input
    setShowResult(false);
    navigate(`/products/${product._id}`);
  };

  const handleSearchClick = () => {
    if (!input.trim()) return;

    const searchTerm = input.toLowerCase().trim();
    navigate(`/search-results?query=${encodeURIComponent(searchTerm)}`);

    setInput(""); // Clear input after navigating
    setShowResult(false);
  };

  return (
    <div
      className="searchBox !w-full bg-[#e5e5e5] rounded-[5px] relative p-2"
      ref={wrapperRef}
    >
      <input
        type="text"
        placeholder="Search by title, category, or subcategory..."
        className="w-full h-[20px] bg-transparent focus:outline-none p-2 text-[15px]"
        value={input}
        onFocus={() => {
          if (filteredProducts.length > 0) setShowResult(true);
        }}
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSearchClick();
          }
        }}
      />

      <Button
        onClick={handleSearchClick}
        className="!absolute top-[4px] right-[5px] z-50 !w-[37px] !min-w-[35px] h-[35px] !rounded-full !text-black"
      >
        <IoSearchSharp className="text-[#4e4e4e] text-[20px]" />
      </Button>

      {showResult && filteredProducts.length > 0 && (
        <SearchResultlist results={filteredProducts} onSelect={handleSelect} />
      )}
    </div>
  );
};

export default Search;
