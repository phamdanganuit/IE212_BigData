import { Schema, model } from "mongoose";

const RcvDataSchema = new Schema(
  {
    author: {
      type: String,
      required: true,
    },
    label: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
    },
  },
  {
    collection: "rcvdata",
  }
);

export const RcvData = model("RcvData", RcvDataSchema);
