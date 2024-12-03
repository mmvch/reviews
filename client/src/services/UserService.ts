import authAxios from '../interceptors/AuthAxios';
import PartialData from '../models/utils/PartialData';
import User from '../models/User';
import UserFilter from '../models/filters/UserFilter';

export default class UserService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/users`;

  static async getFilteredList(filter: UserFilter): Promise<PartialData<User>> {
    try {
      const response = await authAxios.get<PartialData<User>>(UserService.url, { params: filter });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Users Error");
    }
  }

  static async update(userId: string, roleName: string): Promise<void> {
    try {
      await authAxios.patch(`${UserService.url}`, { userId, roleName });
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Updating User Error");
    }
  }
}
