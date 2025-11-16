const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  phone: String,
  address: String,
  gstin: String,
});

// This will add a virtual 'id' property that gets the '_id'
clientSchema.virtual('id').get(function(){
    return this._id.toHexString();
});

clientSchema.set('toJSON', {
    virtuals: true
});


module.exports = mongoose.model("Client", clientSchema);

    