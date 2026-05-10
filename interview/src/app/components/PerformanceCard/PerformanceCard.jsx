'use client';

import { useState } from 'react';
import { FaChartLine } from "react-icons/fa";
import styles from './PerformanceCard.module.css';

const SKILL_COLOR = {
  green:  { score: styles.skillScoreGreen,  bar: styles.skillBarGreen },
  accent: { score: styles.skillScoreAccent, bar: styles.skillBarAccent },
  blue:   { score: styles.skillScoreBlue,   bar: styles.skillBarBlue },
  amber:  { score: styles.skillScoreAmber,  bar: styles.skillBarAmber },
};

const HISTORY_SCORE_COLOR = {
  green:  styles.historyScoreGreen,
  accent: styles.historyScoreAccent,
  amber:  styles.historyScoreAmber,
  red:    styles.historyScoreRed,
};

const HISTORY_TAG_COLOR = {
  green:  styles.tagGreen,
  accent: styles.tagAccent,
  amber:  styles.tagAmber,
  red:    styles.tagRed,
};

export default function PerformanceCard({ performance }) {
  const [activeTab, setActiveTab] = useState('skills');
  const { skills, strongAreas, improveAreas, history, progress } = performance;

  const TABS = ['skills', 'history', 'progress'];

  return (
    <div className={styles.card}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.sectionLabel}>Performance analytics</div>
          <div className={styles.sectionTitle}>Your interview results</div>
        </div>
        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* ── Skills Tab ── */}
      {activeTab === 'skills' && (
        <div>
          <div className={styles.skillsGrid}>
            {skills.map((skill) => {
              const colors = SKILL_COLOR[skill.color] ?? SKILL_COLOR.accent;
              return (
                <div key={skill.name} className={styles.skillBox}>
                  <div className={`${styles.skillScore} ${colors.score}`}>{skill.score}</div>
                  <div className={styles.skillName}>{skill.name}</div>
                  <div className={styles.skillBarTrack}>
                    <div
                      className={`${styles.skillBarFill} ${colors.bar}`}
                      style={{ width: `${skill.score}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.areasRow}>
            <div className={`${styles.areaBox} ${styles.areaBoxGreen}`}>
              <div className={`${styles.areaTitle} ${styles.areaTitleGreen}`}>
                <FaChartLine /> Strong areas
              </div>
              <div className={styles.areaList}>
                {strongAreas.map((item) => (
                  <div key={item} className={styles.areaItem}>
                    <span className={`${styles.dot} ${styles.dotGreen}`} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles.areaBox} ${styles.areaBoxAmber}`}>
              <div className={`${styles.areaTitle} ${styles.areaTitleAmber}`}>
                ⚠ Improve these
              </div>
              <div className={styles.areaList}>
                {improveAreas.map((item) => (
                  <div key={item} className={styles.areaItem}>
                    <span className={`${styles.dot} ${styles.dotAmber}`} />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── History Tab ── */}
      {activeTab === 'history' && (
        <div className={styles.historyList}>
          {history.map((item) => (
            <div key={item.id} className={styles.historyItem}>
              <div className={`${styles.historyScore} ${HISTORY_SCORE_COLOR[item.statusColor]}`}>
                {item.score}
              </div>
              <div className={styles.historyInfo}>
                <div className={styles.historyTitle}>{item.title}</div>
                <div className={styles.historyTime}>{item.time}</div>
              </div>
              <span className={`${styles.tag} ${HISTORY_TAG_COLOR[item.statusColor]}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ── Progress Tab ── */}
      {activeTab === 'progress' && (
        <div>
          <div className={styles.chartWrapper}>
            <div className={styles.chartGridLines}>
              {[100, 75, 50].map((val) => (
                <div key={val} className={styles.chartGridLine}>
                  <span>{val}</span>
                  <div className={styles.chartGridLineRule} />
                </div>
              ))}
            </div>

            <div className={styles.barChart}>
              {progress.scores.map((score, i) => {
                const isLast = i === progress.scores.length - 1;
                const pct = Math.round((score / 100) * 85);
                return (
                  <div key={progress.months[i]} className={styles.barCol}>
                    <div
                      className={`${styles.bar} ${isLast ? styles.barActive : styles.barDefault}`}
                      style={{ height: `${pct}%` }}
                      title={`${progress.months[i]}: ${score}`}
                    />
                    <span className={`${styles.barLabel} ${isLast ? styles.barLabelActive : styles.barLabelDefault}`}>
                      {progress.months[i]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={styles.progressStats}>
            <div className={styles.progressStatBox}>
              <div className={`${styles.progressStatValue} ${styles.progressStatValueGreen}`}>
                {progress.vsLastMonth}
              </div>
              <div className={styles.progressStatLabel}>vs last month</div>
            </div>
            <div className={styles.progressStatBox}>
              <div className={`${styles.progressStatValue} ${styles.progressStatValueBlue}`}>
                {progress.totalPracticeHours}
              </div>
              <div className={styles.progressStatLabel}>total practice</div>
            </div>
            <div className={styles.progressStatBox}>
              <div className={`${styles.progressStatValue} ${styles.progressStatValueAccent}`}>
                {progress.percentileRank}
              </div>
              <div className={styles.progressStatLabel}>all users</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
