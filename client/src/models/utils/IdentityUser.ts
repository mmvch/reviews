import { jwtDecode } from 'jwt-decode';
import { TokenClaims } from '../../utils/TokenClaims';

export default class IdentityUser {
  id?: string;
  name?: string;
  role?: string;

  constructor(token: string | undefined) {
    if (!!token) {
      const decoded: any = jwtDecode(token);

      this.id = decoded[TokenClaims.Id];
      this.name = decoded[TokenClaims.Name];
      this.role = decoded[TokenClaims.Role];
    }
  }
}
