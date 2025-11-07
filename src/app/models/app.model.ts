export interface App {
  id: number;
  name: string;
  version: string;
  techStack: string[];
  minIOSVersion: string;
  supportsMacOS: boolean;
  description: string;
  icon: string;
}

export interface User {
  email: string;
  isTester: boolean;
}

export interface AdminApp extends App {
  isPublished: boolean;
  downloadCount: number;
  rating: number;
}

export interface AdminStats {
  totalApps: number;
  publishedApps: number;
  totalTesters: number;
  activeTesters: number;
  totalDownloads: number;
  averageRating: number;
}
