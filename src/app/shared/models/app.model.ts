export interface App {
  _id: string;
  id?: string;
  name: string;
  version: string;
  techStack: string[];
  minIOSVersion: string;
  supportsMacOS: boolean;
  description: string;
  icon: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface User {
  email: string;
  role: 'guest' | 'tester' | 'admin';
}

export interface AdminApp extends App {
  isPublished: boolean;
  downloadCount: number;
  rating: number;
  createdBy?: {
    _id: string;
    email: string;
  };
}

export interface AdminStats {
  totalApps: number;
  publishedApps: number;
  totalTesters: number;
  activeTesters: number;
  totalDownloads: number;
  averageRating: number;
}

export interface PublishStatus {
  appId: string;
  status: 'idle' | 'publishing' | 'success' | 'error';
  progress: number;
  message?: string;
}
