class AxiosTestError extends Error {
  config: any;
  code: any;
  request: any;
  response: any;
  isAxiosError: boolean;
  constructor({
    message = 'Axios Test Error',
    config = '',
    code = '',
    request = '',
    response = ''
  }: {
    message?: any;
    config?: any;
    code?: any;
    request?: any;
    response?: any;
    isAxiosError?: boolean;
  }) {
    super(message);

    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isAxiosError = true;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class UPSBrazilFetchServerError extends Error {
  /**
   * Creates an instance of UPSBrazilFetchServerError.
   *
   * @param status Status Code passed from the server
   */
  constructor(status: number) {
    super(`Server error status ${status} `);
    this.name = 'UPSBrazilFetchServerError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class UPSBrazilFetchClientError extends Error {
  /**
   * Creates an instance of UPSBrazilFetchClientError.
   */
  constructor() {
    super('Client error');
    this.name = 'UPSBrazilFetchClientError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

class UPSBrazilFetchOtherError extends Error {
  /**
   * Creates an instance of UPSBrazilFetchOtherError.
   */
  constructor() {
    super('Other Error');
    this.name = 'UPSBrazilFetchOtherError';
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export {
  AxiosTestError,
  UPSBrazilFetchServerError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchOtherError
};
