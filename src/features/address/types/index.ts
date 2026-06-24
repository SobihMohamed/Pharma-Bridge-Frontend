export interface AddressDto {
  id: string;
  city: string;
  area: string;
  street: string;
  building: string;
  isDefault: boolean;
}

export interface CreateUpdateAddressDto {
  city: string;
  area: string;
  street: string;
  building: string;
  isDefault: boolean;
}
