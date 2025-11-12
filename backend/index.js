require("dotenv").config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const dbConnect = require("./config/db"); 

const invoice3Routes = require("./routes/invoice3/invoice3Routes");
const purchaseRoutes = require("./routes/purchaseRoutes");
const voucherRoutes = require("./routes/voucherRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const sellerRoutes = require("./routes/sellerInfoRoutes");
const adminRoutes = require("./routes/adminRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const quotation2Routes = require("./routes/quotation2Routes");
const clientRoutes = require("./routes/clientRoutes");
const descriptionRoutes = require("./routes/descriptionRoutes");


const app = express();
const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

dbConnect();

// Routes
app.use("/api/purchase", purchaseRoutes);
app.use("/api/voucher", voucherRoutes);
app.use("/api/quotation", quotationRoutes);
app.use("/api/quotation2", quotation2Routes);
app.use("/api/buyer", buyerRoutes);
app.use("/api", sellerRoutes);
app.use("/api/invoice3", invoice3Routes);
app.use("/api/clients", clientRoutes);
app.use("/api/descriptions", descriptionRoutes);
app.use("/api/auth", adminRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
