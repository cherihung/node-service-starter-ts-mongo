import express from 'express';

import {defaultSuccessHandler, healthCheckHandler} from './handlers/common.js';

const router = new express.Router();

router.get('/', defaultSuccessHandler);
router.get('/health', healthCheckHandler);

export default router;
