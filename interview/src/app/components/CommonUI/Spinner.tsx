// components/ui/LoadingSpinner.tsx

import styles from "./style/Spinner.module.css";

interface LoadingSpinnerProps {
  text?: string;
  fullScreen?: boolean;
}

export default function LoadingSpinner({
  text = "Initializing AI Interview...",
  fullScreen = true,
}: LoadingSpinnerProps) {
  return (
    <div
      className={
        fullScreen ? styles.fullScreenWrapper : styles.inlineWrapper
      }
    >
      <div className={styles.spinnerCard}>
        {/* Glow */}
        <div className={styles.cornerGlow}></div>

        {/* Spinner */}
        <div className={styles.spinnerWrapper}>
          <div className={styles.outerRing}></div>
          <div className={styles.innerRing}></div>
          <div className={styles.core}></div>
        </div>

        {/* Text */}
        <p className={styles.loadingText}>{text}</p>

        {/* Animated dots */}
        <div className={styles.dots}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}