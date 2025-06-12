import authAxios from '../interceptors/AuthAxios';
import axios from 'axios';
import Movie from '../models/Movie';
import MovieFilter from '../models/filters/MovieFilter';
import PartialData from '../models/utils/PartialData';
import qs from 'qs';

export default class MovieService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/movies`;

  static async getFilteredList(filter: MovieFilter): Promise<PartialData<Movie>> {
    try {
      const response = await axios.get<PartialData<Movie>>(MovieService.url, {
        params: filter,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Movies Error");
    }
  }

  static async getRecommendations(filter: MovieFilter): Promise<PartialData<Movie>> {
    try {
      const response = await authAxios.get<PartialData<Movie>>(`${MovieService.url}/recommendation`, {
        params: filter,
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' });
        }
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Movies Error");
    }
  }

  static async getById(id: string): Promise<Movie> {
    try {
      const response = await axios.get<Movie>(`${MovieService.url}/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Movie Error");
    }
  }

  static async create(formData: FormData): Promise<string> {
    try {
      const response = await authAxios.post<string>(`${MovieService.url}`, formData);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Creating Movie Error");
    }
  }

  static async update(formData: FormData): Promise<void> {
    try {
      await authAxios.patch(`${MovieService.url}`, formData);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Updating Movie Error");
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await authAxios.delete(`${MovieService.url}/${id}`);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Deleting Movie Error");
    }
  }
}
