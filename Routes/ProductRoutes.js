
const express=require('express');
const Product=require('../Models/Product.js');
const value=require('../controllers/ProductController.js');


const router = express.Router();

const {getProductDetails,updateProductDetails,FilterProducts,getAllProducts,searchDataFilter } = value

router.post('/fetch-and-store', async (req, res) => {
    try {
        const response = await fetch("https://koovs-api-data.onrender.com/mens");
        const apidata = await response.json();

        if (!Array.isArray(apidata)) {
            return res.status(404).json({ message: "Invalid data from the API" });
        }

        // Filter and validate items
        const validItems = apidata.filter(item => item && item.image1 && item.image2);

        if (validItems.length === 0) {
            return res.status(404).json({ message: "No valid data found in the API response" });
        }

        const savedProducts = [];

        let size = ["S", "M", "L", "XL", "XXL"];
       
        for (const item of validItems) {
            try {
                const product = new Product({
                    Image1: item.image1,
                    Image2: item.image2 || "https://example.com/default-image.png",
                    Brand: item.brand,
                    Info: item.info,
                    Price: Number(item.price),
                    Offer_Price: Number(item.oprice),
                    Discount: Number((item.price - item.oprice) / item.price * 100) ,
                    Color: item.color,
                    Description: item.description,
                    Category: item.category,
                    Gender: item.gender,
                    Rating: [],
                    Wishlisted: [],
                    ProductQuantity: size.map((val) =>  ({ Size: val, Quantity:Math.floor(Math.random()*100) })),
                    Count: 0,
                });

                const savedProduct = await product.save();
                savedProducts.push(savedProduct);
            } catch (err) {
                console.error("Error saving product:", err);
            }
        }

        res.status(201).json({
            message: "Products saved successfully",
            data: savedProducts,
        });
    } catch (error) {
        console.error("Error fetching or saving data:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
});

router.get("", FilterProducts)
router.get("/allproduct",getAllProducts)
router.get('/',getProductDetails);
router.post('/updateproduct', updateProductDetails);
router.post('/search',searchDataFilter )





export default router;
