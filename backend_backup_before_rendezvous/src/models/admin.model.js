import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new Schema(
	{
		username: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true
		},
		password: {
			type: String,
			required: true
		}
	},
	{
		timestamps: true,
	}
);

adminSchema.pre("save", async function () {
	if (!this.isModified("password")) return;
	this.password = await bcrypt.hash(this.password, 10)
})

adminSchema.methods.isPasswordCorrect = async function (password) {
	return await bcrypt.compare(password, this.password)
}

export const Admin = mongoose.model("Admin", adminSchema);