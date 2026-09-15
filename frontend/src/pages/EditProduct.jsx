import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const [image, setImage] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Get product + categories
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productResponse, categoryResponse] =
                    await Promise.all([
                        api.get(`/products/${id}`),
                        api.get("/categories"),
                    ]);

                const product = productResponse.data.product;

                setName(product.name || "");
                setDescription(product.description || "");
                setPrice(product.price ?? "");
                setStock(product.stock ?? "");
                setCategoryId(product.categoryId || "");

                setImage(
                    product.images?.length > 0
                        ? product.images[0]
                        : ""
                );

                setCategories(
                    categoryResponse.data.categories || []
                );

            } catch (error) {
                console.error("Failed to load product:", error);

                alert(
                    error.response?.data?.message ||
                    "Failed to load product."
                );

            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    // Update product
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);

            await api.put(`/products/${id}`, {
                name,
                description,
                price: Number(price),
                stock: Number(stock),
                categoryId,
                images: image ? [image] : [],
            });

            alert("Product updated successfully.");

            navigate("/products");

        } catch (error) {
            console.error("Update product error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to update product."
            );

        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="edit-product-page">
                <h1>Loading product...</h1>
            </div>
        );
    }

    return (
        <div className="edit-product-page">

            <h1>Edit Product</h1>

            <form onSubmit={handleSubmit}>

                {/* Product Name */}
                <div className="form-group">
                    <label>Product Name</label>

                    <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                        required
                    />
                </div>

                {/* Description */}
                <div className="form-group">
                    <label>Description</label>

                    <textarea
                        value={description}
                        onChange={(e) =>
                            setDescription(e.target.value)
                        }
                        required
                    />
                </div>

                {/* Price */}
                <div className="form-group">
                    <label>Price</label>

                    <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) =>
                            setPrice(e.target.value)
                        }
                        required
                    />
                </div>

                {/* Stock */}
                <div className="form-group">
                    <label>Stock</label>

                    <input
                        type="number"
                        min="0"
                        value={stock}
                        onChange={(e) =>
                            setStock(e.target.value)
                        }
                        required
                    />
                </div>

                {/* Category */}
                <div className="form-group">
                    <label>Category</label>

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
                </div>

                {/* Image URL */}
                <div className="form-group">
                    <label>Image URL</label>

                    <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                            setImage(e.target.value)
                        }
                    />
                </div>

                {/* Image Preview */}
                {image && (
                    <div className="edit-image-preview">
                        <img
                            src={image}
                            alt={name}
                            onError={(e) => {
                                e.currentTarget.style.display =
                                    "none";
                            }}
                        />
                    </div>
                )}

                {/* Buttons */}
                <div className="edit-product-actions">

                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Updating..."
                            : "Update Product"}
                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditProduct;