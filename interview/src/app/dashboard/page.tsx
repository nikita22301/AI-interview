import ProfileCard     from '../../../utils/components/ProfileCard/ProfileCard';
import StreakCard       from '../../../utils/components/StreakCard/StreakCard';
import PerformanceCard  from '../../../utils/components/PerformanceCard/PerformanceCard';
import ChatBot          from '../../../utils/components/ChatBot/ChatBot';

import userData         from '../data/user.json';
import streakData       from '../data/streak.json';
import performanceData  from '../data/performance.json';
import chatbotData      from '../data/chatbot.json';

import styles           from './styles/dashboard.module.css';

export default function DashboardPage() {
  return (
    <>
      <h2 className="sr-only">
        AI Interview Dashboard — user profile, streak tracker, chatbot interviewer, and performance analytics
      </h2>

      <div className={styles.dashboard}>
        {/* ── LEFT SIDEBAR ── */}
        <aside className={styles.sidebar}>
          <ProfileCard user={userData} />
          <StreakCard   streak={streakData} />
        </aside>

        {/* ── TOP RIGHT: Performance ── */}
        <section className={styles.performanceArea}>
          <PerformanceCard performance={performanceData} />
        </section>

        {/* ── BOTTOM RIGHT: Chatbot ── */}
        <section className={styles.chatArea}>
          <ChatBot chatbot={chatbotData} userInitials={userData.initials} />
        </section>
      </div>
    </>
  );
}
