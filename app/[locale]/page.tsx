import Hero from '@/app/components/home/Hero';
import FeaturedDrinks from '@/app/components/home/FeaturedDrinks';
import QuickReserve from '@/app/components/home/QuickReserve';

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedDrinks />
      <QuickReserve />

      {/* Location Section */}
      <section className="section bg-bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.686523992015!2d120.2001!3d22.9908!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDU5JzI2LjkiTiAxMjDCsDEyJzAwLjQiRQ!5e0!3m2!1sen!2stw!4v1620000000000!5m2!1sen!2stw"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '1rem' }}
            allowFullScreen
            loading="lazy"
            className="w-full h-96"
          ></iframe>
        </div>
      </section>
    </div>
  );
}
