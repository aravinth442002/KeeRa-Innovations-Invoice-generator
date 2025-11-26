const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
const numberToWords = require('number-to-words');
const Invoice = require('../models/invoiceModel'); 
const Company = require('../models/companyModel');

// Helper function to format currency
const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(0);
    }
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

// router.get('/:id/pdf', async (req, res) => {
//     try {
//         const invoice = await Invoice.findOne({ id: req.params.id }).lean();
//         if (!invoice) {
//             return res.status(404).send('Invoice not found');
//         }

//         const company = await Company.findOne().lean();

//         const getFileAsBase64 = (filePath) => {
//             if (!filePath) return null;
//             const absolutePath = path.resolve(__dirname, '..', filePath);
//             if (!fs.existsSync(absolutePath)) {
//                 console.warn(`File not found: ${absolutePath}`);
//                 return null;
//             }
//             try {
//                 const file = fs.readFileSync(absolutePath);
//                 const mimeType = `image/${path.extname(absolutePath).substring(1)}`;
//                 return `data:${mimeType};base64,${file.toString('base64')}`;
//             } catch (e) {
//                 console.error(`Error reading file ${absolutePath}:`, e);
//                 return null;
//             }
//         };

//         const seller = invoice.seller || {};
//         seller.bank = seller.bank || {};
        
//         const subtotal = invoice.lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
//         const gstAmount = subtotal * 0.18;
//         const grandTotal = subtotal + gstAmount;

<<<<<<< HEAD
//         const dataForTemplate = {
//             invoice: {
//               ...invoice,
//               issueDate: new Date(invoice.issueDate || Date.now()).toLocaleDateString('en-IN'),
//               seller: {
//                   ...seller,
//                   accHolderName: company ? company.accHolderName : (seller.name || ''),
//                   companyLogoUrl: getFileAsBase64(company?.companyLogoUrl),
//                   companySealUrl: getFileAsBase64(company?.companySealUrl),
//                   companySignatureUrl: getFileAsBase64(company?.companySignatureUrl),
//               }
//             },
//             subtotal: subtotal,
//             gstAmount: gstAmount,
//             grandTotal: grandTotal,
//             totalInWords: numberToWords.toWords(grandTotal).replace(/\b\w/g, char => char.toUpperCase()) + ' Only',
//             totalQty: invoice.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
//             formatCurrency: formatCurrency,
//             qrCodeUrl: (() => {
//                 if (!(seller.bank.upiId && grandTotal > 0)) {
//                   return '';
//                 }
//                 const payeeName = seller.name || 'KeeRa Innovations';
//                 const upiData = `upi://pay?pa=${seller.bank.upiId}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=Invoice%20${invoice.id}`;
//                 return `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${encodeURIComponent(upiData)}`;
//             })(),
//             MOCK_TERMS: [
//                 "Payment is due within 30 days.",
//                 "A late fee of 1.5% will be charged on overdue invoices.",
//                 "Please include the invoice number on your payment."
//             ],
//         };
=======
        const formattedIssueDate = new Date(invoice.issueDate || Date.now()).toLocaleDateString('en-IN');
        const formattedDueDate = invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString('en-IN') : 'N/A';

        const dataForTemplate = {
            invoice: {
              ...invoice,
              seller: {
                  ...seller,
                  accHolderName: company ? company.accHolderName : (seller.name || ''),
              }
            },
            company: {
                ...company,
                companyLogoUrl: getFileAsBase64(company?.companyLogoUrl),
                companySealUrl: getFileAsBase64(company?.companySealUrl),
                companySignatureUrl: getFileAsBase64(company?.companySignatureUrl),
            },
            issueDate: formattedIssueDate,
            dueDate: formattedDueDate,
            subtotal: subtotal,
            gstAmount: gstAmount,
            grandTotal: grandTotal,
            totalInWords: numberToWords.toWords(grandTotal).replace(/\b\w/g, char => char.toUpperCase()) + ' Only',
            totalQty: invoice.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0),
            formatCurrency: formatCurrency,
            qrCodeUrl: (() => {
                const bank = company || seller.bank;
                if (!(bank?.upiId && grandTotal > 0)) {
                  return '';
                }
                const payeeName = company?.accHolderName || seller.name || 'KeeRa Innovations';
                const upiData = `upi://pay?pa=${bank.upiId}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=Invoice%20${invoice.id}`;
                return `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${encodeURIComponent(upiData)}`;
            })(),
            MOCK_TERMS: [
                "Payment is due within 30 days.",
                "A late fee of 1.5% will be charged on overdue invoices.",
                "Please include the invoice number on your payment."
            ],
        };
>>>>>>> a874635 (Error generating PDF: ejs:87 85| 86| Invoice Date >> 87| <%= issueDate %)
        
//         // --- Template Selection ---
//         const templateName = req.query.template || 'default';
//         let templatePath;

//         if (templateName === 'classic') {
//             templatePath = path.resolve(__dirname, '../views/classic-template.ejs');
//         } else if (templateName === 'modern') {
//             templatePath = path.resolve(__dirname, '../views/modern-template.ejs');
//         } else {
//             templatePath = path.resolve(__dirname, '../views/invoice-template.ejs');
//         }

//         if (!fs.existsSync(templatePath)) {
//             return res.status(404).send(`Template not found: ${templateName}`);
//         }
        
//         const templateContent = fs.readFileSync(templatePath, 'utf-8');
//         const html = ejs.render(templateContent, dataForTemplate);

//         const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
//         const page = await browser.newPage();
//         await page.setContent(html, { waitUntil: 'networkidle0' });
        
//         const pdf = await page.pdf({
//             format: 'A4',
//             printBackground: true,
//             margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' }
//         });

//         await browser.close();

//         res.contentType('application/pdf');
//         res.send(pdf);
//     } catch (error) {
//         console.error('Error generating PDF:', error);
//         res.status(500).send(`Error generating PDF: ${error.message}`);
//     }
// });


router.get("/test-pdf", invoiceController.generateSamplePDF);

module.exports = router;
