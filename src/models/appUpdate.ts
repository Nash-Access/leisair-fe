
export interface UpdateInfoResponse {
    'leisair-nextjs': ServiceUpdateInfo;
    'leisair-ml': ServiceUpdateInfo;
  }
  
export interface ServiceUpdateInfo {
    current_version: string;
    latest_version: string;
    update_available: boolean;
  }

export interface AppUpdateInput {
    services: Record<string, string>;
}