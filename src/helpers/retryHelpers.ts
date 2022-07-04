import { retry, handleAll, handleWhenResult, ExponentialBackoff, RetryPolicy, handleResultType, handleType, handleWhen } from 'cockatiel';
import type { Response as SgResponse } from 'superagent'
import type { Response as ExpResponse } from 'express'
import { ApiRemoteError } from './errorHelper'

export enum PolicyType {
  handleAll = 'handleAll',
  handleResult = 'handleResult',
  handleWhen = 'handleWhen',
  handleType = 'handleType',
  handleResultType = 'handleResultType'
}

const retryOptions = { maxAttempts: 1, backoff: new ExponentialBackoff() }

export class RetryRequest {
  retryHandler: RetryPolicy;
  policyType: PolicyType;

  constructor(policyType: PolicyType) {
    this.policyType = policyType;
    switch (policyType) {
      case PolicyType.handleAll:
        this.retryHandler = retry(handleAll, retryOptions)
        break;
      case PolicyType.handleResult: {
        const policy = handleWhenResult((res: any) => {
          // handle superagent.response or express entire res when errored (res)
          const upstreamResponse: SgResponse | ExpResponse = res.response || res;
          return upstreamResponse.statusCode === 404
        })
        this.retryHandler = retry(policy, retryOptions);
        break;
      }
      case PolicyType.handleWhen: {
        // do not retry ReferenceError or SyntaxError for example
        const policy = handleWhen(err => {
          return !(err instanceof SyntaxError) && !(err instanceof ReferenceError)
        })
        this.retryHandler = retry(policy, retryOptions);
        break;
      }
      case PolicyType.handleType: {
        this.retryHandler = retry(handleType(Error), retryOptions);
        break;
      }
      case PolicyType.handleResultType: {
        const policy = handleResultType(ApiRemoteError)
        this.retryHandler = retry(policy, retryOptions);
        break;
      }
      default:
        throw new Error('Policy type missing or not supported')
    }
  }

  onListen() {
    this.retryHandler.onRetry(() => {
      console.log(`${this.policyType}:retrying...`)
    });
    this.retryHandler.onFailure((reason) => {
      console.log(`${this.policyType}:failing...`, reason)
    });
    this.retryHandler.onGiveUp((reason: any) => {
      console.log(`${this.policyType}:giving up...`)
      // reason.value returned by retry_result and retry_result_type
      const giveUpError = reason.value || reason.error;
      // throwing the error/reason for api route to handle client response
      throw giveUpError
    });
    this.retryHandler.onSuccess((reason) => {
      console.log(`${this.policyType}:success!`, reason)
    });
  }

}
