import { Comment } from '../../types/Comment';
import { client } from '../../utils/fetchClient';

export const getComments = (postId: number) => {
  return client.get<Comment[]>(`/comments?postId=${postId}`);
};

export const deleteComment = (commentId: number) => {
  return client.delete(`/comments/${commentId}`);
};

export const addComments = ({
  postId,
  name,
  email,
  body,
}: Omit<Comment, 'id'>): Promise<Comment> => {
  return client.post('/comments', { postId, name, email, body });
};
