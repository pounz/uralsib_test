import axios from 'axios';

const apiClient = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const fetchPosts = async () => {
  const response = await apiClient.get("/posts");
  return response.data;
};

export const fetchPost = async (postId: number) => {
  const response = await apiClient.get(`/posts/${postId}`);
  return response.data;
};

export const fetchComments = async (postId: number, page: number, limit: number = 20) => {
  const response = await apiClient.get(`/comments`, {
    params: {
      postId,
      _page: page,
      _limit: limit,
    },
  });
  return response.data;
};
