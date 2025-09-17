const qrcode = require('qrcode');
const billModel = require("../models/billModel");
const responseHandler = require("../utils/responseHandler");

// Step 1: Initiate the checkout
const initiateCheckout = async (req, res) => {
    try {
        const payload = { ...req.body, created_by: req.user.id };
        
        // This creates a 'pending' bill but does NOT deduct stock yet
        const newBill = await billModel.createBill(payload);
        
        // Data to be embedded in the QR code
        const qrData = {
            billId: newBill.id,
            totalAmount: payload.total_amount,
            customer: req.user.username,
        };

        // Generate a QR code as a Data URL
        const qrCodeImage = await qrcode.toDataURL(JSON.stringify(qrData));
        
        responseHandler.send({ res, result: { statusCode: 201, data: { billId: newBill.id, qrCodeImage } } });

    } catch (error) {
        responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
    }
};

// Step 2: Confirm the payment and finalize the order
const confirmPayment = async (req, res) => {
    try {
        const { billId } = req.params;
        const { products } = req.body; // Pass products from the frontend cart

        // This function will update the bill status to 'paid' and deduct stock
        await billModel.finalizeBillAndDeductStock(billId, products);

        responseHandler.send({ res, result: { message: "Payment confirmed and order finalized." } });
    } catch (error) {
        // Handle custom error for insufficient stock
        if (error.message.startsWith('Insufficient stock')) {
            return responseHandler.send({ res, result: { statusCode: 409, message: error.message, error: error.message } });
        }
        responseHandler.send({ res, result: { statusCode: 500, error: error.message } });
    }
};

module.exports = {
    initiateCheckout,
    confirmPayment,
};