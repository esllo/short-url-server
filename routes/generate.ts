import { Request, Response, Router } from "express";
import ShortUniqueId from "short-unique-id";
import ShortUrl from "../models/ShortUrl";
import { isValidURL } from "../utils/url";

const base58chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'.split('');

const uuid = new ShortUniqueId({ length: 7, dictionary: base58chars });

async function generateUrl(request: Request, response: Response) {
  const { url } = request.body;
  if (url && isValidURL(url)) {
    let token: string;
    let attempt: number = 0;
    const origin = await ShortUrl.findOneByOrigin(url);
    if (origin) {
      response.status(200).json({
        status: 200,
        token: origin.token,
        generated: `${request.hostname}${origin.token}`,
        origin: origin.origin,
      });
    } else {
      for (; ;) {
        token = uuid();
        const exists = await ShortUrl.findOneByToken(token);
        if (!exists) {
          const created = await ShortUrl.createToken(token, url);
          if (created) {
            response.status(200).json({
              status: 200,
              token: created.token,
              generated: `${request.hostname}${created.token}`,
              origin: created.origin,
            });
            break;
          }
        }
        attempt++;
        if (attempt >= 20) {
          response.status(406);
          response.json({
            message: 'failed to generate token',
            status: 406,
          });
          break;
        }
      }
    }
  } else {
    response.status(400).json({
      status: 400,
      message: 'invalid url served'
    });
  }
}

const router = Router();
router.post('/generate', generateUrl);

export default router;