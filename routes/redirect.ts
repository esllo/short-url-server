import { Request, Response, Router } from "express";
import ShortUrl from "../models/ShortUrl";

async function redirect(request: Request, response: Response) {
  const { path } = request;
  const token = path.substring(1);
  const shortUrl = await ShortUrl.findOneByToken(token);
  if (shortUrl) {
    response.redirect(shortUrl.origin);
  } else {
    response.status(404).json({ message: 'token not exists', status: 404 });
  }
}

const router = Router();
router.get(/^\/[a-zA-Z1-9]{4,10}$/, redirect);

export default router;