import Genre from './Genre';

export default class Movie {
  id?: string;
  name?: string;
  description?: string;
  releaseDate?: string;
  posterFileName?: string;
  genres?: Genre[];
  score?: number | null;
}
