
import { ThemeType, Department } from './types';

export const THEMES: Record<ThemeType, string> = {
  aqua: '#00ffff',
  purple: '#bc13fe',
  pink: '#ff007f',
  emerald: '#50ffb1',
  custom: '#ffffff',
};

export const DEPARTMENTS: Department[] = [
  'ব্যাগ পিটার',
  'packer opater',
  'ছিনিয়ার opater',
  'অন্য অন্যান্য'
];

export const INITIAL_CONTACTS = [
  {
    id: '1',
    name: 'TD Hasan',
    mobile: '01712345678',
    contactId: 'ID-001',
    department: 'ছিনিয়ার opater',
    address: 'Dhaka, Bangladesh',
    isFavorite: true,
    createdAt: Date.now(),
    photo: 'https://picsum.photos/200/200?random=1'
  },
  {
    id: '2',
    name: 'Alex Neo',
    mobile: '01888776655',
    contactId: 'ID-002',
    department: 'packer opater',
    address: 'Cyber City',
    isFavorite: false,
    createdAt: Date.now() - 100000,
    photo: 'https://picsum.photos/200/200?random=2'
  }
];
