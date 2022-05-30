import { HydratedDocument, Model, model, Schema } from "mongoose";
import { Nullable } from "../types";

interface IShortUrl {
  token: string;
  origin: string;
}

interface ShortUrlModel extends Model<IShortUrl> {
  createToken(token: string, origin: string): Promise<HydratedDocument<unknown, any, IShortUrl>>;
  findOneByToken(token: string): Promise<HydratedDocument<unknown, any, IShortUrl>>;
  findOneByOrigin(origin: string): Promise<HydratedDocument<unknown, any, IShortUrl>>;
}

const ShortUrl = new Schema<IShortUrl, ShortUrlModel>({
  token: String,
  origin: String,
}, { timestamps: true });

ShortUrl.statics.findOneByToken = function (token) {
  return this.findOne({
    token,
  }).exec();
};

ShortUrl.statics.findOneByOrigin = function (origin) {
  return this.findOne({
    origin,
  }).exec();
};

ShortUrl.statics.createToken = function (token, origin) {
  const shortUrl = new this({
    token,
    origin,
  });
  return shortUrl.save();
};

export default model<IShortUrl, ShortUrlModel>('ShortUrl', ShortUrl);