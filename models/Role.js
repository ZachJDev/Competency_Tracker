const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
    name: String,
    description: String,
    skills: [{type: mongoose.Schema.Types.ObjectId, ref: "skill"}]
})
const Role = mongoose.model("Role", roleSchema);
module.exports = Role