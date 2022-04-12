import { getAddressInfrastructure } from 'webkit/utils/address'

export function newAddressSuggestion(address: string) {
  return {
    address,
    infrastructure: getAddressInfrastructure(address),
  }
}
