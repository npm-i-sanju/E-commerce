import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            index: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
            min: [0, "Price cannot be negative"],
        },
        discountPrice: {
            type: Number,
            min: [0, "Discount price cannot be negative"],
            default: 0,
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
            trim: true,
            lowercase: true,
        },
        brand: {
            type: String,
            trim: true,
            lowercase: true,
        },
        stock: {
            type: Number,
            required: [true, "Stock quantity is required"],
            min: [0, "Stock cannot be negative"],
            default: 0,
        },
        images: [
            {
                type: String, // store image URLs or file paths
            },
        ],
        ratings: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        numReviews: {
            type: Number,
            default: 0,
        },
        reviews: [reviewSchema],
        isFeatured: {
            type: Boolean,
            default: false,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Auto-calculate average rating before saving
productSchema.pre("save", async function () {
    if (this.reviews.length === 0) {
        this.ratings = 0;
        this.numReviews = 0;
        return;
    }

    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.ratings = parseFloat((totalRating / this.reviews.length).toFixed(1));
    this.numReviews = this.reviews.length;
});

export const Product = mongoose.model("Product", productSchema);