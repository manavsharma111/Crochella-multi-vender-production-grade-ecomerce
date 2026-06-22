const PDFDocument = require('pdfkit');
const path = require('path');

const generateInvoice = (order, res) => {
    // Create a new PDF document
    const doc = new PDFDocument({ size: 'A4', margin: 50 });

    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Invoice-${order._id.toString().slice(-6)}.pdf`);

    // Pipe its output to the response
    doc.pipe(res);

    // Header
    doc
        .fillColor('#444444')
        .fontSize(20)
        .text('Crochella Store', 50, 57)
        .fontSize(10)
        .text('Invoice for Order', 200, 50, { align: 'right' })
        .text(`#${order._id.toString().toUpperCase()}`, 200, 65, { align: 'right' })
        .text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 200, 80, { align: 'right' })
        .moveDown();

    doc.moveTo(50, 110).lineTo(550, 110).stroke();

    // Customer Information 
    doc
        .fontSize(12)
        .fillColor('#000000')
        .text('Bill To:', 50, 130)
        .fontSize(10)
        .fillColor('#444444')
        .text(order.userId.name || 'Customer', 50, 150)
        .text(order.userId.email || '', 50, 165)
        .text(order.shippingAddress.addressLine1, 50, 180)
        .text(`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.pincode}`, 50, 195)
        .text(`Phone: ${order.shippingAddress.phone}`, 50, 210)
        .moveDown()

    // Payment Information
    doc
        .fontSize(12)
        .fillColor('#000000')
        .text('Payment Info:', 300, 130)
        .fontSize(10)
        .fillColor('#444444')
        .text(`Method: ${order.paymentMethod}`, 300, 150)
        .text(`Status: ${order.paymentStatus}`, 300, 165)
        .text(`Shipping: Standard Delivery`, 300, 180)
        .moveDown()

    doc.moveTo(50, 240).lineTo(550, 240).stroke()

    // Table Headers
    let y = 260
    doc
        .fontSize(10)
        .fillColor('#000000')
        .text('Item', 50, y)
        .text('Quantity', 280, y, { width: 90, align: 'right' })
        .text('Unit Price', 370, y, { width: 90, align: 'right' })
        .text('Line Total', 470, y, { width: 80, align: 'right' })

    doc.moveTo(50, y + 15).lineTo(550, y + 15).stroke()
    y += 30

    // Table Rows
    doc.fillColor('#444444')
    order.products.forEach(item => {
        const productName = item.productId.productName || 'Product'
        const lineTotal = item.quantity * item.price
        
        doc
            .fontSize(10)
            .text(productName, 50, y, { width: 230 })
            .text(item.quantity.toString(), 280, y, { width: 90, align: 'right' })
            .text(`Rs. ${item.price.toLocaleString()}`, 370, y, { width: 90, align: 'right' })
            .text(`Rs. ${lineTotal.toLocaleString()}`, 470, y, { width: 80, align: 'right' })        
        y += 20
    })

    doc.moveTo(50, y + 10).lineTo(550, y + 10).stroke()
    y += 30

    // Totals
    const subtotal = order.totalPrice + (order.discountAmount || 0)
    doc
        .fillColor('#000000')
        .text('Subtotal:', 370, y, { width: 90, align: 'right' })
        .text(`Rs. ${subtotal.toLocaleString()}`, 470, y, { width: 80, align: 'right' })
    y += 20

    if (order.discountAmount > 0) {
        doc
            .text('Discount:', 370, y, { width: 90, align: 'right' })
            .text(`-Rs. ${order.discountAmount.toLocaleString()}`, 470, y, { width: 80, align: 'right' })
        y += 20;
    }

    doc
        .fontSize(12)
        .text('Total:', 370, y, { width: 90, align: 'right' })
        .text(`Rs. ${order.totalPrice.toLocaleString()}`, 470, y, { width: 80, align: 'right' })

    // Footer
    doc
        .fontSize(10)
        .fillColor('#444444')
        .text('Thank you for shopping with Crochella Store!', 50, 700, { align: 'center' })

    // Finalize the PDF 
    doc.end()
}

module.exports = { generateInvoice };
