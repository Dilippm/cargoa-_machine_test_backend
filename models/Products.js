const mongoose = require('mongoose');
const User = require('./User');
const productSchema = new mongoose.Schema({
  productName: String,
  quantity: Number,
  date: String,
  shippingSchedule: String,
 
  documentName: String,
   
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
  },
  givenDates :[
    {
      date1: String,
      date2: String,
      date3: String,
    },
  ]
  
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;