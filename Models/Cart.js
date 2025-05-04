const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({

    ProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true
    },
    Size: {
        type: String,
        enum: ["S", "M", "L", "XL", "XXL"],
        required:true,
    },
    Quantity: {
        type: Number,
        required:true
    }

}, { timestamps: true });

const Cart = mongoose.model("Cart", CartSchema);

export default Cart;