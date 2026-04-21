// Advanced Lazy Loading Utilities

import React, { Suspense, lazy, ComponentType } from 'react';
import { LoadingSpinner } from '@shared/components/ui/LoadingSpinner';

// Loading component with error boundary
import { Box } from '@mui/material';

const PageLoader: React.FC = () => (
  <Box sx={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '50vh',
    padding: '2rem'
  }}>
    <LoadingSpinner />
  </Box>
);

// Error boundary for lazy components
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy loading error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <Box sx={{ 
          padding: '2rem', 
          textAlign: 'center',
          color: '#d32f2f'
        }}>
          <h3>שגיאה בטעינת הדף</h3>
          <p>נא לנסות לרענן את הדף</p>
          <Box 
            component="button"
            onClick={() => window.location.reload()}
            sx={{
              padding: '0.5rem 1rem',
              margin: '1rem',
              border: '1px solid #d32f2f',
              borderRadius: '4px',
              background: 'transparent',
              color: '#d32f2f',
              cursor: 'pointer'
            }}
          >
            רענן דף
          </Box>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Enhanced lazy loading with retry mechanism
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): React.LazyExoticComponent<T> {
  return lazy(() => {
    const loadWithRetry = async (attempt = 1): Promise<{ default: T }> => {
      try {
        return await importFunc();
      } catch (error) {
        if (attempt < retries) {
          console.warn(`Lazy loading attempt ${attempt} failed, retrying...`, error);
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          return loadWithRetry(attempt + 1);
        }
        throw error;
      }
    };
    
    return loadWithRetry();
  });
}

// Lazy component wrapper with error boundary
export function withLazyLoading<T extends ComponentType<any>>(
  Component: React.LazyExoticComponent<T>,
  fallback?: React.ReactNode
) {
  return (props: React.ComponentProps<T>) => (
    <LazyErrorBoundary fallback={fallback}>
      <Suspense fallback={<PageLoader />}>
        <Component {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
}

// Preload utility for critical components
export function preloadComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): void {
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = importFunc.toString();
  document.head.appendChild(link);
}

// Intersection Observer for lazy loading
export function useIntersectionObserver(
  ref: React.RefObject<HTMLElement>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options
    });

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [ref, options]);

  return isIntersecting;
}

// Lazy image component
export const LazyImage: React.FC<{
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  style?: React.CSSProperties;
}> = ({ src, alt, placeholder, className, style }) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);
  const isIntersecting = useIntersectionObserver(imgRef);

  React.useEffect(() => {
    if (isIntersecting && imgRef.current) {
      const img = imgRef.current;
      img.src = src;
      
      img.onload = () => setIsLoaded(true);
      img.onerror = () => setHasError(true);
    }
  }, [isIntersecting, src]);

  if (hasError) {
    return (
      <Box 
        className={className}
        sx={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5',
          color: '#666',
          minHeight: '200px'
        }}
      >
        שגיאה בטעינת התמונה
      </Box>
    );
  }

  return (
    <Box ref={imgRef} className={className} sx={style}>
      {!isLoaded && placeholder && (
        <Box sx={{
          background: `url(${placeholder}) center/cover`,
          width: '100%',
          height: '100%',
          filter: 'blur(10px)',
          transition: 'filter 0.3s ease'
        }} />
      )}
      {isLoaded && (
        <Box
          component="img"
          src={src}
          alt={alt}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
        />
      )}
    </Box>
  );
};

// Lazy loading hook for data
export function useLazyData<T>(
  fetchFunc: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchFunc();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setLoading(false);
    }
  }, [fetchFunc]);

  React.useEffect(() => {
    fetchData();
  }, dependencies);

  return { data, loading, error, refetch: fetchData };
}
