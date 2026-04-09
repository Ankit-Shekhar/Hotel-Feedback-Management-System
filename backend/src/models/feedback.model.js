import mongoose, { Schema } from "mongoose";

const feedbackSchema = new Schema(
	{
		hotelId: {
			type: Schema.Types.ObjectId,
			ref: "Hotel",
			required: true,
			index: true
		},
		userName: {
			type: String,
			required: true,
			trim: true
		},
		contact: {
			type: String,
			required: true,
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