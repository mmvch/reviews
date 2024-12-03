import axios from 'axios';
import Credentials from '../models/utils/Credentials';

export default class AuthService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/auth`;

  static async register(credentials: Credentials): Promise<string> {
    try {
      const response = await axios.post<string>(`${AuthService.url}/register`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Register Error");
    }
  }

  static async login(credentials: Credentials): Promise<string> {
    try {
      const response = await axios.post<string>(`${AuthService.url}/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Login Error");
    }
  }
}
