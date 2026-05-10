'use client';

import styles from './StreakCard.module.css';
import { FaFire, FaCheck , FaClock  } from "react-icons/fa";

export default function StreakCard({ streak }) {
  const { currentStreak, bestStreak, thisMonth, weeklyGoal, last21Days, message } = streak;

  const weeklyPct = Math.round((weeklyGoal.completed / weeklyGoal.total) * 100);

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionLabel}>Practice streak</div>
          <div className={styles.streakCount}>
            <span className={styles.streakNumber}>{currentStreak}</span>
            <span className={styles.streakUnit}>days</span>
          </div>
        </div>
        <div className={styles.flameEmoji}> <FaFire /></div>
      </div>

      {/* Weekly goal */}
      <div className={styles.goalBlock}>
        <div className={styles.goalHeader}>
          <span className={styles.goalLabel}>Weekly goal</span>
          <span className={styles.goalValue}>{weeklyGoal.completed}/{weeklyGoal.total} days</span>
        </div>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${weeklyPct}%` }} />
        </div>
      </div>

      {/* 21-day grid */}
      <div className={styles.streakGrid}>
        {last21Days.map((completed, i) => {
          const isToday = i === last21Days.length - 1;
          const cls = isToday
            ? styles.streakDayToday
            : completed
            ? styles.streakDayCompleted
            : styles.streakDayMissed;

          return (
            <div
              key={i}
              className={`${styles.streakDay} ${cls}`}
              title={isToday ? 'Today' : completed ? 'Completed' : 'Missed'}
            />
          );
        })}
      </div>

      {/* Best streak / This month */}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <div className={styles.statBoxLabel}>Best streak</div>
          <div className={`${styles.statBoxValue} ${styles.statBoxValueAmber}`}>{bestStreak} <FaFire /></div>
            {/* 🔥 */}
        </div>
        <div className={styles.statBox}>
          <div className={styles.statBoxLabel}>This month</div>
          <div className={`${styles.statBoxValue} ${styles.statBoxValueGreen}`}>{thisMonth} <FaCheck /></div>
        </div>
      </div>

      {/* Reminder */}
      <div className={styles.reminder}>
        <span className={styles.reminderIcon}><FaClock /></span>
          {/* ⏰ */}
        <span className={styles.reminderText}>{message}</span>
      </div>
    </div>
  );
}
