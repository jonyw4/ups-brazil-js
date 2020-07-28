import {
  UPSBrazilFetchOtherError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchServerError
} from '.';

describe('UPSBrazilFetchErrors', () => {
  it('should throw Error of type UPSBrazilFetchOtherError', () => {
    const t = () => {
      throw new UPSBrazilFetchOtherError('Erro', {});
    };
    expect(t).toThrow(UPSBrazilFetchOtherError);
  });

  it('should throw Error of type UPSBrazilFetchClientError', () => {
    const t = () => {
      throw new UPSBrazilFetchClientError('Client error', {}, '400', {});
    };
    expect(t).toThrow(UPSBrazilFetchClientError);
  });

  it('should throw Error of type UPSBrazilFetchServerError', () => {
    const t = () => {
      throw new UPSBrazilFetchServerError(
        'Client error',
        {},
        '400',
        {},
        {
          data: {},
          status: 500,
          statusText: 'Server Error',
          headers: {},
          config: {}
        }
      );
    };
    expect(t).toThrow(UPSBrazilFetchServerError);
  });
});
