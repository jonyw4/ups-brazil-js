## Modules
Module | Description
------ | -----------
[ups-brazil-js] | 💵 Get Quote for Shipping

## Classes

Name | Description
------ | -----------
[AxiosTestError] | 

## Typedefs

Name | Description
------ | -----------
[UPSBrazilPack] | 
[UPSBrazilResponse] | 


## ups-brazil-js

💵 Get Quote for Shipping

**Returns**: `Promise.<UPSBrazilResponse, (Error)>` - Return the simulate quote data, or an error if rejected.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| user | `string` |  | User for auth |
| password | `string` |  | Password for auth |
| originZipCode | `string` |  | Origin ZipCode |
| destinationZipCode | `string` |  | Destination ZipCode |
| packageData | [`UPSBrazilPack`] |  | Box data for shipping |
| invoiceValue | `string` |  | Total money value of the items in shipment |
| \[timeout\] | `number` | `5000` | Timeout of the request |


## AxiosTestError

**Kind**: global class  
**Extends**: `Error`  

## UPSBrazilPack

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| weight | `number` | Weight (kg) |
| length | `number` | Length (cm) |
| height | `number` | Height (cm) |
| width | `number` | Width (cm) |


## UPSBrazilResponse

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| CustoReais | `number` | Custo |

<!-- LINKS -->

[ups-brazil-js]:#ups-brazil-js
[AxiosTestError]:#axiostesterror
[UPSBrazilPack]:#upsbrazilpack
[UPSBrazilResponse]:#upsbrazilresponse
[`UPSBrazilPack`]:#upsbrazilpack
