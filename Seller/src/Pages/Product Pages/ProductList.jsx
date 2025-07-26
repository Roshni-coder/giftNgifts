// ✅ Cleaned & Complete ProductList.jsx with full Edit/Delete integration
import React, { useEffect, useState } from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import { LuTrash2 } from "react-icons/lu";
import { Button, TextField, IconButton } from "@mui/material";
import { MdOutlineEdit, MdClose, MdSaveAlt } from "react-icons/md";
import SearchBox from "../../Components/SearchBox/SearchBox";
import Progress from "../../Components/Progress/Progress";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [updatetask, setUpdatetask] = useState({});
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newImageFile, setNewImageFile] = useState(null);
  const stoken = localStorage.getItem("stoken") || "";
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
   useEffect(() => {
  if (!searchTerm) {
    setFilteredProducts(products);
  } else {
    const lower = searchTerm.toLowerCase();
    const filtered = products.filter((product) =>
      product.title.toLowerCase().includes(lower) ||
      getCategoryNameById(product.categoryname).toLowerCase().includes(lower) ||
      getSubCategoryNameById(product.subcategory).toLowerCase().includes(lower) ||
      (product.sellerId?.name?.toLowerCase().includes(lower) || false)
    );
    setFilteredProducts(filtered);
  }
}, [searchTerm, products]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/product/getproducts`, { headers: { stoken } });
      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getcategories`);
    setCategories(res.data);
  };

  const fetchSubcategories = async () => {
    const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/getsubcategories`);
    setSubcategories(res.data);
  };

  const getCategoryNameById = (id) => categories.find(c => c._id === id)?.categoryname || "-";
  const getSubCategoryNameById = (id) => subcategories.find(s => s._id === id)?.subcategory || "-";

  const handleEditClick = (product) => {
    setEditingId(product._id);
    setUpdatetask({
      [product._id]: { title: product.title, price: product.price, oldprice: product.oldprice },
    });
  };

  const handleupdate = (id, value, field) => {
    setUpdatetask((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleImageChange = (e) => setNewImageFile(e.target.files[0]);

  const update = async (id) => {
    const updateData = updatetask[id] || {};
    try {
      if (newImageFile) {
        const formData = new FormData();
        formData.append("image", newImageFile);
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/product/updateimage/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/product/updateproduct/${id}`, updateData);
      fetchProducts();
      setEditingId(null);
      setUpdatetask({});
      setNewImageFile(null);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const removeproduct = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/product/deleteproduct/${id}`);
      setProducts(products.filter((p) => p._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div className="products bg-white shadow-md py-4 rounded-md px-4">
      <h2 className="text-xl md:text-2xl font-semibold py-2 sm:text-left text-center">Product List</h2>

       <div className="py-2">
        <div className="w-full ">
          <SearchBox
  value={searchTerm}
  onChange={setSearchTerm}
  placeholder="Search Products..."
/>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-800">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Subcategory</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5"><Progress /></td></tr>
            ) : filteredProducts.map((product) => {
              const isEditing = editingId === product._id;
              const updateData = updatetask[product._id] || {};
              return (
                <tr key={product._id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-12">
                        <img src={product.images[0]?.url} alt="Product" className="w-full h-full object-cover rounded" />
                        {isEditing && <input type="file" onChange={handleImageChange} className="opacity-0 absolute inset-0" />}
                      </div>
                      {isEditing ? (
                        <TextField size="small" value={updateData.title} onChange={(e) => handleupdate(product._id, e.target.value, "title")} />
                      ) : (
                        <p className="font-medium text-gray-800">{product.title}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">{getCategoryNameById(product.categoryname)}</td>
                  <td className="px-4 py-3">{getSubCategoryNameById(product.subcategory)}</td>
                  <td className="px-4 py-3">₹{product.price} <span className="text-sm text-gray-400 line-through">₹{product.oldprice}</span></td>
                  <td className="px-4 py-3">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <IconButton onClick={() => update(product._id)}><MdSaveAlt /></IconButton>
                        <IconButton onClick={() => setEditingId(null)}><MdClose /></IconButton>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <IconButton onClick={() => handleEditClick(product)}><MdOutlineEdit /></IconButton>
                        <IconButton onClick={() => removeproduct(product._id)}><LuTrash2 /></IconButton>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductList;