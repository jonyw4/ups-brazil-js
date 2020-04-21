import axios from 'axios';
import xml from 'xml';
import { parseStringPromise as parseXMLString } from 'xml2js';
import {
  UPSBrazilFetchOtherError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchServerError,
} from '../errors';

const URL_ENDPOINT = 'https://www.ups.com.br/upsbilling/UPS_Billing.asmx';

/**
 * @typedef {object} UPSBrazilPack
 * @property {number} weight Weight (kg)
 * @property {number} length Length (cm)
 * @property {number} height Height (cm)
 * @property {number} width Width (cm)
 */

/**
 * @typedef {object} UPSBrazilResponse
 * @property {number} CustoReais Price in BRL
 * @property {number} ValorDesconto Discount value
 * @property {number} ValorSeguro Insurance value
 * @property {number} ValorSeguro1 Insurance value
 * @property {number} ValorFrete Shipment price
 * @property {number} ValorFreteComSeguro Shipment price with insurance
 * @property {number} ValorEA ?
 * @property {number} FreteTotalReceber Total shipping price
 * @property {number} CentroDestino Destination distribution center
 * @property {number} ValorAR ?
 * @property {string} AcessoSistema System Access
 * @property {boolean} RetornoAreaRisco If it is dangerous area
 * @property {number} FreteSemImposto Shipment price without taxes
 * @property {number} ValorIcms ICMS value
 * @property {number} ValorPisCofins PIS/CONFINS Value
 * @property {number} TaxaDomestico ?
 */

/**
 * 💵 Get Quote for Shipping
 *
 * @module ups-brazil-js
 * @param {string} user User for auth
 * @param {string} password Password for auth
 * @param {string} originZipCode Origin ZipCode
 * @param {string} destinationZipCode Destination ZipCode
 * @param {UPSBrazilPack} packageData Box data for shipping
 * @param {string} invoiceValue Total money value of the items in shipment
 * @param {number} [timeout=5000] Timeout of the request
 * @returns {Promise.<UPSBrazilResponse, (Error)>}  Return the simulate quote data, or an error if rejected.
 */
export default async function (
  user,
  password,
  originZipCode,
  destinationZipCode,
  packageData,
  invoiceValue,
  timeout = 5000,
) {
  const data = [
    { nr_peso: packageData.weight },
    { nr_conta: user },
    { nr_cep_origem: originZipCode.match(/\d+/g).join('') },
    { nr_cep_destino: destinationZipCode.match(/\d+/g).join('') },
    { vl_valor_mercadoria: invoiceValue },
    { nr_quantidade_pacotes: 1 },
    { nm_cidade_origem: '' },
    { nm_cidade_destino: '' },
    {
      ds_dimencional: `${Math.round(packageData.height)}/${Math.round(
        packageData.width,
      )}/${Math.round(packageData.length)}`,
    },
    {
      autenticacao: [{ nr_conta: user }, { nr_chaveAcesso: password }],
    },
  ];

  const xmlString = xml(
    [
      {
        'soap:Envelope': [
          {
            _attr: {
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/',
            },
          },
          {
            'soap:Body': [
              {
                UPS_Retorno_Frete: [
                  {
                    _attr: {
                      xmlns: 'http://tempuri.org/',
                    },
                  },
                  {
                    ParametroFrete: data,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
    { declaration: true },
  );

  const headers = {
    SOAPAction: 'http://tempuri.org/UPS_Retorno_Frete',
    'Content-Type': 'text/xml; charset=utf-8',
  };

  /**
   * @ignore
   * @type {import('axios').Method}
   * */
  const method = 'POST';

  const params = {
    url: URL_ENDPOINT,
    method,
    timeout,
    headers,
    data: xmlString,
  };

  try {
    const { data: dataResponse } = await axios.request(params);
    const parsedData = await parseXMLString(dataResponse);
    const innerData = parsedData['soap:Envelope']['soap:Body'][0].UPS_Retorno_FreteResponse[0]
      .UPS_Retorno_FreteResult[0]['diffgr:diffgram'][0].NewDataSet[0]
      .Table[0];

    return {
      CustoReais: parseInt(innerData.CustoReais[0], 10),
      ValorDesconto: parseInt(innerData.ValorDesconto[0], 10),
      ValorSeguro: parseInt(innerData.ValorSeguro[0], 10),
      ValorSeguro1: parseInt(innerData.ValorSeguro1[0], 10),
      ValorFrete: parseInt(innerData.ValorFrete[0], 10),
      ValorFreteComSeguro: parseInt(innerData.ValorFreteComSeguro[0], 10),
      ValorEA: parseInt(innerData.ValorEA[0], 10),
      FreteTotalReceber: parseInt(innerData.FreteTotalReceber[0], 10),
      CentroDestino: parseInt(innerData.CentroDestino[0], 10),
      ValorAR: parseInt(innerData.ValorAR[0], 10),
      AcessoSistema: innerData.AcessoSistema[0],
      RetornoAreaRisco: innerData.RetornoAreaRisco[0] === 'S',
      FreteSemImposto: parseInt(innerData.FreteSemImposto[0], 10),
      ValorIcms: parseInt(innerData.ValorIcms[0], 10),
      ValorPisCofins: parseInt(innerData.ValorPisCofins[0], 10),
      TaxaDomestico: parseInt(innerData.TaxaDomestico[0], 10),
    };
  } catch (error) {
    // console.log(error);
    if (error.response) {
      throw new UPSBrazilFetchServerError(error.response.status);
    } else if (error.request) {
      throw new UPSBrazilFetchClientError();
    } else {
      throw new UPSBrazilFetchOtherError();
    }
  }
}
