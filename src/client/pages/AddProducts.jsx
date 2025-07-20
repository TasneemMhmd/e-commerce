// src/pages/AddProducts.js
import React from "react";
import products from "../../data/products.json"; // هنحط الملف هنا
import { db } from "../../firebase/firebaseConfig"; // تأكدي من ملف firebase
import { collection, addDoc } from "firebase/firestore";

const AddProducts = () => {
  const handleAddProducts = async () => {
    const productsCollection = collection(db, "products");

    for (let product of products) {
      try {
        await addDoc(productsCollection, product);
        console.log("Added:", product.title);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-2">اضغط الزر لإضافة المنتجات كلها</h2>
      <button
        onClick={handleAddProducts}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        Add Products
      </button>
    </div>
  );
};

export default AddProducts;
// 