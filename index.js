const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ProductRoutes = require('./Routes/ProductRoutes.js');
const UserRoutes = require('./Routes/UserRoutes.js');


const app = express();

const PORT = process.env.PORT; // port imported

app.use(bodyParser.json());
app.use(cors());
const port = 3000;

app.use('/product', ProductRoutes)
app.use('/user',UserRoutes)

// app.listen(PORT || 3000, () => {
//     console.log(`Server is listning at ${PORT}`);
// })

module.exports=app;