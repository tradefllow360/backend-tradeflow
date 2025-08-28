export class Empresa {
  id: string;
  nombre: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  plan: 'basic' | 'pro' | 'enterprise';
  activo: boolean;
}