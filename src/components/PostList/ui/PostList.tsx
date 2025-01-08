import React from 'react';
import { Link } from 'react-router-dom';
import { Post } from '../../../types';
import { FixedSizeList as List } from 'react-window';
import { fetchPosts } from '../../../api/apiClients';
import styles from './PostList.module.css';

const PostList: React.FC = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const posts = await fetchPosts();
        setPosts(posts);
      } catch {
        setError('Failed to load posts.');
      } finally {
        setLoading(false);
      }
    };
    loadPosts();
  }, []);

  if (loading) return <p>Loading posts...</p>;
  if (error) return <p>{error}</p>;

  const renderRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const post = posts[index];
    return (
      <div style={style} key={post.id} className={styles.postListItem}>
        <Link to={`/posts/${post.id}`} className={styles.postListLink}>
          {post.title}
        </Link>
      </div>
    );
  };

  return (
    <div className={styles.postList}>
      <h1>Posts</h1>
      <List
        height={window.innerHeight}
        itemCount={posts.length}
        itemSize={50}
        width={window.innerWidth}
      >
        {renderRow}
      </List>
    </div>
  );
};

export default PostList;
