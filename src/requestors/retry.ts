import { retry, handleAll, handleWhenResult, ExponentialBackoff, RetryPolicy, handleResultType, handleType, handleWhen, Event } from 'cockatiel';
import type { Response as SgResponse } from 'superagent'
import type { Response as ExpResponse } from 'express'
import { ApiRemoteError } from '../helpers/errorHelper'

export enum PolicyType {
  handleAll = 'handleAll',
  handleResult = 'handleResult',
  handleWhen = 'handleWhen',
  handleType = 'handleType',
  handleResultType = 'handleResultType'
}

const retryOptions = { maxAttempts: 1, backoff: new ExponentialBackoff() }

export class RetryRequest {
  handler: RetryPolicy;
  policyType: PolicyType;

  constructor(policyType: PolicyType) {
    this.policyType = policyType;

    switch (policyType) {
      case PolicyType.handleAll:
        this.handler = retry(handleAll, retryOptions)
        break;
      case PolicyType.handleResult: {
        const policy = handleWhenResult((res: any) => {
          // handle superagent.response or express entire res when errored (res)
          const upstreamResponse: SgResponse | ExpResponse = res.response || res;
          return upstreamResponse.statusCode === 404
        })
        this.handler = retry(policy, retryOptions);
        break;
      }
      case PolicyType.handleWhen: {
        // do not retry ReferenceError or SyntaxError for example
        const policy = handleWhen(err => {
          return !(err instanceof SyntaxError) && !(err instanceof ReferenceError)
        })
        this.handler = retry(policy, retryOptions);
        break;
      }
      case PolicyType.handleType: {
        this.handler = retry(handleType(Error), retryOptions);
        break;
      }
      case PolicyType.handleResultType: {
        this.handler = retry(handleResultType(ApiRemoteError), retryOptions);
        break;
      }
      default:
        throw new Error('Retry Policy type missing or not supported')
    }
  }

  onListen() {
    Event.once(this.handler.onRetry, () => {
      console.log(`${this.policyType}:retrying...`)
    });
    Event.once(this.handler.onFailure, (reason) => {
      console.log(`${this.policyType}:failing...`, reason)
    });
    Event.once(this.handler.onGiveUp, (reason: any) => {
      console.log(`${this.policyType}:giving up...`)
      // reason.value returned by retry_result and retry_result_type
      const giveUpError = reason.value || reason.error;
      // throwing the error/reason for api route to handle client response
      throw giveUpError
    });
    Event.once(this.handler.onSuccess, (reason) => {
      console.log(`${this.policyType}:success!`, reason)
    });
  }


}
