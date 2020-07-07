// @ts-nocheck
import axios from 'axios';
import UPSBrazilCalculateQuote from './index';
import {
  AxiosTestError,
  UPSBrazilFetchServerError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchOtherError
} from '../errors';

jest.mock('axios');
axios.request.mockResolvedValue();

const xmlResponse =
  '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema"><soap:Body><UPS_Retorno_FreteResponse xmlns="http://tempuri.org/"><UPS_Retorno_FreteResult><xs:schema id="NewDataSet" xmlns="" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:msdata="urn:schemas-microsoft-com:xml-msdata"><xs:element name="NewDataSet" msdata:IsDataSet="true" msdata:UseCurrentLocale="true"><xs:complexType><xs:choice minOccurs="0" maxOccurs="unbounded"><xs:element name="Table"><xs:complexType><xs:sequence><xs:element name="CustoReais" type="xs:string" minOccurs="0" /><xs:element name="ValorDesconto" type="xs:string" minOccurs="0" /><xs:element name="ValorSeguro" type="xs:string" minOccurs="0" /><xs:element name="ValorSeguro1" type="xs:string" minOccurs="0" /><xs:element name="ValorFrete" type="xs:string" minOccurs="0" /><xs:element name="ValorFreteComSeguro" type="xs:string" minOccurs="0" /><xs:element name="ValorEA" type="xs:string" minOccurs="0" /><xs:element name="FreteTotalReceber" type="xs:string" minOccurs="0" /><xs:element name="CentroOrigem" type="xs:string" minOccurs="0" /><xs:element name="CentroDestino" type="xs:string" minOccurs="0" /><xs:element name="ValorAR" type="xs:double" minOccurs="0" /><xs:element name="AcessoSistema" type="xs:string" minOccurs="0" /><xs:element name="RetornoAreaRisco" type="xs:string" minOccurs="0" /><xs:element name="FreteSemImposto" type="xs:double" minOccurs="0" /><xs:element name="ValorIcms" type="xs:double" minOccurs="0" /><xs:element name="ValorPisCofins" type="xs:double" minOccurs="0" /><xs:element name="TaxaDomestico" type="xs:double" minOccurs="0" /></xs:sequence></xs:complexType></xs:element></xs:choice></xs:complexType></xs:element></xs:schema><diffgr:diffgram xmlns:msdata="urn:schemas-microsoft-com:xml-msdata" xmlns:diffgr="urn:schemas-microsoft-com:xml-diffgram-v1"><NewDataSet xmlns=""><Table diffgr:id="Table1" msdata:rowOrder="0"><CustoReais>130.18</CustoReais><ValorDesconto>78.11</ValorDesconto><ValorSeguro>1.52</ValorSeguro><ValorSeguro1>1.52</ValorSeguro1><ValorFrete>52.07</ValorFrete><ValorFreteComSeguro>53.59</ValorFreteComSeguro><ValorEA>59.17</ValorEA><FreteTotalReceber>112.76</FreteTotalReceber><CentroDestino>9999</CentroDestino><ValorAR>0</ValorAR><AcessoSistema>Liberado</AcessoSistema><RetornoAreaRisco>N</RetornoAreaRisco><FreteSemImposto>102.52</FreteSemImposto><ValorIcms>17.21</ValorIcms><ValorPisCofins>10.45</ValorPisCofins><TaxaDomestico>0</TaxaDomestico></Table></NewDataSet></diffgr:diffgram></UPS_Retorno_FreteResult></UPS_Retorno_FreteResponse></soap:Body></soap:Envelope>';

describe('UPSBrazil.fetch()', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should fetch a GET request successfully from UPS Brazil API', async () => {
    axios.request.mockImplementationOnce(() =>
      Promise.resolve({
        data: xmlResponse
      })
    );
    const response = await UPSBrazilCalculateQuote(
      'u',
      'p',
      '12608220',
      '28695000',
      {
        height: 11,
        length: 20,
        width: 30,
        weight: 0.14
      },
      200,
      20000
    );

    expect(response).toEqual({
      CustoReais: 130,
      ValorDesconto: 78,
      ValorSeguro: 1,
      ValorSeguro1: 1,
      ValorFrete: 52,
      ValorFreteComSeguro: 53,
      ValorEA: 59,
      FreteTotalReceber: 112,
      CentroDestino: 9999,
      ValorAR: 0,
      AcessoSistema: 'Liberado',
      RetornoAreaRisco: false,
      FreteSemImposto: 102,
      ValorIcms: 17,
      ValorPisCofins: 10,
      TaxaDomestico: 0
    });
    expect(axios.request).toHaveBeenCalledTimes(1);
    expect(axios.request).toHaveBeenCalledWith({
      url: 'https://www.ups.com.br/upsbilling/UPS_Billing.asmx',
      method: 'POST',
      data:
        '<?xml version="1.0" encoding="UTF-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><UPS_Retorno_Frete xmlns="http://tempuri.org/"><ParametroFrete><nr_peso>0.14</nr_peso><nr_conta>u</nr_conta><nr_cep_origem>12608220</nr_cep_origem><nr_cep_destino>28695000</nr_cep_destino><vl_valor_mercadoria>200</vl_valor_mercadoria><nr_quantidade_pacotes>1</nr_quantidade_pacotes><nm_cidade_origem></nm_cidade_origem><nm_cidade_destino></nm_cidade_destino><ds_dimencional>11/30/20</ds_dimencional><autenticacao><nr_conta>u</nr_conta><nr_chaveAcesso>p</nr_chaveAcesso></autenticacao></ParametroFrete></UPS_Retorno_Frete></soap:Body></soap:Envelope>',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        SOAPAction: 'http://tempuri.org/UPS_Retorno_Frete'
      },
      timeout: 20000
    });
  });

  it('should fetch an UPSBrazilOtherError from UPS Brazil API', async () => {
    axios.request.mockRejectedValue(new AxiosTestError({}));
    const fetch = UPSBrazilCalculateQuote(
      'u',
      'p',
      '12608220',
      '28695000',
      {
        height: 11,
        length: 20,
        width: 30,
        weight: 0.14
      },
      200,
      20000
    );
    await expect(fetch).rejects.toThrow(UPSBrazilFetchOtherError);
  });

  it('should fetch an UPSBrazilFetchClientError from UPS Brazil API', async () => {
    axios.request.mockRejectedValue(new AxiosTestError({ request: {} }));
    const fetch = UPSBrazilCalculateQuote(
      'u',
      'p',
      '12608220',
      '28695000',
      {
        height: 11,
        length: 20,
        width: 30,
        weight: 0.14
      },
      200,
      20000
    );
    await expect(fetch).rejects.toThrow(UPSBrazilFetchClientError);
  });

  it('should fetch an UPSBrazilFetchServerError from UPS Brazil API', async () => {
    axios.request.mockRejectedValue(
      new AxiosTestError({ response: { status: 404 } })
    );
    const fetch = UPSBrazilCalculateQuote(
      'u',
      'p',
      '12608220',
      '28695000',
      {
        height: 11,
        length: 20,
        width: 30,
        weight: 0.14
      },
      200,
      20000
    );
    await expect(fetch).rejects.toThrow(UPSBrazilFetchServerError);
  });
});
