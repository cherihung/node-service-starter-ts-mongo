import Router from 'express';
import { handler as retryAllHandler } from './handlers/retry_all';
import { handler as retryResultHandler } from './handlers/retry_result';
import { handler as retryWhenHandler } from './handlers/retry_when';
import { handler as retryTypeHandler } from './handlers/retry_type';
import { handler as retryResultTypeHandler } from './handlers/retry_result_type';
import { handler as timeoutAggHandler } from './handlers/timeout_agg';
import { handler as timeoutCoopHandler } from './handlers/timeout_coop';
import { handler as breakerSamplingHandler } from './handlers/breaker_sampling';
import { handler as breakerConsecHandler } from './handlers/breaker_consecutive';

import { defaultSuccessHandler, healthCheckHandler } from './handlers/common';

const router = Router();

router.get('/', defaultSuccessHandler);
router.get('/health', healthCheckHandler);
router.get('/retry_all', retryAllHandler)
router.get('/retry_result', retryResultHandler)
router.get('/retry_when', retryWhenHandler)
router.get('/retry_type', retryTypeHandler)
router.get('/retry_result_type', retryResultTypeHandler)
router.get('/timeout_agg', timeoutAggHandler)
router.get('/timeout_coop', timeoutCoopHandler)
router.get('/breaker_sampling', breakerSamplingHandler)
router.get('/breaker_consecutive', breakerConsecHandler)

export default router;
