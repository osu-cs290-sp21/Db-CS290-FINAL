const mongoose = require("mongoose");

const testSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	price: Number,
});

module.exports = mongoose.model("Test", testSchema);
