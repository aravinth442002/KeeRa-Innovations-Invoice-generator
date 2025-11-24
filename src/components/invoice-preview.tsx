
'use client';

import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/lib/data';
import AppLogo from './app-logo';
import Image from 'next/image';

type InvoicePreviewProps = {
  invoice: Omit<Invoice, 'amount' | 'status' | 'date'> & {
    amount: number;
    status: 'Draft' | 'Processing' | 'Received';
    date: string;
  };
  template: string;
};

// Helper to convert number to words. This is a simplified version.
// A more robust library would be needed for a production app.
function numberToWords(num: number): string {
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if ((num = Math.round(num)).toString().length > 9) return 'overflow';
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return '';
    let str = '';
    str += (n[1] != '00') ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + ' crore ' : '';
    str += (n[2] != '00') ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + ' lakh ' : '';
    str += (n[3] != '00') ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + ' thousand ' : '';
    str += (n[4] != '0') ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + ' hundred ' : '';
    str += (n[5] != '00') ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    
    return str.trim().split(/\s+/).map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ') + ' Only';
}

const DefaultTemplate = ({ invoice }: { invoice: InvoicePreviewProps['invoice'] }) => {
    const subtotal = invoice.lineItems.reduce(
        (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
        0
    );
    const gstAmount = subtotal * 0.18; // Assuming 18% GST
    const grandTotal = subtotal + gstAmount;

    const totalQty = invoice.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    const totalInWords = numberToWords(grandTotal);
    const bankDetails = invoice.seller?.bank || {};
    
    const MOCK_TERMS = [
        "Payment is due within 30 days.",
        "A late fee of 1.5% will be charged on overdue invoices.",
        "Please include the invoice number on your payment."
    ];

    const qrCodeUrl = (() => {
        if (!(bankDetails.upiId && grandTotal > 0)) return '';
        const payeeName = invoice.seller?.name || 'KeeRa Innovations';
        const upiData = `upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=Invoice%20${invoice.id}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=${encodeURIComponent(upiData)}`;
    })();

    const getFileUrl = (filePath?: string) => {
        if (!filePath) return null;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const BASE_URL = API_URL.replace('/api', '');
        return `${BASE_URL}/${filePath}`;
    }

    const companyLogoUrl = getFileUrl(invoice.seller.companyLogoUrl);
    const companySealUrl = getFileUrl(invoice.seller.companySealUrl);

    return (
        <div className="bg-white text-black text-[10px] w-full min-h-[1123px] mx-auto my-0 p-6 font-sans border shadow-lg scale-[0.8] origin-top">
            <div className="bg-primary text-white font-bold text-center text-4xl py-2" style={{height: '48px', lineHeight: '32px'}}>
                TAX INVOICE
            </div>
            
            <table className="w-full border-collapse border border-primary -mt-px">
                <tbody>
                <tr>
                    <td className="w-[45%] p-0 border-r border-primary align-top">
                    <div className="flex items-center p-2 min-h-[86px]">
                        <div className="w-[70px] h-[70px] mr-2 flex-shrink-0">
                            {companyLogoUrl ? (
                                <Image src={companyLogoUrl} alt="Company Logo" width={70} height={70} className="object-contain" unoptimized />
                            ) : (
                                <div className="w-full h-full bg-gray-200"></div>
                            )}
                        </div>
                        <div>
                        <h1 className="text-xl font-bold m-0 leading-tight">{invoice.seller.name}</h1>
                        </div>
                    </div>
                    <table className="w-full border-t border-primary border-collapse">
                        <tbody>
                            <tr><td className="p-2 text-sm leading-normal">{invoice.seller.address}</td></tr>
                        </tbody>
                    </table>
                    <table className="w-full border-t border-primary border-collapse">
                        <tbody>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 border-r border-primary w-[30%] text-xs">GSTIN</td>
                                <td className="p-2 text-xs">{invoice.seller.gstin}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 border-r border-primary text-xs">Phone</td>
                                <td className="p-2 text-xs">{invoice.seller.phone}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 border-r border-primary text-xs">Email</td>
                                <td className="p-2 text-xs">{invoice.seller.email}</td>
                            </tr>
                        </tbody>
                    </table>
                    </td>

                    <td className="w-[55%] p-0 align-top">
                    <div className="bg-primary/20 font-bold text-center py-1 text-base">Customer Detail</div>
                    <table className="w-full border-t border-primary border-collapse">
                        <tbody>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 w-[25%] text-xs">Name</td>
                                <td className="p-2 text-xs">{invoice.customer || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 text-xs">Address</td>
                                <td className="p-2 text-xs leading-tight">{invoice.customerAddress || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 text-xs">Phone</td>
                                <td className="p-2 text-xs">{invoice.phone || '-'}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 text-xs">GSTIN</td>
                                <td className="p-2 text-xs">{invoice.gstin || 'N/A'}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 text-xs">Invoice No.</td>
                                <td className="p-2 text-xs">{invoice.id}</td>
                            </tr>
                            <tr>
                                <td className="bg-primary/20 font-bold p-2 text-xs">Invoice Date</td>
                                <td className="p-2 text-xs">{new Date(invoice.issueDate || Date.now()).toLocaleDateString()}</td>
                            </tr>
                        </tbody>
                    </table>
                    </td>
                </tr>
                </tbody>
            </table>
            <table className="w-full border-collapse border border-primary -mt-px">
                <tbody>
                    <tr className="bg-primary/20">
                        <td className="font-bold p-2 border-r border-primary w-[13%] text-xs">Project Name</td>
                        <td className="p-2 text-xs">{invoice.description}</td>
                    </tr>
                </tbody>
            </table>
            <div className="mt-1">
                <table className="w-full border-collapse border border-primary text-xs">
                    <thead>
                        <tr className="bg-primary text-white font-bold">
                            <th className="p-2 text-left w-[8%] text-sm">Sr. No.</th>
                            <th className="p-2 text-left w-[42%] text-sm">Name of Product / Service</th>
                            <th className="p-2 text-center w-[10%] text-sm">Qty</th>
                            <th className="p-2 text-right w-[20%] text-sm">Rate</th>
                            <th className="p-2 text-right w-[20%] text-sm">Total (Excl. Tax)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.lineItems.map((item, index) => (
                            <tr key={index} style={{height: '32px'}}>
                                <td className="border border-primary p-2 text-center text-sm">{index + 1}</td>
                                <td className="border border-primary p-2 font-bold text-sm">{item.name}</td>
                                <td className="border border-primary p-2 text-center text-sm">{item.quantity}</td>
                                <td className="border border-primary p-2 text-right text-sm">{formatCurrency(item.price)}</td>
                                <td className="border border-primary p-2 text-right text-sm">{formatCurrency(item.price * item.quantity)}</td>
                            </tr>
                        ))}
                        {Array.from({ length: Math.max(0, 7 - invoice.lineItems.length) }).map((_, i) => (
                            <tr key={`filler-${i}`} style={{height: '32px'}}>
                                <td className="border border-primary">&nbsp;</td>
                                <td className="border border-primary">&nbsp;</td>
                                <td className="border border-primary">&nbsp;</td>
                                <td className="border border-primary">&nbsp;</td>
                                <td className="border border-primary">&nbsp;</td>
                            </tr>
                        ))}
                        <tr className="bg-primary/20 font-bold text-sm">
                            <td colSpan={2} className="border border-primary p-2 text-right">Total</td>
                            <td className="border border-primary p-2 text-center">{totalQty}</td>
                            <td className="border border-primary p-2"></td>
                            <td className="border border-primary p-2 text-right">{formatCurrency(subtotal)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="mt-1">
                <table className="w-full border-collapse border border-primary -mt-px text-xs">
                    <tbody>
                        <tr style={{height: '28px'}}>
                            <td className="bg-primary/20 font-bold text-center text-sm p-1 w-[60%]" rowSpan={3}>
                                {totalInWords}
                            </td>
                            <td className="bg-primary/20 font-bold p-1 border-b border-primary w-[20%]">Amount without Tax</td>
                            <td className="font-bold text-right p-1 border-b border-primary w-[20%]">{formatCurrency(subtotal)}</td>
                        </tr>
                        <tr>
                            <td className="p-1">Add CGST @ 9%</td>
                            <td className="font-bold text-right p-1">{formatCurrency(gstAmount/2)}</td>
                        </tr>
                        <tr>
                            <td className="p-1 border-b border-primary">Add SGST @ 9%</td>
                            <td className="font-bold text-right p-1 border-b border-primary">{formatCurrency(gstAmount/2)}</td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border-collapse border border-primary -mt-px text-xs">
                    <tbody>
                        <tr>
                        <td className="p-0 w-[60%] align-top">
                            <div className="bg-primary text-white font-bold p-2 text-center text-sm">Bank Details</div>
                            <table className="w-full border-collapse">
                                <tbody>
                                    {[
                                        {label: 'Name', value: bankDetails.accHolderName},
                                        {label: 'Branch', value: bankDetails.branch},
                                        {label: 'Acc. Number', value: bankDetails.accountNumber},
                                        {label: 'IFSC', value: bankDetails.ifsc},
                                        {label: 'UPI ID', value: bankDetails.upiId},
                                    ].map(detail => (
                                        <tr key={detail.label} style={{height: '25px'}}>
                                            <td className="bg-primary/20 font-bold p-1 border border-primary w-[25%]">{detail.label}</td>
                                            <td className="p-1 border border-primary w-[50%]">{detail.value || ''}</td>
                                            {detail.label === 'Name' && (
                                                <td className="text-center p-0 border-t-0 border-b-0 border-r-0 border-l border-primary" rowSpan={5}>
                                                {qrCodeUrl && (
                                                    <>
                                                    <div className="w-[85px] h-[85px] m-auto border border-primary flex items-center justify-center p-1">
                                                        <Image src={qrCodeUrl} alt="QR Code" width={80} height={80} unoptimized />
                                                    </div>
                                                    <p className="font-bold text-xs pt-1">Pay with QR</p>
                                                    </>
                                                )}
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="bg-primary text-white font-bold p-2 text-center -mt-px text-sm">Terms and Conditions</div>
                            <table className="w-full border-collapse border border-primary -mt-px">
                                <tbody>
                                    <tr>
                                        <td>
                                            <ol className="font-bold list-decimal ml-4 p-2 text-xs space-y-1">
                                                {MOCK_TERMS.map((term, i) => <li key={i}>{term}</li>)}
                                            </ol>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                        <td className="p-0 w-[40%] align-top">
                                <table className="w-full border-collapse border-l-0">
                                    <tbody>
                                        <tr className="bg-primary text-white font-bold">
                                            <td className="text-left p-2 text-sm w-[50%]">Total Amount</td>
                                            <td className="text-right p-2 text-sm w-[50%]">{formatCurrency(grandTotal)}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-right font-bold p-2 border border-primary" colSpan={2}>(E & O.E.)</td>
                                        </tr>
                                        <tr>
                                            <td className="text-left font-bold text-xs p-2 border border-primary h-[30px]" colSpan={2}>
                                                Certified that the particulars given above are true and correct.
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="bg-primary text-white font-bold p-2 text-left -mt-px text-sm">For {invoice.seller.name}</div>
                                <div className="h-[140px] text-center p-2 border-x border-primary flex items-center justify-center">
                                    {companySealUrl ? (
                                        <Image src={companySealUrl} alt="Company Seal" width={140} height={140} className="object-contain" unoptimized />
                                    ) : (
                                        <div className="w-32 h-32 mx-auto border border-primary rounded-full flex items-center justify-center text-xs font-bold">
                                            {/* Seal Placeholder */}
                                        </div>
                                    )}
                                </div>
                                <table className="w-full border-collapse border border-primary mt-[15px]">
                                <tbody>
                                    <tr>
                                        <td className="text-center font-bold p-2 text-xs">
                                            Company Seal / Authorised Signatory
                                        </td>
                                    </tr>
                                </tbody>
                                </table>
                        </td>
                        </tr>
                    </tbody>
                </table>
                <table className="w-full border-collapse border border-primary -mt-px">
                    <tbody>
                        <tr className="bg-primary/20">
                            <td className="text-center font-semibold p-2 text-base">Thank you for Working with us!</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};


const ClassicTemplate = ({ invoice }: { invoice: InvoicePreviewProps['invoice'] }) => {
  const { seller, customer, customerAddress, lineItems, description, issueDate, id, dueDate, gstin } = invoice;
  const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
  const gstAmount = subtotal * 0.18; // Assuming flat 18%
  const grandTotal = subtotal + gstAmount;

  const getFileUrl = (filePath?: string) => {
    if (!filePath) return null;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const BASE_URL = API_URL.replace('/api', '');
    return `${BASE_URL}/${filePath}`;
  }

  const logoUrl = getFileUrl(seller.companyLogoUrl);

  const customerAddressParts = customerAddress?.split(',').map(p => p.trim()) || [];
  const sellerAddressParts = seller?.address?.split(',').map(p => p.trim()) || [];

  const TotalRow = ({ label, value, isGrandTotal = false }: { label: string; value: number, isGrandTotal?: boolean }) => (
    <div className={`flex justify-between py-1 px-4 ${isGrandTotal ? 'bg-purple-700 text-white text-lg font-extrabold mt-3 rounded' : 'border-b border-gray-200'}`}>
      <span className={`font-semibold ${isGrandTotal ? 'text-white' : 'text-gray-600'}`}>{label}</span>
      <span className={`font-bold ${isGrandTotal ? 'text-white' : 'text-gray-800'}`}>{formatCurrency(value)}</span>
    </div>
  );

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen font-sans scale-[0.8] origin-top">
      <div className="bg-white mx-auto max-w-5xl shadow-2xl pb-10 rounded-xl overflow-hidden">
        <header className="text-white relative overflow-hidden bg-purple-700">
          <div className="flex justify-between items-center p-8">
            <div className="flex flex-col items-start">
              {logoUrl && (
                <Image
                  src={logoUrl}
                  alt={`${seller.name} Logo`}
                  width={48}
                  height={48}
                  className="mb-2"
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))' }}
                  unoptimized
                />
              )}
              <h1 className="text-2xl font-extrabold tracking-tight">{seller.name || 'KEERA INNOVATIONS'}</h1>
            </div>
            <div className="text-right">
              <h2 className="text-4xl font-extrabold tracking-wider mb-2">TAX INVOICE</h2>
              <div className="text-xs space-y-1">
                <p>
                  <span className="font-bold w-20 inline-block text-right">Invoice No:</span>
                  <span className="ml-2 font-extrabold text-yellow-300">{id || '565254'}</span>
                </p>
                <p>
                  <span className="font-bold w-20 inline-block text-right">Date:</span>
                  <span className="ml-2">{new Date(issueDate).toLocaleDateString() || '01/02/2025'}</span>
                </p>
                <p>
                  <span className="font-bold w-20 inline-block text-right">Due Date:</span>
                  <span className="ml-2">{new Date(dueDate).toLocaleDateString() || '30/02/2025'}</span>
                </p>
              </div>
            </div>
          </div>
        </header>

        <section className="px-8 pt-6 pb-6 text-gray-800 border-b border-gray-200">
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <h3 className="text-lg font-bold text-gray-700 mb-2 border-b-2 border-purple-300 inline-block pb-1">Our Details</h3>
              <h4 className="text-base font-extrabold text-purple-700 mt-2">{seller.name || 'Keera Innovations'}</h4>
              <p className="text-sm mt-1">{sellerAddressParts[0]}</p>
              <p className="text-sm">{sellerAddressParts[1]}</p>
              <p className="text-sm">{sellerAddressParts[2]}</p>
              <p className="text-sm mt-2">📞 {seller.phone || '+91-951 461 9276'}</p>
              <p className="text-sm font-light mt-1">
                <span className="font-semibold mr-1">GSTIN:</span> {seller.gstin || 'N/A'}
              </p>
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-gray-700 mb-2 border-b-2 border-purple-300 inline-block pb-1">Bill To</h3>
              <h4 className="text-2xl font-bold text-purple-700 mt-2">{customer || 'N/A'}</h4>
              {customerAddressParts.map((part, i) => <p key={i} className="text-sm mt-1">{part}</p>)}
              <p className="text-sm font-light mt-1 text-gray-800">
                <span className="font-semibold mr-1">GSTIN:</span> {gstin || 'N/A'}
              </p>
              <p className="text-sm pt-4 font-bold text-gray-800">
                PROJECT: <span className="font-normal">{description || 'N/A'}</span>
              </p>
            </div>
          </div>
        </section>

        <section className="px-8 mt-6">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-purple-700 text-white font-bold text-xs uppercase tracking-wider">
                <th className="py-3 px-4 text-left w-1/2 rounded-tl-lg">Description</th>
                <th className="py-3 px-4 text-center w-[15%]">Rate</th>
                <th className="py-3 px-4 text-center w-[10%]">Qty</th>
                <th className="py-3 px-4 text-right w-[25%] rounded-tr-lg">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-purple-50 transition-colors' : 'bg-purple-50 hover:bg-purple-100 transition-colors'}>
                  <td className="py-3 px-4 text-left border-b border-gray-200">{item.name}</td>
                  <td className="py-3 px-4 text-center border-b border-gray-200">{formatCurrency(item.price)}</td>
                  <td className="py-3 px-4 text-center border-b border-gray-200">{item.quantity}</td>
                  <td className="py-3 px-4 text-right font-bold text-purple-700 border-b border-gray-200">{formatCurrency(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <div className="px-8 pb-8 text-xs">
          <div className="flex justify-between mt-8">
            <div className="w-1/2 pr-10">
              <h3 className="text-sm font-bold mb-3 text-purple-700 border-b border-purple-300 pb-1">PAYMENT DETAILS</h3>
              <div className="text-xs space-y-1 w-full p-3 bg-purple-200 rounded shadow-inner">
                <p><span className="font-bold w-20 inline-block">A/C NAME:</span> {seller.bank?.accHolderName || ''}</p>
                <p><span className="font-bold w-20 inline-block">BRANCH:</span> {seller.bank?.branch || ''}</p>
                <p><span className="font-bold w-20 inline-block">ACC. NO:</span> {seller.bank?.accountNumber || ''}</p>
                <p><span className="font-bold w-20 inline-block">IFSC:</span> {seller.bank?.ifsc || ''}</p>
                <p className="mt-2 font-bold text-purple-700">UPI ID: {seller.bank?.upiId || ''}</p>
              </div>
              <h3 className="text-sm font-bold mb-2 mt-8 text-purple-700 border-b border-purple-300 pb-1">TERMS AND CONDITIONS</h3>
              <ul className="text-xs text-gray-800 leading-relaxed list-disc list-inside space-y-1 pl-2">
                <li className="pl-1 font-semibold">Payment is due within 7 days from the invoice date.</li>
                <li className="pl-1 font-semibold">All project deliverables and warranty claims require full payment.</li>
                <li className="pl-1 font-semibold">Disputes, if any, shall be subject to Chennai jurisdiction.</li>
              </ul>
            </div>
            <div className="w-1/2 pl-10 flex flex-col items-end">
              <div className="w-80 text-sm bg-gray-50 p-4 rounded-lg shadow-md">
                <TotalRow label="Sub Total" value={subtotal} />
                <TotalRow label={`Tax (18%)`} value={gstAmount} />
                <TotalRow label={`CGST (9%)`} value={gstAmount / 2} />
                <TotalRow label={`SGST (9%)`} value={gstAmount / 2} />
                <TotalRow label="Amount Due" value={grandTotal} isGrandTotal={true} />
              </div>
              <div className="flex flex-col mt-8 pt-4 w-full items-end">
                 {getFileUrl(seller.companySealUrl) ? (
                    <Image src={getFileUrl(seller.companySealUrl)!} alt="Seal" width={128} height={128} className="mb-4" unoptimized/>
                 ) : (
                    <div className="w-32 h-32 mb-4 flex items-center justify-center mr-16 border-4 border-purple-400 rounded-full bg-white shadow-lg">
                        <span className="text-sm font-bold text-gray-700 text-center uppercase tracking-wider">
                            [SEAL]
                        </span>
                    </div>
                 )}
                <p className="text-2xl font-bold text-purple-700 mt-2">Authorized Signature</p>
                <p className="font-normal text-gray-600 text-center text-sm mt-1">Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const ModernTemplate = ({ invoice: inv }: { invoice: InvoicePreviewProps['invoice'] }) => {
    const subtotal = inv.lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.price || 0), 0);
    const gstAmount = subtotal * 0.18;
    const grandTotal = subtotal + gstAmount;
    const cgstAmount = gstAmount / 2;
    const sgstAmount = gstAmount / 2;
    const bankDetails = inv.seller?.bank || {};
    
    const termPoints = [
        "Payment to be made within 7 days from the date of invoice.",
        "Project deliverables and warranty are valid only after full payment.",
        "All disputes are subject to Chennai jurisdiction.",
    ];

    const getFileUrl = (filePath?: string) => {
        if (!filePath) return null;
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
        const BASE_URL = API_URL.replace('/api', '');
        return `${BASE_URL}/${filePath}`;
    }

    const companyLogoUrl = getFileUrl(inv.seller.companyLogoUrl);
    const companySealUrl = getFileUrl(inv.seller.companySealUrl);
    const qrCodeUrl = (() => {
        if (!(bankDetails.upiId && grandTotal > 0)) return null;
        const payeeName = inv.seller?.name || 'KeeRa Innovations';
        const upiData = `upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(payeeName)}&am=${grandTotal.toFixed(2)}&cu=INR&tn=Invoice%20${inv.id}`;
        return `https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(upiData)}`;
    })();

    return (
     <div className="invoice-container max-w-[800px] mx-auto shadow-2xl bg-white min-h-screen font-sans scale-[0.8] origin-top">

        <header className="px-10 pt-10 pb-6 bg-purple-800 text-white relative overflow-hidden">

          <div className="absolute top-0 left-0 w-1/2 h-full opacity-30"
            style={{
              backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
              backgroundSize: '10px 10px',
              WebkitMaskImage: 'linear-gradient(to right, black 80%, transparent)',
              maskImage: 'linear-gradient(to right, black 80%, transparent)'
            }}>
          </div>

          <div className="flex justify-between z-10 relative">
            <div className="flex flex-col w-1/2">
              <div className="flex items-end mb-4">
                 <div className="w-10 h-10 mr-2 rounded-full flex items-center justify-center text-white">
                    {companyLogoUrl ? <Image src={companyLogoUrl} alt="logo" width={40} height={40} className="rounded-full" unoptimized /> : 'LOGO' }
                 </div>
                 <span className="text-4xl font-extrabold tracking-tight text-fuchsia-300"
                   style={{ fontFamily: 'Georgia, serif', lineHeight: '1' }}>
                   {inv.seller.name || 'KeeRa'}
                 </span>
                 <span className="text-sm font-semibold tracking-widest text-white ml-1 uppercase"
                   style={{ fontFamily: 'Arial, sans-serif' }}>
                   INNOVATIONS
                 </span>
               </div>
              <h1 className="text-6xl font-extrabold tracking-tight mb-3">TAX INVOICE</h1>
              <p className="text-sm font-semibold text-fuchsia-300">
                 INVOICE DATE: <span className="font-bold tracking-wider">{new Date(inv.issueDate || Date.now()).toLocaleDateString()}</span>
              </p>
              
               <p className="text-sm font-semibold tracking-wide text-white mt-1">
                 PROJECT NAME: <span className="font-bold">{inv.description}</span>
               </p>

            </div>

            <div className="flex flex-col text-right space-y-1 text-xs w-1/2 font-semibold text-purple-200">
               <p>{inv.seller.phone}</p>
               <p className="font-bold text-fuchsia-300">{inv.seller.email}</p>
              <div className="mt-2 pt-2 text-sm space-y-0.5">
                 {inv.seller.address.split(',').map((line, index) => <span key={index} className="block">{line}</span>)}
              </div>
            </div>
          </div>
        </header>

        <div className="bg-white pb-10 p-5">

          <div className="pt-4 border border-fuchsia-300 shadow-purple-800 rounded-lg overflow-hidden shadow-sm">

            <div className="flex text-sm font-extrabold text-gray-900 uppercase pb-2 border-b-2 border-fuchsia-500 px-3">
              <span className="w-6/12 text-fuchsia-600">PRODUCT DESCRIPTION</span>
              <span className="w-2/12 text-fuchsia-600 text-right">PRICE</span>
              <span className="w-2/12 text-fuchsia-600 text-center">QTY.</span>
              <span className="w-2/12 text-fuchsia-600 text-right">TOTAL</span>
            </div>

            <div className="divide-y divide-gray-200">
              {inv.lineItems.map((item, index) => (
                <div
                  className={`flex py-3 text-sm font-semibold px-3 ${index % 2 === 0 ? 'bg-purple-300 text-gray-800' : 'bg-fuchsia-50 text-gray-900'
                    }`}
                  key={index}
                >
                  <span className="w-6/12">{item.name}</span>
                  <span className="w-2/12 text-right">{formatCurrency(item.price)}</span>
                  <span className="w-2/12 text-center">{item.quantity}</span>
                  <span className="w-2/12 text-right">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          <footer className="flex mt-8 justify-between px-10">
            <div className="flex flex-col w-7/12 pt-6">
              <div className="bill-to-section mb-6 text-gray-700">
                <h3 className="text-base font-bold uppercase mb-2 text-fuchsia-600">INVOICE TO:</h3>
                <p className="text-sm font-extrabold text-gray-900">{inv.customer}</p>
                <p className="text-sm font-semibold">{inv.customerAddress}</p>
                <p className="text-sm font-semibold">{inv.phone}</p>
                <p className="text-sm font-extrabold text-fuchsia-600">{inv.email}</p>
              </div>

              <div className="payment-details-section mt-4 p-4 border shadow-purple-900 rounded-lg border-fuchsia-600 overflow-hidden shadow-sm">
                <h3 className="text-sm font-bold uppercase mb-2 text-fuchsia-600 border-b border-gray-300 pb-1">Payment Details</h3>
                <div className="flex justify-between items-start text-gray-700">
                  <div className="text-xs space-y-1 w-2/3 font-semibold">
                    <p>A/C Name: <span className="font-extrabold text-gray-900">{bankDetails.accHolderName}</span></p>
                    <p>Branch: <span className="font-extrabold text-gray-900">{bankDetails.branch}</span></p>
                    <p>A/C No: <span className="font-extrabold text-gray-900">{bankDetails.accountNumber}</span></p>
                    <p>IFSC: <span className="font-extrabold text-gray-900">{bankDetails.ifsc}</span></p>
                    <p>UPI ID: <span className="font-extrabold text-gray-900">{bankDetails.upiId}</span></p>
                  </div>
                   <div className="w-1/3 flex flex-col items-center">
                    {qrCodeUrl ? (
                      <Image src={qrCodeUrl} alt="QR Code" width={80} height={80} unoptimized />
                    ) : (
                      <div className="w-20 h-20 border border-fuchsia-400 flex items-center justify-center text-[8px] text-fuchsia-600 bg-white">
                        [QR CODE]
                      </div>
                    )}
                    <p className="text-[10px] px-5 mt-1 text-gray-700 font-semibold">Scan to Pay</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="totals-section w-4/12 flex flex-col items-end pt-4">
              <div className="w-full text-sm text-gray-800 font-bold bg-white rounded-md overflow-hidden border border-gray-300 shadow-lg">

                <div className="flex justify-between py-2 px-4 bg-gray-50 border-b border-gray-200">
                  <span className="font-extrabold text-gray-900">Amount without Tax</span>
                  <span className="font-extrabold text-gray-900">{formatCurrency(subtotal)}</span>
                </div>

                <div className="flex">
                  <div className="w-1/4 flex items-start justify-center pt-6 text-xs font-extrabold text-gray-800">
                    ADD
                  </div>
                  <div className="w-3/4 divide-y divide-fuchsia-100">
                    <div className="flex justify-between py-1.5 px-2">
                      <span className="font-semibold text-gray-700">CGST - 9%</span>
                      <span className="font-bold text-gray-800">{formatCurrency(cgstAmount)}</span>
                    </div>
                    <div className="flex justify-between py-1.5 px-2 border-b border-gray-300">
                      <span className="font-semibold text-gray-700">SGST - 9%</span>
                      <span className="font-bold text-gray-800">{formatCurrency(sgstAmount)}</span>
                    </div>
                  </div>
                </div>

                <div className="total-row final-total-box w-full py-2 px-4 flex justify-between bg-fuchsia-700 text-white font-extrabold text-lg relative overflow-hidden shadow-xl">
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                      backgroundSize: '10px 10px'
                    }}>
                  </div>
                  <span className="final-total-text z-10">Total Amount</span>
                  <span className="final-total-amount z-10">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-8 text-center text-gray-700">
                <div className="w-32 h-32 mx-auto border-4 border-purple-400 rounded-full flex items-center justify-center text-xs font-bold bg-white mb-2 p-2 shadow-inner">
                  {companySealUrl ? <Image src={companySealUrl} alt="Seal" width={128} height={128} className="rounded-full" unoptimized/> : '[COMPANY SEAL HERE]'}
                </div>
                <p className="font-bold text-lg text-fuchsia-600">Authorized Signature</p>
                <p className="text-sm text-gray-600">Thank you for your business!</p>
              </div>

            </div>
          </footer>

          <div className="mt-12 w-full">
            <div className="w-full bg-fuchsia-700 text-white font-bold text-center text-xl py-3 px-10">
              Terms and Conditions
            </div>

            <div className="px-10 py-4 bg-white border-b border-l border-r border-fuchsia-700/50">
              <ol className="list-decimal list-outside text-base ml-6 space-y-1 text-gray-900 font-semibold">
                {termPoints.map((point, index) => (
                  <li key={index} className="pl-2">{point}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
};

export function InvoicePreview({ invoice, template }: InvoicePreviewProps) {
  switch (template) {
    case 'classic':
      return <ClassicTemplate invoice={invoice} />;
    case 'modern':
      return <ModernTemplate invoice={invoice} />;
    default:
      return <DefaultTemplate invoice={invoice} />;
  }
}

    

    

    