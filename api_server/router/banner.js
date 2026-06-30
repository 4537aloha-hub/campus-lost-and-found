import express from 'express';
const router = express.Router();

import { getHomeBannerHandler } from '../router_handle/banner.js'

router.get('/list', getHomeBannerHandler)

export default router
