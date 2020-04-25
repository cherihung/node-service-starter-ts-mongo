import {LOG_FORMAT_TYPES} from './types';

export const LOG_FORMAT: LOG_FORMAT_TYPES = process.env.LOG_FORMAT as LOG_FORMAT_TYPES || 'combined';
