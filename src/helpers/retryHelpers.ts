import { retry, handleAll, handleWhenResult, ExponentialBackoff, RetryPolicy } from 'cockatiel';
import { Response } from 'express';

export enum PolicyType {
  handleAll = 'handleAll',
  handleResult = 'handleResult'
}

export class RetryRequest {
  retryHandler: RetryPolicy;
  policyType: PolicyType;

  constructor(policyType: PolicyType) {
    this.policyType = policyType;
    if (policyType === PolicyType.handleAll) {
      this.retryHandler = retry(handleAll, { maxAttempts: 3, backoff: new ExponentialBackoff() })
    } else if (policyType === PolicyType.handleResult) {
      const policy = handleWhenResult((res: any) => {
        // handle superagent.response or express entire res when errored (res)
        const upstreamResponse = res.response || res;
        return upstreamResponse.statusCode === 404
      })
      this.retryHandler = retry(policy, { maxAttempts: 1, backoff: new ExponentialBackoff() })
    } else {
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
    this.retryHandler.onGiveUp((reason) => {
      console.log(`${this.policyType}:giving up...`)
      // throwing the error/reason for api route to handle client response
      throw reason
    });
    this.retryHandler.onSuccess(() => {
      console.log(`${this.policyType}:success!`)
    });
  }

}
