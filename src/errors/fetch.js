/* eslint-disable max-classes-per-file */

/**
 * @class
 * @augments {Error}
 */
class AxiosTestError extends Error {
  constructor({
    message = 'Axios Test Error',
    config = '',
    code = '',
    request = '',
    response = '',
  }) {
    super(message);

    this.config = config;
    this.code = code;
    this.request = request;
    this.response = response;
    this.isAxiosError = true;
  }
}

/**
 * @class
 * @augments Error
 */
class UPSBrazilFetchServerError extends Error {
  /**
   * Creates an instance of UPSBrazilFetchServerError.
   *
   * @param {string} status Status Code passed from the server
   * @memberof UPSBrazilFetchServerError
   */
  constructor(status) {
    super(`Server error status ${status} `);
    this.name = 'UPSBrazilFetchServerError';
  }
}

/**
 * @class
 * @augments Error
 */
class UPSBrazilFetchClientError extends Error {
  /**
   * Creates an instance of UPSBrazilFetchClientError.
   *
   * @memberof UPSBrazilFetchClientError
   */
  constructor() {
    super('Client error');
    this.name = 'UPSBrazilFetchClientError';
  }
}

/**
 * @class
 * @augments Error
 */
class UPSBrazilFetchOtherError extends Error {
  /**
   * Creates an instance of UPSBrazilFetchOtherError.
   *
   * @memberof UPSBrazilFetchOtherError
   */
  constructor() {
    super('Other Error');
    this.name = 'UPSBrazilFetchOtherError';
  }
}

export {
  AxiosTestError,
  UPSBrazilFetchServerError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchOtherError,
};
