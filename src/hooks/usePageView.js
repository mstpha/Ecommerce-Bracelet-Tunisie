import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pushEvent } from '../utils/analytics';

export default function usePageView() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      pushEvent('virtual_page_view', {
        page_path: pathname + search,
        page_title: document.title
      });
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname, search]);
}
