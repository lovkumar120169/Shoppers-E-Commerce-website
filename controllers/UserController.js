
import Product from '../Models/Product.js';
import User from '../Models/User.js'


const updateUserDetails =  async (req, res) => {
    try {
        const { Email } = req.query;
        
        const updateData = req.body;

        if (!Email) {
            return res.status(404).json({ message: "Email is Required" })
        }
        
        const updatedData = await User.findOneAndUpdate({ Email }, { $set: updateData }, { new: true });

        if (!updatedData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Successfully Updated", updatedData });

    } catch (error) {
        console.log("Error while updating the user data", error);
        res.status(500).json({ message: "Internal server Error" });
    }
}

const signupDetails = async (req, res) => {
  try {
    const {
      FirstName,
      LastName,
      Gender,
      Mobile,
      Email,
      Password,
      Address: { Pincode, State, City, Locality, House_Number } = {},
    } = req.body;

    // Check if the user already exists
    const isUserExist = await User.findOne({ Email });
    if (isUserExist) {
      return res.status(400).json({ ok: false, message: "User already exists" });
    }

    // Ensure required fields are present
    if (!FirstName || !LastName || !Email || !Password || !Pincode || !State || !City) {
      return res.status(400).json({ ok: false, message: "Missing required fields" });
    }

    // Directly store the plain text password (NOT RECOMMENDED for production)
    const newUser = new User({
      FirstName,
      LastName,
      Gender,
      Mobile,
      Email,
      Password, // Storing plain text password
      Address: {
        Pincode,
        State,
        City,
        Locality,
        House_Number,
      },
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send a success response with the user data
    res.status(201).json({
      ok: true,
      message: "User signed up successfully",
      response: savedUser,
    });
  } catch (error) {
    console.error("Error during signup:", error.message);
    res.status(500).json({ ok: false, message: "Internal server error" });
  }
};

  
  


const userChecker= async (req, res) => {

    const { Email } = req.query;
    console.log(Email);
    try {
        let response = await User.findOne({Email:Email});
        res.status(200).json(response);

    } catch (error) {
        console.log("Error while fetching the user data",error)
    }
}
const UserVerification = async (req, res) => {
    try {
      const { Email, Password } = req.query;
  
      const user = await User.findOne({ Email });
      if (user && user.Password === Password) {
        return res.status(200).json({ ok: true, message: "Login Successfully", user });
      } else {
        return res.status(404).json({ ok: false, message: "User not found" });
      }
    } catch (error) {
      console.log("Error while fetching user data", error);
      res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
  };
  

const DeleteUser = async (req, res) => {
    try {
        const { Email } = req.query;

        const userDetails = await User.findOneAndDelete({ Email });
        
        if (!userDetails) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({message:"Successfully deleted the account",userDetails})
    } catch (error) {
        console.log("Error while deleting the account", error);
        res.status(500).json({ message: "Internal server Error" });
    }

}

const addToCart = async (req, res) => {
  try {
    const { UserId } = req.query;
    const { ProductId, Size, Quantity } = req.body;

    if (!UserId || !ProductId || !Size || !Quantity) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const userDetails = await User.findOne({ _id: UserId });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingCartItem = userDetails.Cart.find(
      (item) =>
        item.ProductId.toString() === ProductId.toString() &&
        item.Size.trim().toLowerCase() === Size.trim().toLowerCase()
    );

    if (existingCartItem) {
      existingCartItem.Quantity += Number(Quantity);
    } else {
      userDetails.Cart.push({ ProductId, Size, Quantity });
    }

    await userDetails.save();
    res.status(201).json({ message: "Item successfully added to cart", Cart: userDetails.Cart });
  } catch (error) {
    console.error("Error while adding item to cart", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const RemoveFromCart = async (req, res) => {
  try {
    const { UserId } = req.query;
    const { ProductId, Size } = req.body;

    // console.log("UserId :-",UserId,"ProductId :- ",ProductId,"Size :- ",Size)

    if (!UserId || !ProductId || !Size ) {
      return res.status(400).json({ message: "Invalid request data" });
    }

    const userDetails = await User.findOne({ _id: UserId });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingCartItem = userDetails.Cart.find(
      (item) =>
        item.ProductId.toString() === ProductId.toString() &&
        item.Size.trim().toLowerCase() === Size.trim().toLowerCase()
    );

    if (existingCartItem) {
      
      let updatedcartdata = userDetails.Cart.filter((item) => item.ProductId.toString() != existingCartItem.ProductId.toString() || item.Size.trim().toLowerCase() != existingCartItem.Size.trim().toLowerCase());
      userDetails.Cart = updatedcartdata;
       
    }

    await userDetails.save();
    res.status(201).json({ok:true, message: "Item successfully remove  from cart", Cart: userDetails.Cart });
  } catch (error) {
    console.error("Error while deleting item from cart", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


  
const updateCartQuantity = async (req, res) => {
  try {
     const { UserId } = req.query;
    const { ProductId, Size, Quantity } = req.body;
    
    console.log("product id :-",ProductId, typeof(ProductId))
  
      const userDetails = await User.findOne({ _id: UserId });
  
      if (!userDetails) {
        return res.status(404).json({ message: "User Not Found" });
      }
  
      const cartItem = userDetails.Cart.find(
        (item) => item.ProductId==ProductId && item.Size.trim().toLowerCase() == Size.trim().toLowerCase()
      );
  
      if (cartItem) {
        cartItem.Quantity = Quantity;
        await userDetails.save();
        res.status(200).json({ message: "Cart quantity updated",Cart: userDetails.Cart });
      } else {
        res.status(404).json({ message: "Item not found in cart" });
      }
    } catch (error) {
      console.error("Error while updating cart quantity", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  


  const addToWishlist = async (req, res) => {
    try {
        const { ProductId, UserId } = req.query;

        console.log("product id :",ProductId, typeof(ProductId),"User id :- ",UserId, " in the add to wishlist function in backend");

        let user = await User.findById(UserId);
        // console.log(user);

        // Check if ProductId is already in the wishlist
        const isProductInWishlist = user["Wishlisted"].includes(ProductId);

        if (isProductInWishlist) {
            // If the product is in the wishlist, remove it
            user["Wishlisted"] = user["Wishlisted"].filter((id) => id != ProductId);
        } else {
            // If the product is not in the wishlist, add it
            user["Wishlisted"].push(ProductId);
        }

        // Save the updated user data
        await user.save();
        let WishlistVal = user["Wishlisted"];

        // Send a single response after updating
        res.status(201).json({
            message: isProductInWishlist
                ? "Item removed from wishlist successfully"
                : "Item successfully added to wishlist",
            WishlistVal
        });
    } catch (error) {
        console.log("Error while updating the wishlist", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};



const value = { updateUserDetails, signupDetails,userChecker,UserVerification ,DeleteUser,addToCart,addToWishlist,RemoveFromCart,updateCartQuantity};
export default value;