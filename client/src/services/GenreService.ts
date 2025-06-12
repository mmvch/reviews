import authAxios from '../interceptors/AuthAxios';
import axios from 'axios';
import Genre from '../models/Genre';
import GenreFilter from '../models/filters/GenreFilter';
import PartialData from '../models/utils/PartialData';

export default class GenreService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/genres`;

  static async getAll(): Promise<Genre[]> {
    try {
      const response = await axios.get<PartialData<Genre>>(GenreService.url);
      return response.data.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Genres Error");
    }
  }

  static async getFilteredList(filter: GenreFilter): Promise<PartialData<Genre>> {
    try {
      const response = await axios.get<PartialData<Genre>>(GenreService.url, { params: filter });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Genres Error");
    }
  }

  static async create(genre: Genre): Promise<Genre> {
    try {
      const response = await authAxios.post<Genre>(`${GenreService.url}`, genre);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Creating Genre Error");
    }
  }

  static async update(genre: Genre): Promise<void> {
    try {
      await authAxios.patch(`${GenreService.url}`, genre);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Updating Genre Error");
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await authAxios.delete(`${GenreService.url}/${id}`);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Deleting Genre Error");
    }
  }
}
