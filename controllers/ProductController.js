
const Product = require('../Models/Product.js');


const getAllProducts = async (req, res) => {
    try {
        const allProduct = await Product.find();
        if (!allProduct) res.status(404).json({ message: "Cant able to fetch products data" });
      res.status(201).json({ ok:true,message: "All product data successfully fetched",allProduct });
    } catch (error) {
        console.log("Error while fetching all product details", error);
        res.status(500).json({message:"Internal server Error"})

    }
    
}

const getProductDetails = async (req, res) => {
    try {
        const { ProductId } = req.query;
        const product = await Product.findOne({_id:ProductId});
       
        if (!product) {
            return res.status(404).json({ message: "Product Not Found" });
        }
        res.status(200).json({message:"Product Found",product})
    } catch (error) {
        console.log("Error while fetching the product data", error);
        res.status(500).json({ message: "Internal server Error" })
    }
}

const updateProductDetails = async (req, res) => {
    try {
        const { ProductId } = req.query;

        const {Price,Offer_Price,}= req.body

        const updatedProduct = await Product.findByIdAndUpdate(ProductId, { $set: { Price: Price,Offer_Price: Offer_Price ,Discount : Math.floor(((Price - Offer_Price) / Price) * 100) } }, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: "Item not found" });
        } 
        console.log("successfully updated the new value");
        res.status(201).json({ message: "item's value successfully updated", updatedProduct });
    } catch (error) {
        console.log("Error while fetching the product data", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

const FilterProducts = async (req, res) => {
  try {
    const {
      MaxPriceValue,
      Category,
      Color,
      Brand,
      MinPriceValue,
      Gender,
      Discount,
      SortBy,
      Size,
      searchKeyword,
    } = req.query;

    // Build the match object for filters
    const matchCategory = {};

    if (Color) matchCategory.Color = { $in: Color.split(",") };
    if (Brand) matchCategory.Brand = { $in: Brand.split(",") };
    if (MaxPriceValue)
      matchCategory.Offer_Price = { $lte: Number(MaxPriceValue) };
    if (MinPriceValue) {
      matchCategory.Offer_Price = {
        ...(matchCategory.Offer_Price || {}),
        $gte: Number(MinPriceValue),
      };
    }
    if (Gender && Gender.toLowerCase() !== "all") matchCategory.Gender = Gender;
    if (Discount) matchCategory.Discount = { $gte: Number(Discount) };
    if (Size)
      matchCategory.ProductQuantity = {
        $elemMatch: { Size: { $in: Size.split(",") } },
      };
    if (Category && Category.toLowerCase() !== "all") {
        matchCategory.Category = Category;
      }
      

    // Handle searchKeyword if provided
    if (searchKeyword) {
      const searchRegex = new RegExp(searchKeyword, "i"); // Case-insensitive search
      matchCategory.$or = [
        { Color: searchRegex },
        { Category: searchRegex },
        { Brand: searchRegex },
      ];
    }

    console.log("Filter Conditions:", matchCategory);

    // Use aggregate pipeline for filtering
    let filterData = await Product.aggregate([
      { $match: matchCategory }, // Apply the match filters
      {
        $group: {
          _id: "$_id",
          Image1: { $first: "$Image1" },
          Image2: { $first: "$Image2" },
          Category: { $first: "$Category" },
          Color: { $first: "$Color" },
          Brand: { $first: "$Brand" },
          Offer_Price: { $first: "$Offer_Price" },
          Price: { $first: "$Price" },
          Gender: { $first: "$Gender" },
          Discount: { $first: "$Discount" },
          ProductQuantity: { $first: "$ProductQuantity" },
          Description:{$first:"$Description"}
        },
      },
      {
        $sort: { Offer_Price: 1, _id: 1 }, // Default sort by Offer_Price and _id
      },
      {
        $project: {
          _id: 1,
          Image1: 1,
          Image2: 1,
          Category: 1,
          Color: 1,
          Brand: 1,
          Offer_Price: 1,
          Price: 1,
          Gender: 1,
          Discount: 1,
          ProductQuantity: 1,
          Description:1
        },
      },
    ]);

    // Sort the filtered data if SortBy is provided
    if (SortBy === "Asc") {
      filterData = filterData.sort((a, b) => a.Offer_Price - b.Offer_Price);
    } else if (SortBy === "Dsc") {
      filterData = filterData.sort((a, b) => b.Offer_Price - a.Offer_Price);
    }

    // Deduplicate using the _id in the aggregation itself
    const seen = new Set();
    filterData = filterData.filter((item) => {
      if (seen.has(item._id)) {
        return false;
      }
      seen.add(item._id);
      return true;
    });

    // Extract unique brand names, colors, and discounts
    const allBrandName = [...new Set(filterData.map((item) => item.Brand))];
    const allProductColor = [...new Set(filterData.map((item) => item.Color))];
    const allDiscount = [...new Set(filterData.map((item) => item.Discount))];

    res.status(200).json({
      message: "Filtered products",
      filterData,
      allBrandName,
      allProductColor,
      allDiscount,
    });
  } catch (error) {
    console.error("Error in FilterProducts:", error.message, error.stack);
    res.status(500).json({ message: "Internal server error" });
  }
};





const searchDataFilter = async (req, res) => {
  try {
    const {
      Gender,
      searchkeyword,
      Color,
      Brand,
      Discount,
      MinPriceValue,
      MaxPriceValue,
    } = req.body; // Filters sent from the frontend

    // Build the query object dynamically based on filters
    let query = {};

    // Filter by Gender (optional)
    if (Gender && Gender.length > 0) {
      query.Gender = { $in: Gender };
    }

    // Filter by search keyword (matches across Brand, Category, and Description fields)
    if (searchkeyword) {
      query.$and = [
        { 
          $or: [
            { Brand: { $regex: searchkeyword, $options: 'i' } },
            { Category: { $regex: searchkeyword, $options: 'i' } },
            { Description: { $regex: searchkeyword, $options: 'i' } },
          ]
        }
      ];
    }

    // Filter by Color
    if (Color) {
      query.Color = Color;
    }

    // Filter by Brand
    if (Brand) {
      query.Brand = Brand;
    }

    // Filter by Discount
    if (Discount) {
      query.Discount = { $gte: parseInt(Discount) };
    }

    // Filter by price range
    if (MinPriceValue || MaxPriceValue) {
      query.Offer_Price = {};
      if (MinPriceValue) {
        query.Offer_Price.$gte = parseInt(MinPriceValue);
      }
      if (MaxPriceValue) {
        query.Offer_Price.$lte = parseInt(MaxPriceValue);
      }
    }

    // Fetch filtered products from the database
    const products = await Product.find(query);

    // Return the filtered products to the frontend
    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error in searchDataFilter:', error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};





  


const value = { getAllProducts,getProductDetails,updateProductDetails,FilterProducts ,searchDataFilter };

export default value;