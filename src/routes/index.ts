import Router from 'express';
import { handler as retryAllHandler } from './handlers/retry_all';
import { handler as retryResultHandler } from './handlers/retry_result';

import { defaultSuccessHandler, healthCheckHandler } from './handlers/common';

const router = Router();

router.get('/', defaultSuccessHandler);
router.get('/health', healthCheckHandler);
router.get('/retry_all', retryAllHandler)
router.get('/retry_result', retryResultHandler)

export default router;
