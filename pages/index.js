import Image from 'next/image';
import  HeroImage from '../public/hero.webp';
import { Logo } from '../components/Logo';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden
      flex justify-center items-center relative">
      <Image src={HeroImage} alt="Here" fill className="absolute" />
      <div className="relative z-10 text-white text-center
        py-5 px-10 max-w-screen-sm bg-slate-900 rounded-md backdrop-blur">
        <Logo />
        <p>
          The AI-powered SAAS solution to generate SEO-Optimized blog posts in minuetes.
          Get high-quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" alt="Get started button" className="btn">Begin</Link>
      </div>
    </div>
  );
}
