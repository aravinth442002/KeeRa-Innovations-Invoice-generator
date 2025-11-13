
const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();

const sellerRoutes = require("./routes/sellerRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const quotationRoutes = require("./routes/quotationRoutes");
const clientRoutes = require("./routes/clientRoutes");
const descriptionRoutes = require("./routes/descriptionRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// Root endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: `Backend is running successfully on port ${PORT}`,
  });
});

// API Routes
app.use("/api/sellers", sellerRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/descriptions", descriptionRoutes);
app.use("/api/auth", adminRoutes);

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
