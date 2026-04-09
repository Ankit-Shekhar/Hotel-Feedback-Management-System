import mongoose, { Schema } from "mongoose";

const hotelSchema = new Schema(
	{
		name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			index: true
		},
		city: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		state: {
			type: String,
			required: true,
			trim: true,
			index: true
		},
		photoUrl: {
			type: String,
			default: ''
		},
		photoPublicId: {
			type: String,
			default: ''
		},
		ratingsSummary: {
			overall: {
				type: Number,
				default: 0
			},
			food: {
				type: Number,
				default: 0
			},
			service: {
				type: Number,
				default: 0
			},
			ambience: {
				type: Number,
				default: 0
			}
		},
		totalReviews: {
			type: Number,
			default: 0
		}
	},
	{
		timestamps: true,
	}
);

export const Hotel = mongoose.model("Hotel", hotelSchema);