import axios, { Method, AxiosError } from 'axios';
import xml from 'xml';
import { parseStringPromise as parseXMLString } from 'xml2js';
import { UPSBrazilPack } from '../types';
import {
  UPSBrazilFetchOtherError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchServerError
} from '../errors';

const URL_ENDPOINT = 'https://www.ups.com.br/upsbilling/UPS_Billing.asmx';

function sanitizePostalCode(postalCode: string) {
  return postalCode.toString().replace(/\D+/g, '');
}

/**
 * 💵 Get Quote for Shipping
 *
 * @param user User for auth
 * @param password Password for auth
 * @param originZipCode Origin ZipCode
 * @param destinationZipCode Destination ZipCode
 * @param packageData Box data for shipping
 * @param invoiceValue Total money value of the items in shipment
 * @param timeout Timeout of the request
 */
export default async function UPSBrazil(
  user: string,
  password: string,
  originZipCode: string,
  destinationZipCode: string,
  packageData: UPSBrazilPack,
  invoiceValue: number,
  timeout = 5000
) {
  const data = [
    { nr_peso: packageData.weight },
    { nr_conta: user },
    { nr_cep_origem: sanitizePostalCode(originZipCode) },
    { nr_cep_destino: sanitizePostalCode(destinationZipCode) },
    { vl_valor_mercadoria: invoiceValue },
    { nr_quantidade_pacotes: 1 },
    { nm_cidade_origem: '' },
    { nm_cidade_destino: '' },
    {
      ds_dimencional: `${Math.round(packageData.height)}/${Math.round(
        packageData.width
      )}/${Math.round(packageData.length)}`
    },
    {
      autenticacao: [{ nr_conta: user }, { nr_chaveAcesso: password }]
    }
  ];

  const xmlString = xml(
    [
      {
        'soap:Envelope': [
          {
            _attr: {
              'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
              'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
              'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
            }
          },
          {
            'soap:Body': [
              {
                UPS_Retorno_Frete: [
                  {
                    _attr: {
                      xmlns: 'http://tempuri.org/'
                    }
                  },
                  {
                    ParametroFrete: data
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    { declaration: true }
  );

  return axios
    .request({
      url: URL_ENDPOINT,
      method: 'POST',
      timeout,
      headers: {
        SOAPAction: 'http://tempuri.org/UPS_Retorno_Frete',
        'Content-Type': 'text/xml; charset=utf-8'
      },
      data: xmlString
    })
    .then(async (response) => {
      const parsedData = await parseXMLString(response.data);
      const innerData =
        parsedData['soap:Envelope']['soap:Body'][0].UPS_Retorno_FreteResponse[0]
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
        TaxaDomestico: parseInt(innerData.TaxaDomestico[0], 10)
      };
    })
    .catch((error: AxiosError<any>) => {
      if (error.response) {
        throw new UPSBrazilFetchServerError(
          error.message,
          error.config,
          error.code,
          error.request,
          error.response
        );
      } else if (error.request) {
        throw new UPSBrazilFetchClientError(
          error.message,
          error.config,
          error.code,
          error.request
        );
      } else {
        throw new UPSBrazilFetchOtherError(error.message, error.config);
      }
    });
}
