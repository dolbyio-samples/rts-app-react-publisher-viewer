export class TimeOutError extends Error {
  statusCode = 400;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, TimeOutError.prototype);
  }
}
