import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState("");

  // Category form
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get("/categories");

      setCategories(response.data.categories || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Category name is required.");
      return;
    }

    try {
      const response = await api.post("/categories", {
        name: categoryName,
        description: categoryDescription,
      });

      const newCategory = response.data.category;

      setCategories((prevCategories) => [
        ...prevCategories,
        newCategory,
      ]);

      setCategoryId(newCategory.id);

      setCategoryName("");
      setCategoryDescription("");

      setShowCategoryForm(false);

      alert("Category added successfully.");
    } catch (error) {
      console.error("Add category error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add category."
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryId) {
      alert("Please select a category.");
      return;
    }

    try {
      await api.post("/products", {
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        categoryId,
        images: image ? [image] : [],
      });

      alert("Product added successfully.");

      navigate("/products");
    } catch (error) {
      console.error("Add product error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to add product."
      );
    }
  };

  return (
    <main className="admin-form-page">

      <div className="admin-form-card">

        {/* Header */}
        <div className="admin-form-header">

          <span className="admin-form-eyebrow">
            ADMIN PANEL
          </span>

          <h1>Add Product</h1>

          <p>
            Add a new product to your store.
          </p>

        </div>

        {/* Product Form */}
        <form
          onSubmit={handleSubmit}
          className="admin-product-form"
        >

          {/* Product Name */}
          <div className="admin-form-group">

            <label htmlFor="product-name">
              Product Name
            </label>

            <input
              id="product-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter product name"
              required
            />

          </div>

          {/* Description */}
          <div className="admin-form-group">

            <label htmlFor="product-description">
              Description
            </label>

            <textarea
              id="product-description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              placeholder="Enter product description"
              rows="5"
              required
            />

          </div>

          {/* Price + Stock */}
          <div className="admin-form-row">

            <div className="admin-form-group">

              <label htmlFor="product-price">
                Price
              </label>

              <input
                id="product-price"
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                placeholder="₹ Enter price"
                min="0"
                required
              />

            </div>

            <div className="admin-form-group">

              <label htmlFor="product-stock">
                Stock
              </label>

              <input
                id="product-stock"
                type="number"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
                placeholder="Enter stock"
                min="0"
                required
              />

            </div>

          </div>

          {/* Category */}
          <div className="admin-form-group">

            <label>
              Category
            </label>

            <div className="admin-category-row">

              <select
                value={categoryId}
                onChange={(e) =>
                  setCategoryId(e.target.value)
                }
                required
              >
                <option value="">
                  Select Category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                className="admin-secondary-button"
                onClick={() =>
                  setShowCategoryForm(!showCategoryForm)
                }
              >
                + Add Category
              </button>

            </div>

          </div>

          {/* Add Category */}
          {showCategoryForm && (
            <div className="admin-category-form">

              <div className="admin-category-form-header">

                <h3>
                  Add New Category
                </h3>

                <button
                  type="button"
                  className="category-close-button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setCategoryName("");
                    setCategoryDescription("");
                  }}
                >
                  ×
                </button>

              </div>

              <div className="admin-form-group">

                <label htmlFor="category-name">
                  Category Name
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(e) =>
                    setCategoryName(e.target.value)
                  }
                  placeholder="Enter category name"
                />

              </div>

              <div className="admin-form-group">

                <label htmlFor="category-description">
                  Category Description
                </label>

                <textarea
                  id="category-description"
                  value={categoryDescription}
                  onChange={(e) =>
                    setCategoryDescription(e.target.value)
                  }
                  placeholder="Enter category description"
                  rows="3"
                />

              </div>

              <div className="admin-category-actions">

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setCategoryName("");
                    setCategoryDescription("");
                  }}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="admin-primary-button"
                  onClick={handleAddCategory}
                >
                  Add Category
                </button>

              </div>

            </div>
          )}

          {/* Image */}
          <div className="admin-form-group">

            <label htmlFor="product-image">
              Image URL
            </label>

            <input
              id="product-image"
              type="text"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              placeholder="https://example.com/product-image.jpg"
            />

            <span className="admin-form-hint">
              Paste a direct URL to the product image.
            </span>

          </div>

          {/* Buttons */}
          <div className="admin-form-actions">

            <button
              type="button"
              className="admin-cancel-button"
              onClick={() => navigate("/products")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="admin-primary-button"
            >
              Add Product
            </button>

          </div>

        </form>

      </div>

    </main>
  );
}

export default AddProduct;

