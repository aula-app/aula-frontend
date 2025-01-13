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

export interface LoginResponseType {
  success: boolean;
  JWT?: string;
  error_code?: number | null;
  user_status?: number | null;
  user_id?: number | null;
  data?: string | null;
  count?: number;
}
