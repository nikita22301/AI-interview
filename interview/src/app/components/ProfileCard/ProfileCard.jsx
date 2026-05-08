'use client';

import styles from './ProfileCard.module.css';

const TAG_COLOR_MAP = {
  accent: styles.tagAccent,
  blue:   styles.tagBlue,
  green:  styles.tagGreen,
  amber:  styles.tagAmber,
  pink:   styles.tagPink,
};

const META_ICONS = {
  email:      '✉',
  location:   '📍',
  experience: '💼',
  target:     '🎯',
};

export default function ProfileCard({ user }) {
  const { name, initials, title, username, skills, stats, profileCompletion, email, location, experience, target } = user;

  const meta = [
    { icon: META_ICONS.email,      text: email },
    { icon: META_ICONS.location,   text: location },
    { icon: META_ICONS.experience, text: experience },
    { icon: META_ICONS.target,     text: target },
  ];

  return (
    <div className={styles.card}>
      <div className={styles.bgGlow} />

      <div className={styles.inner}>
        {/* Avatar */}
        <div className={styles.avatarWrapper}>
          <div className={styles.avatarRing}>
            <div className={styles.avatarInner}>{initials}</div>
          </div>
          <div className={styles.onlineDot} />
        </div>

        {/* Name & title */}
        <div className={styles.nameBlock}>
          <div className={styles.name}>{name}</div>
          <div className={styles.title}>{title}</div>
          <div className={styles.username}>@{username}</div>
        </div>

        {/* Skill tags */}
        <div className={styles.tags}>
          {skills.map((skill) => (
            <span
              key={skill.name}
              className={`${styles.tag} ${TAG_COLOR_MAP[skill.color] ?? styles.tagAccent}`}
            >
              {skill.name}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>{stats.sessions}</div>
            <div className={styles.statLabel}>Sessions</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.statValueGreen}`}>{stats.avgScore}</div>
            <div className={styles.statLabel}>Avg score</div>
          </div>
          <div className={styles.statItem}>
            <div className={`${styles.statValue} ${styles.statValueAmber}`}>{stats.rank}</div>
            <div className={styles.statLabel}>Rank</div>
          </div>
        </div>

        {/* Profile completion */}
        <div className={styles.progressBlock}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Profile completion</span>
            <span className={styles.progressValue}>{profileCompletion}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${profileCompletion}%` }} />
          </div>
        </div>

        {/* Meta info */}
        <div className={styles.metaList}>
          {meta.map((item) => (
            <div key={item.text} className={styles.metaItem}>
              <span className={styles.metaIcon}>{item.icon}</span>
              <span className={styles.metaText}>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Edit button */}
        <button className={styles.editBtn}>
          ✏ Edit profile ↗
        </button>
      </div>
    </div>
  );
}
