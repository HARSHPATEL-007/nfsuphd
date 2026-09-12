import { AuthenticatedUser } from '../types';

export const DEAN_USER: AuthenticatedUser = {
  id: 'dean-sdsr',
  role: 'DEAN',
  fullName: 'Prof. (Dr.) S. O. Junare',
  designation: 'Dean, School of Doctoral Studies and Research',
  department: 'Executive Governance & Doctoral Sanctions',
  email: 'hvipatel007@gmail.com',
  avatarInitials: 'HP',
  lastLoginTimestamp: new Date().toISOString()
};

export const STAFF_USER: AuthenticatedUser = {
  id: 'staff-sdsr',
  role: 'STAFF',
  fullName: 'Harsh (Ph.D. Administration)',
  designation: 'Assistant Section Officer (Ph.D. Administration)',
  department: 'Ph.D. Scrutiny & Regulatory Compliance Section',
  email: 'harsh142022@gmail.com',
  avatarInitials: 'HA',
  lastLoginTimestamp: new Date().toISOString()
};
