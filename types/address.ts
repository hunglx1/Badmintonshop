export interface LocationOption {
  code: number;
  name: string;
}

export interface ProvinceLocation extends LocationOption {
  wards: LocationOption[];
}