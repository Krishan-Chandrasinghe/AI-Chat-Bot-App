import express from "express"
import { chatHandler } from "../controllers/chatController.ts";

const router = express.Router();

router.post('/', chatHandler);

export default router;