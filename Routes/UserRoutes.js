const express=require("express");
const value =require('../controllers/UserController.js');

const router = express.Router();

const { signupDetails,updateUserDetails,userChecker,UserVerification,DeleteUser,addToCart,addToWishlist,RemoveFromCart,updateCartQuantity } = value;

router.get('/', userChecker);

router.post('/signup', signupDetails);

router.get('/login',UserVerification );

router.put('/update', updateUserDetails);

router.delete('/delete', DeleteUser);

router.post('/addtocart', addToCart);

router.post('/updatecartquantity',updateCartQuantity)

router.post('/removefromcart',RemoveFromCart)

router.post('/addtowishlist',addToWishlist)

export default router;