import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    FirstName: {
        type: String,
        required:true
    },
    LastName: {
        type: String,
        required:true,
    },
    Email: {
        type: String,
        required: [true,"Correct Email format is Required"],
        unique: true,
        lowercase:true,
    },
    Password: {
        type: String,
        required:[true,"Password is Required"]
    },
    Gender: {
        type:String
    },
    Mobile: {
        type:Number
    },
    Wishlisted: [
       {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        }
    
],
    Cart: [{
        ProductId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required:true,
        },
        Size: {
            type: String,
            enum: ["S", "M", "L", "XL", "XXL"],
            required:true,
        },
        Quantity: {
            type: Number,
            required: true,
            default: 1,
        }
    }
    ],
    
    Address: {
        Pincode :{
            type: Number,
            required:true,
        },
        State: {
            type: String,
            required:true,
        },
        City: {
            type: String,
            required:true,
        },
        Locality: {
            type:String,
        },
        House_Number: {
            type:String,
        }
    }, 
    CardDetails: {
        CardType: {
            type: String,
            enum: ["CreditCard,DebitCard"],
            required: false,
            
        },
        CardNumber: {
            type: Number,
            
        },
        CVV: {
            type: Number,
            
        }
    }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;