export type Result<T, E> = ResultSuccess<T> | ResultFailure<E>;

export class BaseResult<T, E> {
  constructor(public readonly data?: T, public readonly error?: E) {}

  isSuccess(): this is ResultSuccess<T> {
    // I don't test the data property because it could be undefined if no data are returned
    return this.error === undefined;
  }

  isFailure(): this is ResultFailure<E> {
    return this.error !== undefined;
  }
}

export class ResultSuccess<T> extends BaseResult<T, null> {
  constructor(public readonly data: T) {
    super(data);
  }
}

export class ResultFailure<E> extends BaseResult<null, E> {
  constructor(public readonly error: E) {
    super(undefined, error);
  }
}
