const Invoice = require("../models/invoiceModel");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
const puppeteer = require("puppeteer");
const Company = require("../models/companyModel");
const numberToWords = require("number-to-words");

exports.createInvoice = async (req, res) => {

  try {
    // Check if an invoice with this ID already exists to prevent duplicates
    const existingInvoice = await Invoice.findOne({ id: req.body.id });
    if (existingInvoice) {
      return res.status(409).json({ message: "Invoice with this ID already exists." });
    }
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getInvoices = async (req, res) => {
  try {
    // Sort by id ascending to get the oldest invoices first
    const invoices = await Invoice.find().sort({ id: 1 });
    res.status(200).json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    // Use the custom `id` field for lookup instead of mongo's `_id`
    const invoice = await Invoice.findOne({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    // Use the custom `id` field for lookup
    const invoice = await Invoice.findOneAndUpdate({ id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json(invoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    // Use the custom `id` field for lookup
    const invoice = await Invoice.findOneAndDelete({ id: req.params.id });
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });
    res.status(200).json({ message: "Invoice deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Format currency function
const formatCurrency = (number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(number);

// Convert file to Base64
const getFileAsBase64 = (filePath) => {
  if (!filePath) return null;

  const absolutePath = path.resolve(__dirname, "..", filePath);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`File not found: ${absolutePath}`);
    return null;
  }

  try {
    const file = fs.readFileSync(absolutePath);
    const mimeType = `image/${path.extname(absolutePath).substring(1)}`;
    return `data:${mimeType};base64,${file.toString("base64")}`;
  } catch (e) {
    console.error(`Error reading file ${absolutePath}:`, e);
    return null;
  }
};

exports.generateInvoicePDF = async (req, res) => {
  try {
    // Fetch invoice
    const invoice = await Invoice.findOne({ id: req.params.id }).lean();
    if (!invoice) {
      return res.status(404).send("Invoice not found");
    }

    // Fetch company
    const company = await Company.findOne().lean();

    // Fix seller empty bank object
    const seller = invoice.seller || {};
    seller.bank = seller.bank || {};

    // ====== Calculations ======
    const subtotal = invoice.lineItems.reduce(
      (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
      0
    );

    const gstAmount = subtotal * 0.18;
    const grandTotal = subtotal + gstAmount;

    // ====== Template Data ======
    const dataForTemplate = {
      invoice: {
        ...invoice,
        issueDate: new Date(invoice.issueDate || Date.now()).toLocaleDateString(
          "en-IN"
        ),
        seller: {
          ...seller,
          accHolderName: company ? company.accHolderName : seller.name || "",
          companyLogoUrl: getFileAsBase64(company?.companyLogoUrl),
          companySealUrl: getFileAsBase64(company?.companySealUrl),
          companySignatureUrl: getFileAsBase64(company?.companySignatureUrl),
        },
      },
      subtotal,
      gstAmount,
      grandTotal,
      totalInWords:
        numberToWords
          .toWords(grandTotal)
          .replace(/\b\w/g, (char) => char.toUpperCase()) + " Only",
      totalQty: invoice.lineItems.reduce(
        (acc, item) => acc + (item.quantity || 0),
        0
      ),
      formatCurrency,

      qrCodeUrl: (() => {
        if (!(seller.bank.upiId && grandTotal > 0)) return "";

        const payeeName = seller.name || "KeeRa Innovations";
        const upiData = `upi://pay?pa=${seller.bank.upiId
          }&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(
            2
          )}&cu=INR&tn=Invoice%20${invoice.id}`;

        return `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${encodeURIComponent(
          upiData
        )}`;
      })(),

      MOCK_TERMS: [
        "Payment is due within 30 days.",
        "A late fee of 1.5% applies after due date.",
        "Please mention invoice number while paying.",
      ],
    };

    // ====== Template selection ======
    const templateName = req.query.template || "default";
    let templatePath;

    if (templateName === "classic") {
      templatePath = path.join(__dirname, "../views/classic-template.ejs");
    } else if (templateName === "modern") {
      templatePath = path.join(__dirname, "../views/modern-template.ejs");
    } else {
      templatePath = path.join(__dirname, "../views/invoice-template.ejs");
    }

    if (!fs.existsSync(templatePath)) {
      return res.status(404).send(`Template not found: ${templateName}`);
    }

    const html = ejs.render(fs.readFileSync(templatePath, "utf8"), dataForTemplate);

    // ====== Generate PDF ======
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
    });

    await browser.close();

    // ====== FIX: SEND PDF CORRECTLY (NO CORRUPTION) ======
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${invoice.id}.pdf`
    );
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer); // IMPORTANT

  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).send("Failed to generate PDF: " + error.message);
  }
};


exports.generateSamplePDF = async (req, res) => {
  try {
    const html = await ejs.renderFile(
      path.join(__dirname, "../views/sample.ejs")
    );

    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    // 🔥 Correct way to send PDF
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=test-sample.pdf");
    res.setHeader("Content-Length", pdfBuffer.length);

    return res.end(pdfBuffer);

  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
