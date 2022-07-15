import {
  circuitBreaker,
  handleAll,
  ConsecutiveBreaker,
  SamplingBreaker,
  CircuitBreakerPolicy,
  Event,
  CircuitState,
  IDisposable
} from 'cockatiel';

export enum BreakerType {
  sampling = 'sampling',
  consecutive = 'consecutive'
}

export class BreakerRequest {
  handler: CircuitBreakerPolicy;
  breakerType: BreakerType;
  isolateHandler: { dispose: () => void; };
  listeners: {
    [k: string]: IDisposable
  };

  constructor(breakerType: BreakerType) {
    this.breakerType = breakerType;
    this.listeners = {};

    switch (breakerType) {
      case BreakerType.sampling:
        // Break if more than 50% of requests fail in a 5 second time window:
        this.handler = circuitBreaker(handleAll, {
          halfOpenAfter: 2 * 1000, // after 2 seconds
          breaker: new SamplingBreaker({ threshold: 0.5, duration: 4 * 1000 }),
        })
        break;
      case BreakerType.consecutive:
        // Break if more than 5 requests in a row fail:
        this.handler = circuitBreaker(handleAll, {
          halfOpenAfter: 2 * 1000,
          breaker: new ConsecutiveBreaker(5),
        });
        break;
      default:
        throw new Error('Breaker type missing or not supported')
    }
  }

  onIsolateHold() {
    this.isolateHandler = this.handler.isolate();
  }

  onIsolateEnd() {
    this.isolateHandler.dispose();
  }

  onListen() {
    this.listeners.onBreak = this.handler.onBreak(() => {
      console.log(`${this.breakerType}:circuit is open`)
    });
    this.listeners.onHalfOpen = this.handler.onHalfOpen(() => {
      console.log(`${this.breakerType}: circuit is testing a request`)
    })
    this.listeners.onReset = this.handler.onReset(() => {
      console.log(`${this.breakerType}: circuit is closed`)
    })
    this.listeners.onFailure = this.handler.onFailure(({ duration, handled, reason }) => {
      console.log(`${this.breakerType}: circuit breaker call ran in ${duration}ms and failed`);
      // console.log('failed reason', reason);
      //console.log(handled ? 'error was handled' : 'error was not handled');
    });
    this.listeners.onSuccess = this.handler.onSuccess(({ duration }) => {
      console.log(`${this.breakerType}: circuit breaker call ran successfully in ${duration}ms`);
    })
    this.listeners.onStateChange = this.handler.onStateChange(state => {
      if (state === CircuitState.Closed) {
        // onReset, onHalfOpen, onBreak 
        console.log('circuit breaker is once again closed');
      }
    })
  }

  onListenDispose() {
    Object.keys(this.listeners).forEach((key: string) => {
      this.listeners[key].dispose()
    })
  }


}
