export interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  email?: string;
  children?: FileItem[];
}

export interface Integration {
  id: string;
  name: string;
  icon: string;
  count?: number;
  beta?: boolean;
}
