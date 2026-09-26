export type UserRole = 'ADMIN' | 'NUMBERING' | 'SURVEY' | 'TAX';

export interface ServerConfig {
  serverUrl: string;
  dbName: string;
  loginId: string;
  password: string;
}

export interface User {
  id: number;
  role: UserRole;
  name: string;
  mobile: string;
  email: string;
  login_id: string;
}

export interface PropertyRow {
  id: number;
  ward_no: string;
  property_no: string;
  part_no: string;
  owner_name: string;
  address: string;
  property_type: string;
  floor_info: string;
  water_connection: number;
  toilet_info: string;
  numbering_status: string;
  survey_status: string;
  tax_status: string;
  updated_at: string;

}

export interface TaxBreakdown {
  propertyTax: number;
  sanitationTax: number;
  lightingTax: number;
  healthTax: number;
  educationTax: number;
}

export interface NumberingAccount {
  id: number;
  owner_name: string;
  holder_name: string;
  building_name: string;
  building_no: string;
  address: string;
  has_gharkul: number | null;
  numbering_done: number | null;
  numbering_remarks: string;
  photo_path: string;
  o_online_no: string;
  o_zid: number | null;
  o_ward_no: number | null;
  o_property_no: string;
  o_part_no: string;
  o_city_survey_no: string;
  o_plot_no: string;
  opa: number | null;
  o_total_tax: number | null;
  zid: number | null;
  ward_no: number | null;
  property_no: number | null;
  part_no: number | null;
  city_survey_no: string;
  plot_no: string;
  mobile_no: string;
}
