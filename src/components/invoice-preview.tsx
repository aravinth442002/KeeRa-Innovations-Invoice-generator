
'use client';

import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/lib/data';
import AppLogo from './app-logo';
import Image from 'next/image';

type InvoicePreviewProps = {
  invoice: Omit<Invoice, 'amount' | 'status' | 'date'> & {
    amount: number;
    status: 'Draft' | 'Given' | 'Processing' | 'Received';
    date: string;
  };
};

// Helper to convert number to words. This is a simplified version.
// A more robust library would be needed for a production app.
function numberToWords(num: number): string {
    const a = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const b = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    
    if ((num = num.toString()).length > 9) return 'overflow';
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


export function InvoicePreview({ invoice }: InvoicePreviewProps) {
  const subtotal = invoice.lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.price || 0),
    0
  );
  const gstAmount = subtotal * 0.18; // Assuming 18% GST
  const grandTotal = subtotal + gstAmount;

  const totalQty = invoice.lineItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
  const totalInWords = numberToWords(Math.round(grandTotal));

  const bankDetails = invoice.seller?.bank || {};
  
  const MOCK_TERMS = [
      "Payment is due within 30 days.",
      "A late fee of 1.5% will be charged on overdue invoices.",
      "Please include the invoice number on your payment."
  ];

  const qrCodeUrl = bankDetails.upiId 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=upi://pay?pa=${bankDetails.upiId}&am=${grandTotal}&tn=Invoice${invoice.id}`
    : `https://api.qrserver.com/v1/create-qr-code/?size=85x85&data=Please-add-UPI-ID`;

  return (
    <div className="bg-white text-black text-[10px] w-[794px] min-h-[1123px] mx-auto my-0 p-6 font-sans border shadow-lg">
      <div className="bg-primary text-white font-bold text-center text-4xl py-2" style={{height: '48px', lineHeight: '32px'}}>
        TAX INVOICE
      </div>
      
      <table className="w-full border-collapse border border-primary -mt-px">
        <tbody>
          <tr>
            <td className="w-[45%] p-0 border-r border-primary align-top">
              <div className="flex items-center p-2">
                <div className="w-[70px] h-[70px] mr-2">
                    {/* Placeholder for Logo */}
                </div>
                <div>
                   <h1 className="text-4xl font-bold m-0 leading-none bg-clip-text text-transparent bg-primary-gradient">KeeRa</h1>
                   <p className="text-sm uppercase font-bold m-0 -mt-1 bg-clip-text text-transparent bg-primary-gradient">Innovations</p>
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

      {/* ITEMS TABLE */}
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
                {/* Filler rows */}
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

       {/* FOOTER */}
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
                                {label: 'Name', value: bankDetails.name},
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
                                            <div className="w-[85px] h-[85px] m-auto border border-primary flex items-center justify-center p-1">
                                                <Image src={qrCodeUrl} alt="QR Code" width={80} height={80} unoptimized />
                                            </div>
                                            <p className="font-bold text-xs pt-1">Pay with QR</p>
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
                        <div className="bg-primary text-white font-bold p-2 text-left -mt-px text-sm">For KeeRa Innovations</div>
                         <div className="h-[130px] text-center pt-4 border-x border-primary">
                            <div className="w-24 h-24 mx-auto mb-1 border border-primary rounded-full flex items-center justify-center text-xs font-bold">
                                {/* Seal Placeholder */}
                            </div>
                        </div>
                        <table className="w-full border-collapse border border-primary mt-[23px]">
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
}

    
