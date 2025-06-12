import User from './User';

export default class Review {
  id?: string;
  text?: string;
  creationDate?: string;
  point?: number;
  movieId?: string;
  userId?: string;
  user?: User;
  likes?: number;
  dislikes?: number;
}
