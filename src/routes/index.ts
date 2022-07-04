import Router from 'express';
import { handler as retryAllHandler } from './handlers/retry_all';
import { handler as retryResultHandler } from './handlers/retry_result';
import { handler as retryWhenHandler } from './handlers/retry_when';
import { handler as retryTypeHandler } from './handlers/retry_type';
import { handler as retryResultTypeHandler } from './handlers/retry_result_type';

import { defaultSuccessHandler, healthCheckHandler } from './handlers/common';

const router = Router();

router.get('/', defaultSuccessHandler);
router.get('/health', healthCheckHandler);
router.get('/retry_all', retryAllHandler)
router.get('/retry_result', retryResultHandler)
router.get('/retry_when', retryWhenHandler)
router.get('/retry_type', retryTypeHandler)
router.get('/retry_result_type', retryResultTypeHandler)

export default router;
