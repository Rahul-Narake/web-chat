class ApiResponse {
  public statusCode: number = 200;
  public data: any = null;
  public message: string = '';
  public success: boolean = this.statusCode < 400;

  constructor(statusCode: number, data: any, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export { ApiResponse };
