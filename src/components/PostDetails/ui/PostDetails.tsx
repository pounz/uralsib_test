import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Post } from '../../../types';
import styles from './PostDetails.module.css';
import { fetchPost, fetchComments } from '../../../api/apiClients';
import useInfiniteScroll from '../../../hooks/useInfiniteScroll';

const PostDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = React.useState<Post | null>(null);

  const {
    items: comments,
    loading,
    hasMore,
  } = useInfiniteScroll((page) => fetchComments(Number(id), page));

  React.useEffect(() => {
    const loadPostDetails = async () => {
      if (!id) return;
      try {
        const post = await fetchPost(Number(id));
        setPost(post);
      } catch {
        console.error('Failed to load post details.');
      }
    };
    loadPostDetails();
  }, [id]);

  if (!post) return <p>Loading post details...</p>;

  return (
    <div className={styles.postDetails}>
      <h1 className={styles.postDetailsTitle}>{post.title}</h1>
      <p className={styles.postDetailsBody}>{post.body}</p>
      <h2>Comments</h2>
      <div className={styles.postDetailsCommentsWrapper}>
        <ul className={styles.postDetailsComments}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.postDetailsComment}>
              <strong>{comment.name}</strong> ({comment.email})<p>{comment.body}</p>
            </li>
          ))}
        </ul>
      </div>
      {loading && <p>Loading more comments...</p>}
      {hasMore && !loading && <p>Scroll down for more comments</p>}
      <Link to="/" className={styles.postDetailsBack}>
        Back to Posts
      </Link>
    </div>
  );
};

export default PostDetails;
