import express from 'express';
import mongoose from 'mongoose';

let ProductSchema = new mongoose.Schema({

    Image1: {
        type: String,
        // required:true
    },
    Image2: {
        type: String,
        // required:true
    },
    Brand: {
        type: String,
        required: true
    },
    Info: {
        type: String,
    },
    Price: {
        type: Number,
    },
    Offer_Price: {
        type: Number,
    },
    Discount: {
        type: Number,
        required:true
    },
    Color: {
        type: String
    },
    Description: {
        type: String,
    },
    Category: {
        type: String
    },
    Gender: {
        type: String,
    },
    Rating: {
        type: Array,
    },
    Wishlisted: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    ProductQuantity: [{
        Size: {
            type: String,
            enum: ["S", "M", "L", "XL", "XXL"],

        },
        Quantity: {
            type: Number,
            default:15,
        },
    }
],

UserComments: [{
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        Comment: {
            type: String,
        }
 }]
},

    { timestamps: true });

let Product = mongoose.model('Product', ProductSchema);

export default Product;