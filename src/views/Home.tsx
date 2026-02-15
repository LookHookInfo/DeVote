import DeVote from '@/partials/DeVote';
import Active from '@/partials/Active';
import Finished from '@/partials/Finished';
import Hero from '@/partials/Hero';

export default function Home() {
  return (
    <div className="max-w-[1200px] mx-auto px-4">
      <Hero />
      <DeVote />
      <Active />
      <Finished />
    </div>
  );
}