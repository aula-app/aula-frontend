export interface ConsentResponse {
  data: number;
  error?: string;
}

export interface UserConsent {
  hasConsent: boolean;
}

export interface LoginFormValues {
  username: string;
  password: string;
}
