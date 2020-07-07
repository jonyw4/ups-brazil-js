export interface UPSBrazilPack {
  /** Weight (kg) */
  weight: number;
  /** Length (cm)  */
  length: number;
  /** Height (cm) */
  height: number;
  /** Width (cm) */
  width: number;
}

export interface UPSBrazilResponse {
  /** Price in BRL */
  CustoReais: number;
  /** Discount value */
  ValorDesconto: number;
  /** Insurance value */
  ValorSeguro: number;
  /** Insurance value */
  ValorSeguro1: number;
  /** Shipment price */
  ValorFrete: number;
  /** Shipment price with insurance */
  ValorFreteComSeguro: number;
  /** ? */
  ValorEA: number;
  /** Total shipping price */
  FreteTotalReceber: number;
  /** Destination distribution center */
  CentroDestino: number;
  /** ? */
  ValorAR: number;
  /** System Access */
  AcessoSistema: string;
  /** If it is dangerous area */
  RetornoAreaRisco: boolean;
  /** Shipment price without taxes */
  FreteSemImposto: number;
  /** ICMS value */
  ValorIcms: number;
  /** PIS/CONFINS Value */
  ValorPisCofins: number;
  /** ? */
  TaxaDomestico: number;
}
