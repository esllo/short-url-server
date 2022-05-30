import { Router } from "express";
import generate from './generate';
import redirect from './redirect';

const router = Router();

router.use(generate);
router.use(redirect);

export default router;