import { JwtPayload } from 'jsonwebtoken';
import { Role } from '../enums/role.enum';

export interface CustomJwtPayload extends JwtPayload {
  email?: string;
  role: Role;
}
