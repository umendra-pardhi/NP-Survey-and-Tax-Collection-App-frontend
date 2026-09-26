export type RootStackParamList = {
  Splash: undefined;
  Setup: undefined;
  Login: undefined;
  AdminDashboard: undefined;
  UserCreation: undefined;
  Reports: undefined;
  Sync: undefined;
  NumberingDashboard: undefined;
  NumberingList: undefined;
  NumberingForm: { propertyId: number };
  NumberingSummary: undefined;
  SurveyDashboard: undefined;
  SurveySearch: undefined;
  SurveyForm: { propertyId: number };
  MemberEntry: { propertyId: number };
  SurveySummary: undefined;
  TaxDashboard: undefined;
  TaxSearch: undefined;
  TaxDetails: { propertyId: number };
  TaxEntry: { propertyId: number };
  Payment: {
    propertyId: number;
    previousTax: number;
    taxes: {
      propertyTax: number;
      sanitationTax: number;
      lightingTax: number;
      healthTax: number;
      educationTax: number;
    };
  };
  Receipt: { receiptNo: string };
};
