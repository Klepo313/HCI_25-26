import Link from 'next/link';
import { ZapOff, Home, Search, Navigation } from 'lucide-react';
import styles from './not-found.module.scss';

export default function NotFound() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Road illustration */}
        <div className={styles.illustration}>
          <div className={styles.road}>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
            <div className={styles.roadLine}></div>
          </div>
          <div className={styles.signPost}>
            <ZapOff size={64} strokeWidth={1.5} />
          </div>
        </div>

        {/* Error message */}
        <div className={styles.errorCode}>404</div>
        <h1 className={styles.title}>Wrong Turn!</h1>
        <p className={styles.description}>
          Looks like you've taken a detour off the main road. This route doesn't exist in our map.
        </p>

        {/* Navigation buttons */}
        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            <Home size={20} />
            <span>Back to Home</span>
          </Link>
          <Link href="/vehicle-list" className={styles.secondaryButton}>
            <Search size={20} />
            <span>Browse Vehicles</span>
          </Link>
          <Link href="/contact" className={styles.secondaryButton}>
            <Navigation size={20} />
            <span>Get Directions</span>
          </Link>
        </div>

        {/* Fun message */}
        <p className={styles.funMessage}>
          Don't worry - even the best drivers need GPS sometimes! 🚗
        </p>
      </div>
    </div>
  );
}
