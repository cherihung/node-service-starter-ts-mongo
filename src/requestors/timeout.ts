import { TimeoutStrategy, timeout, TimeoutPolicy, Event } from 'cockatiel';

export enum PolicyType {
  cooperative = 'Cooperative',
  aggressive = 'Aggressive'
}
export class TimeoutRequest {
  handler: TimeoutPolicy;
  policyType: PolicyType;
  timeoutMS: number;

  constructor(policyType: PolicyType, timeoutMS?: number) {
    this.policyType = policyType;
    this.timeoutMS = timeoutMS || 2000;

    switch (policyType) {
      case PolicyType.cooperative:
        this.handler = timeout(this.timeoutMS, TimeoutStrategy.Cooperative);
        break;
      case PolicyType.aggressive:
        this.handler = timeout(this.timeoutMS, TimeoutStrategy.Aggressive);
        break;
      default:
        throw new Error('Timeout Policy type missing or not supported')
    }
  }

  onListen() {
    Event.once(this.handler.onTimeout, () => {
      console.log('timeout count begin...')
    });

    Event.once(this.handler.onSuccess, ({ duration }) => {
      console.log('call succeeded in:', duration)
    })

    Event.once(this.handler.onFailure, (({ duration, handled, reason }) => {
      console.log(`call failed in ${duration}`, reason);
      console.log(handled ? 'error was handled' : 'error was not handled');
    }))
  }
}