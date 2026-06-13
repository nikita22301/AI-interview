"use client";
import styles from "./style/loading.module.css"
const Loading = () => {
  return (
    <div className={styles.page}>
      {/* Background Glow */}
      <div className={styles.bgGlow}></div>

      {/* Grid */}
      <div className={styles.grid}></div>

      {/* Card */}
      <div className={styles.card}>
        {/* Animated Orb */}
        <div className={styles.orbWrapper}>
          <div className={styles.orb}></div>
          <div className={styles.ring}></div>
          <div className={styles.ring2}></div>
        </div>

        {/* Text */}
        <h1 className={styles.title}>PrepIQ</h1>

        <p className={styles.subtitle}>
          Loading AI modules and interview environment...
        </p>

        {/* Progress */}
        <div className={styles.progressBar}>
          <div className={styles.progress}></div>
        </div>
      </div>
    </div>
  );
};

export default Loading;