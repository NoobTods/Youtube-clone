import { useEffect, useRef, useState } from 'react';

// [CHANGED - quota] Rend ses enfants uniquement quand la zone entre dans le
// viewport. Permet de ne déclencher une requête API (useQuery des enfants)
// que lorsque l'utilisateur scrolle réellement jusqu'à la section.
const LazySection = ({ children, rootMargin = '300px' }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  return <div ref={ref}>{visible ? children : null}</div>;
};

export default LazySection;
