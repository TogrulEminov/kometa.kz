// types/branch.types.ts
export interface Branch {
  id: string;
  countryIso2: string;
  countryIso3: string;
  countryName: string;
  branchName: string;
  city: string;
  address: string;
  status: BranchStatus;
  category: BranchCategory;
  color: string;
  employees: number;
  establishedDate: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export enum BranchStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  UNDER_CONSTRUCTION = "UNDER_CONSTRUCTION",
  PLANNED = "PLANNED",
  CLOSED = "CLOSED",
}

export enum BranchCategory {
  HEADQUARTERS = "HEADQUARTERS",
  REGIONAL_OFFICE = "REGIONAL_OFFICE",
  BRANCH_OFFICE = "BRANCH_OFFICE",
  WAREHOUSE = "WAREHOUSE",
  PRODUCTION = "PRODUCTION",
  REPRESENTATIVE = "REPRESENTATIVE",
}
