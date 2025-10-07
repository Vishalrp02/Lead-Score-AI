import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("connected succesfully");
  })
  .catch((err) => {
    console.log(err);
  });

const offerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    value_props: { type: Array, required: true },
    ideal_use_cases: { type: Array, required: true },
  },
  { timestamps: true }
);

export const offerModel = mongoose.model("offerModel", offerSchema);
