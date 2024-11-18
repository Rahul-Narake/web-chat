class ApiError extends Error {
  public statusCode: number = 400;
  public data: any = null;
  public message: string = '';
  public errors: any[] = [];
  public stack: string = '';
  public success: boolean = false;
  constructor(
    statusCode: number,
    message = 'Something went wrong, Try again later',
    errors = [],
    stack = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = statusCode < 400;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
