import { lazy, Suspense } from 'react';

const artifacts = import.meta.glob('../artifacts/*.jsx');

export default function ArtifactWrapper({ slug }) {
  const path = `../artifacts/${slug}.jsx`;

  if (!artifacts[path]) {
    return <p>Artifact not found</p>;
  }

  const Artifact = lazy(artifacts[path]);

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <Artifact />
    </Suspense>
  );
}
