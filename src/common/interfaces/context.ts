export interface IRequestContextUser {
  id: string;
  companyId: string;
  uid: string;
  email: string;
  view: string;
  roles?: string[];
}
