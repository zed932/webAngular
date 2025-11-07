export interface App {
  id: number;
  name: string;
  version: string;
  techStack: string[];
  minIOSVersion: string;
  supportsMacOS: boolean;
  description: string;
  icon?: string;
}

export interface User {
  email: string;
  isTester: boolean;
}
