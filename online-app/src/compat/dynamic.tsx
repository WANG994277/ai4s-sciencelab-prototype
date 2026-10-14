import { lazy, Suspense, type ComponentType } from 'react';

type Loader<P> = () => Promise<ComponentType<P> | { default: ComponentType<P> }>;

export default function dynamic<P extends object>(
  loader: Loader<P>,
  options: { loading?: ComponentType } = {},
) {
  const LazyComponent = lazy(async () => {
    const loaded = await loader();
    return 'default' in loaded ? loaded : { default: loaded };
  });
  const Loading = options.loading;

  return function DynamicComponent(props: P) {
    return (
      <Suspense fallback={Loading ? <Loading /> : null}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
