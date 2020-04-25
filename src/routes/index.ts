import Router from 'express';

import {defaultSuccessHandler, healthCheckHandler} from './handlers/common';

const router = Router();

router.get('/', defaultSuccessHandler);
router.get('/health', healthCheckHandler);

export default router;
