import authAxios from '../interceptors/AuthAxios';
import axios from 'axios';
import PartialData from '../models/utils/PartialData';
import Review from '../models/Review';
import ReviewFilter from '../models/filters/ReviewFilter';

export default class ReviewService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/reviews`;

  static async getFilteredList(filter: ReviewFilter): Promise<PartialData<Review>> {
    try {
      const response = await axios.get<PartialData<Review>>(ReviewService.url, { params: filter });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Reviews Error");
    }
  }

  static async getCount(movieId: string): Promise<number> {
    try {
      const response = await axios.get<number>(`${ReviewService.url}/count`, { params: { movieId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Review Count Error");
    }
  }

  static async getAverageRating(movieId: string): Promise<number | null> {
    try {
      const response = await axios.get<number | null>(`${ReviewService.url}/Average`, { params: { movieId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Reviewers Rating Error");
    }
  }

  static async getForCurrentUserAndMovie(movieId: string): Promise<Review> {
    try {
      const response = await authAxios.get<Review>(`${ReviewService.url}/bycurrentuser`, { params: { movieId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Review Error");
    }
  }

  static async create(review: Review): Promise<Review> {
    try {
      const response = await authAxios.post<Review>(ReviewService.url, review);
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Creating Review Error");
    }
  }

  static async update(review: Review): Promise<void> {
    try {
      await authAxios.patch(ReviewService.url, review);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Updating Review Error");
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await authAxios.delete(`${ReviewService.url}/${id}`);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Deleting Review Error");
    }
  }
}
