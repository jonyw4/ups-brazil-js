import axios from 'axios';
import xml from 'xml';
import {
  UPSBrazilFetchOtherError,
  UPSBrazilFetchClientError,
  UPSBrazilFetchServerError,
} from '../errors';

const URL_ENDPOINT = 'https://www.ups.com.br/upsbilling/UPS_Billing.asmx';
const URL_WSDL = `${URL_ENDPOINT}?WSDL`;
const WSDL_ACTION = 'UPS_Retorno_Frete';

/**
 * @typedef {object} UPSBrazilPack
 * @property {number} weight Weight (kg)
 * @property {number} length Length (cm)
 * @property {number} height Height (cm)
 * @property {number} width Width (cm)
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
 * @returns {Promise.<any, (Error)>}  Return the simulate quote data, or an error if rejected.
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
  const data = {
    ParametroFrete: {
      nr_peso: packageData.weight,
      nr_conta: user,
      nr_cep_origem: originZipCode.match(/\d+/g).join(''),
      nr_cep_destino: destinationZipCode.match(/\d+/g).join(''),
      vl_valor_mercadoria: invoiceValue,
      nr_quantidade_pacotes: 1,
      nm_cidade_origem: '',
      nm_cidade_destino: '',
      ds_dimencional: `${Math.round(packageData.height)}/${Math.round(
        packageData.width,
      )}/${Math.round(packageData.length)}`,
      autenticacao: {
        nr_conta: user,
        nr_chaveAcesso: password,
      },
    },
  };

  const headers = {
    SOAPAction: `${URL_WSDL}#${WSDL_ACTION}`,
    'Content-Type': 'text/xml;charset=UTF-8',
  };

  try {
    const response = await axios({
      url: URL_ENDPOINT,
      method: 'POST',
      timeout,
      headers,
      data: xml(data),
    });
    return response.data;
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
