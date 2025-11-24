const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const numberToWords = require('number-to-words');
const Invoice = require('../models/invoiceModel'); 

// Helper function to format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
};


router.post("/", invoiceController.createInvoice);
router.get("/", invoiceController.getInvoices);
router.get("/:id", invoiceController.getInvoiceById);
router.put("/:id", invoiceController.updateInvoice);
router.delete("/:id", invoiceController.deleteInvoice);

router.get("/:id/pdf", async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ id: req.params.id }).lean();
        if (!invoice) {
            return res.status(404).send("Invoice not found");
        }

        // --- CALCULATIONS ---
        const subtotal = invoice.lineItems.reduce(
            (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
            0
        );

        const gstAmount = subtotal * 0.18;
        const grandTotal = subtotal + gstAmount;

        // --- SAFELY CONVERT IMAGE TO BASE64 ---
        const getFileAsBase64 = (filePath) => {
            try {
                if (!filePath) return null;

                const absolutePath = path.resolve(__dirname, "..", filePath);

                if (!fs.existsSync(absolutePath)) {
                    console.warn(`File not found: ${absolutePath}`);
                    return null;
                }

                const file = fs.readFileSync(absolutePath);
                const ext = path.extname(absolutePath).substring(1);
                return `data:image/${ext};base64,${file.toString("base64")}`;
            } catch (err) {
                console.error("Base64 file error:", err);
                return null;
            }
        };

        // --- QR CODE ---
        const qrCodeUrl =
            invoice?.seller?.bank?.upiId && grandTotal > 0
                ? `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                      `upi://pay?pa=${invoice.seller.bank.upiId}&pn=${encodeURIComponent(
                          invoice.seller.name || "KeeRa Innovations"
                      )}&am=${grandTotal.toFixed(
                          2
                      )}&cu=INR&tn=Invoice%20${invoice.id}`
                  )}`
                : "";

        // --- TEMPLATE DATA ---
        const data = {
            invoice,
            subtotal,
            gstAmount,
            grandTotal,
            totalInWords:
                numberToWords
                    .toWords(grandTotal)
                    .replace(/\b\w/g, (c) => c.toUpperCase()) + " Only",
            totalQty: invoice.lineItems.reduce(
                (acc, item) => acc + (item.quantity || 0),
                0
            ),
            formatCurrency,
            qrCodeUrl,
            companySealUrl:
                invoice.seller?.companySealUrl &&
                getFileAsBase64(invoice.seller.companySealUrl),
            issueDate: new Date(invoice.issueDate || invoice.date).toLocaleDateString(),
            MOCK_TERMS: [
                "Payment is due within 30 days.",
                "A late fee of 1.5% will be charged on overdue invoices.",
                "Please include the invoice number on your payment.",
            ],
        };

        // --- LOAD EJS TEMPLATE ---
        const templatePath = path.resolve(
            __dirname,
            "../views/invoice-template.ejs"
        );

        const templateContent = fs.readFileSync(templatePath, "utf8");
        const html = ejs.render(templateContent, data);

        // --- GENERATE PDF USING PUPPETEER ---
        const browser = await puppeteer.launch({
            headless: "new",
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: "networkidle0" });

        // Fix for external QR images not loading
        // await page.waitForTimeout(500);

        const pdfBuffer = await page.pdf({
            format: "A4",
            printBackground: true,
            margin: {
                top: "0.5in",
                right: "0.5in",
                bottom: "0.5in",
                left: "0.5in",
            },
        });

        await browser.close();

        // --- SEND PDF INLINE FOR BROWSER PREVIEW ---
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=Invoice-${invoice.id}.pdf`,
            "Content-Length": pdfBuffer.length,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).send(`Error generating PDF: ${error.message}`);
    }
});


module.exports = router;
