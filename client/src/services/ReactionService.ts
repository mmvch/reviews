import authAxios from '../interceptors/AuthAxios';
import Reaction from '../models/Reaction';

export default class ReactionService {
  private static readonly url: string = `${process.env.REACT_APP_SERVER_URL}/reactions`;

  static async getForReview(reviewId: string): Promise<Reaction> {
    try {
      const response = await authAxios.get<Reaction>(`${ReactionService.url}`, { params: { reviewId } });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Getting Reaction Error");
    }
  }

  static async create(reaction: Reaction): Promise<void> {
    try {
      await authAxios.post(`${ReactionService.url}`, reaction);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Creating Reaction Error");
    }
  }

  static async update(reaction: Reaction): Promise<void> {
    try {
      await authAxios.patch(`${ReactionService.url}`, reaction);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Updating Reaction Error");
    }
  }

  static async delete(reviewId: string): Promise<void> {
    try {
      await authAxios.delete(`${ReactionService.url}`, { params: { reviewId } });
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || "Deleting Reaction Error");
    }
  }
}
