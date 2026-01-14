
export type Department = 'ব্যাগ পিটার' | 'packer opater' | 'ছিনিয়ার opater' | 'অন্য অন্যান্য';

export interface Contact {
  id: string;
  name: string;
  mobile: string;
  contactId: string;
  department: Department;
  customDepartment?: string;
  address: string;
  photo?: string;
  isFavorite: boolean;
  createdAt: number;
}

export type ThemeType = 'aqua' | 'purple' | 'pink' | 'emerald' | 'custom';

export interface AppTheme {
  type: ThemeType;
  color: string;
}

export type Page = 'home' | 'add' | 'settings' | 'history';
