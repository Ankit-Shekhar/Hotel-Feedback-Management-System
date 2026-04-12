import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
	{
		hotelId: {
			type: Schema.Types.ObjectId,
			required: false,
			default: null,
			index: true
		},
		userName: {
			type: String,
			required: true,
			trim: true
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			default: null
		},
		contactNumber: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		contact: {
			type: String,
			required: false,
			index: true
		},
		ratings: {
			overall: {
				type: Number,
				min: 1,
				max: 5,
				required: true
			},
			food: {
				type: Number,
				min: 1,
				max: 5,
				required: true
			},
			service: {
				type: Number,
				min: 1,
				max: 5,
				required: true
			},
			ambience: {
				type: Number,
				min: 1,
				max: 5,
				required: true
			}
		},
		suggestion: {
			type: String,
			required: true,
			maxlength: 500
		}
	},
	{
		timestamps: true,
	}
);

export const Feedback = mongoose.model("Feedback", feedbackSchema);