import {
  UPSBrazilFetchOtherError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchServerError,
} from '.';

describe('UPSBrazilFetchErrors', () => {
  it('should throw Error of type UPSBrazilFetchOtherError', () => {
    const t = () => {
      throw new UPSBrazilFetchOtherError();
    };
    expect(t).toThrow(UPSBrazilFetchOtherError);
  });

  it('should throw Error of type UPSBrazilFetchClientError', () => {
    const t = () => {
      throw new UPSBrazilFetchClientError();
    };
    expect(t).toThrow(UPSBrazilFetchClientError);
  });

  it('should throw Error of type UPSBrazilFetchServerError', () => {
    const t = () => {
      throw new UPSBrazilFetchServerError(404);
    };
    expect(t).toThrow(UPSBrazilFetchServerError);
  });
});
