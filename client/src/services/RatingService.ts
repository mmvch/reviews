import authAxios from '../interceptors/AuthAxios';
import axios from 'axios';
import MovieRating from '../models/MovieRating';

export default class RatingService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/ratings`;

  static async getCount(movieId: string): Promise<number> {
    try {
      const response = await axios.get<number>(`${RatingService.url}/count`, { params: { movieId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Rating Count Error");
    }
  }

  static async getAverageRating(movieId: string): Promise<number | null> {
    try {
      const response = await axios.get<number | null>(`${RatingService.url}/average`, { params: { movieId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Raters Rating Error");
    }
  }

  static async getForMovieAndCurrentUser(movieId: string): Promise<MovieRating | null> {
    try {
      const response = await authAxios.get<MovieRating | null>(`${RatingService.url}`, { params: { movieId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Rating Error");
    }
  }

  static async create(rating: MovieRating): Promise<void> {
    try {
      await authAxios.post(`${RatingService.url}`, rating);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Creating Rating Error");
    }
  }

  static async update(rating: MovieRating): Promise<void> {
    try {
      await authAxios.patch(`${RatingService.url}`, rating);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Updating Rating Error");
    }
  }

  static async delete(movieId: string): Promise<void> {
    try {
      await authAxios.delete(`${RatingService.url}`, { params: { movieId } });
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Deleting Rating Error");
    }
  }
}
