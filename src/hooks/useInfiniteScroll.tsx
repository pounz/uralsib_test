import { useState, useEffect } from 'react';

const useInfiniteScroll = (fetchData: (page: number) => Promise<any[]>, pageSize: number = 20) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const newItems = await fetchData(page);
      setItems((prevItems) => [...prevItems, ...newItems]);

      if (newItems.length < pageSize) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load items', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    const bottom =
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight;
    if (bottom && !loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadItems();
        return nextPage;
      });
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, hasMore, page]);

  return { items, loading, hasMore };
};

export default useInfiniteScroll;
