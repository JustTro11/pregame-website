import { getTranslations } from 'next-intl/server';
import Hero from '@/app/components/home/Hero';
import FeaturedDrinks from '@/app/components/home/FeaturedDrinks';
import QuickReserve from '@/app/components/home/QuickReserve';
import Lookbook from '@/app/components/home/Lookbook';
import { getInstagramPosts } from '@/lib/instagram';

export default async function HomePage() {
  const t = await getTranslations('home');
  // const posts = await getInstagramPosts(8).catch(() => []);
  // const lookbookImages = posts ? posts.map(p => p.media_url) : [];
  const lookbookImages: string[] = []; // Force fallback to valid local assets

  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedDrinks />
      <QuickReserve />

      {/* Authentic Instagram Lookbook */}
      <Lookbook initialImages={lookbookImages} />

      {/* Location Section */}
      <section className="section bg-bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="text-left">
              <h2 className="text-3xl font-bold font-heading mb-4 text-gradient">{t('location_title')}</h2>
              <p className="text-muted-foreground mb-6">
                {t('location_subtitle')}
              </p>
              <div className="glass p-6 rounded-2xl border-white/5">
                <p className="font-mono text-accent-cream mb-2">{t('location_floor')}</p>
                <p className="text-sm">700 台南市中西區中正路198號</p>
              </div>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.686523992015!2d120.2001!3d22.9908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU5JzI2LjkiTiAxMjDCsDEyJzAwLjQiRQ!5e0!3m2!1sen!2stw!4v1620000000000!5m2!1sen!2stw"
              width="100%"
              height="300"
              style={{ border: 0, borderRadius: '1rem', filter: 'invert(90%) hue-rotate(180deg)' }}
              allowFullScreen
              loading="lazy"
              className="w-full grayscale contrast-125 opacity-80"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
