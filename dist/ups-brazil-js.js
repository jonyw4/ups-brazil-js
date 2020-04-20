(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('axios'), require('xml'), require('xml2js')) :
  typeof define === 'function' && define.amd ? define(['axios', 'xml', 'xml2js'], factory) :
  (global = global || self, global.UPSBrazil = factory(global.axios, global.xml, global.xml2js));
}(this, (function (axios, xml, xml2js) { 'use strict';

  axios = axios && Object.prototype.hasOwnProperty.call(axios, 'default') ? axios['default'] : axios;
  xml = xml && Object.prototype.hasOwnProperty.call(xml, 'default') ? xml['default'] : xml;

  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }

    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }

  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
          args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);

        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }

        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }

        _next(undefined);
      });
    };
  }

  /* eslint-disable max-classes-per-file */
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
      super("Server error status ".concat(status, " "));
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

  var URL_ENDPOINT = 'https://www.ups.com.br/upsbilling/UPS_Billing.asmx';
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

  function UPSBrazil (_x, _x2, _x3, _x4, _x5, _x6) {
    return _ref.apply(this, arguments);
  }

  function _ref() {
    _ref = _asyncToGenerator(function* (user, password, originZipCode, destinationZipCode, packageData, invoiceValue) {
      var timeout = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 5000;
      var data = [{
        nr_peso: packageData.weight
      }, {
        nr_conta: user
      }, {
        nr_cep_origem: originZipCode.match(/\d+/g).join('')
      }, {
        nr_cep_destino: destinationZipCode.match(/\d+/g).join('')
      }, {
        vl_valor_mercadoria: invoiceValue
      }, {
        nr_quantidade_pacotes: 1
      }, {
        nm_cidade_origem: ''
      }, {
        nm_cidade_destino: ''
      }, {
        ds_dimencional: "".concat(Math.round(packageData.height), "/").concat(Math.round(packageData.width), "/").concat(Math.round(packageData.length))
      }, {
        autenticacao: [{
          nr_conta: user
        }, {
          nr_chaveAcesso: password
        }]
      }];
      var xmlString = xml([{
        'soap:Envelope': [{
          _attr: {
            'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
            'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
            'xmlns:soap': 'http://schemas.xmlsoap.org/soap/envelope/'
          }
        }, {
          'soap:Body': [{
            UPS_Retorno_Frete: [{
              _attr: {
                xmlns: 'http://tempuri.org/'
              }
            }, {
              ParametroFrete: data
            }]
          }]
        }]
      }], {
        declaration: true
      });
      var headers = {
        SOAPAction: 'http://tempuri.org/UPS_Retorno_Frete',
        'Content-Type': 'text/xml; charset=utf-8'
      };
      var params = {
        url: URL_ENDPOINT,
        method: 'POST',
        timeout,
        headers,
        data: xmlString
      };

      try {
        var {
          data: dataResponse
        } = yield axios(params);
        var parsedData = yield xml2js.parseStringPromise(dataResponse);
        var innerData = parsedData['soap:Envelope']['soap:Body'][0].UPS_Retorno_FreteResponse[0].UPS_Retorno_FreteResult[0]['diffgr:diffgram'][0].NewDataSet[0].Table[0];
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
    });
    return _ref.apply(this, arguments);
  }

  /**
   * @module ups-brazil-js
   */

  return UPSBrazil;

})));
