const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subscription',
      index: true
    },
    paystackInvoiceCode: { type: String, index: true },
    paystackReference: { type: String, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'NGN' },
    paid: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      index: true
    },
    paidAt: { type: Date },
    dueDate: { type: Date },
    rawEvent: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

const Invoice = mongoose.model('Invoice', invoiceSchema);
module.exports = Invoice;
