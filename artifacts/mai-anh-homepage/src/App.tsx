import { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Heart, Music2, Play, Sparkles, X } from 'lucide-react';
import type { CalendarSummary } from '@workspace/api-client-react';
import profilePhoto from '@assets/Profile_Photo_1789185793051.jpg';
import bgmAudio from '@assets/Supernatural_(Instrumental)_1789186548920.mp3';
import { MiniPhotoBoothBanner, MiniPhotoBoothModal } from './components/MiniPhotoBooth/MiniPhotoBooth';

type SectionId = 'home' | 'profile' | 'work' | 'stage' | 'achievements' | 'diary' | 'guestbook' | 'contact';
type Performance = { id: string; title: string; year: string; detail: string; url: string; color: string };
type Guest = { id: string; nickname: string; message: string; hearts: number; demo?: boolean };
type MoodNote = { text: string; savedAt: string };

const performanceLinks: Performance[] = [
  {
    id: 'red-dancing-club',
    title: 'RED DANCING CLUB / PERFORMANCE',
    year: '2022–2025',
    detail: 'Member. Participated in Club Fair, Concert “Ky hoa”, Project Tết Quý Mão 2023 and Christmas 2022.',
    url: 'https://youtu.be/OxeWw4fR3vE?si=5K-m8iouQcMU--WX',
    color: '#ffea65',
  },
  {
    id: 'first-kontum-dance-crew',
    title: 'THE FIRST KONTUM DANCE CREW',
    year: 'VIDEO LINK',
    detail: 'Performance archive link supplied for Mai Anh’s stage.',
    url: 'https://youtu.be/I--_mFivAaE?si=eckNb5A_cK_ocKIi',
    color: '#a8edfb',
  },
  {
    id: 'tet-quy-mao',
    title: 'PROJECT TẾT QUÝ MÃO 2023',
    year: '2023',
    detail: 'A Red Dancing Club project listed in the activities section of the CV.',
    url: 'https://youtu.be/8wlJMKrYtKw?si=I7X6BOfdPX5PfcTb',
    color: '#ff9dbb',
  },
];

const demoGuests: Guest[] = [
  { id: 'demo-01', nickname: 'pixel_friend', message: 'DEMO DATA — welcome to the mini homepage.', hearts: 8, demo: true },
  { id: 'demo-02', nickname: 'guest_2007', message: 'DEMO DATA — left a little note on the board.', hearts: 4, demo: true },
];

const navItems: { id: SectionId; label: string }[] = [
  { id: 'home', label: 'HOME' },
  { id: 'profile', label: 'PROFILE' },
  { id: 'work', label: 'WORK' },
  { id: 'stage', label: 'STAGE' },
  { id: 'achievements', label: 'BADGES + SKILLS' },
  { id: 'diary', label: 'DIARY' },
  { id: 'guestbook', label: 'GUESTBOOK' },
  { id: 'contact', label: 'CONTACT' },
];

function scrollToSection(id: SectionId) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function WindowBar({ title, onClose }: { title: string; onClose?: () => void }) {
  return (
    <div className="window-bar">
      <span>{title}</span>
      <span className="flex items-center gap-2">
        <span className="window-dots"><i /><i /><i /></span>
        {onClose && <button data-testid="button-close-window" onClick={onClose} aria-label="Close window"><X size={14} /></button>}
      </span>
    </div>
  );
}

function IntroScreen({ onEnter, onStartMusic }: { onEnter: () => void; onStartMusic: () => void }) {
  const [leaving, setLeaving] = useState(false);
  const enter = () => {
    onStartMusic();
    setLeaving(true);
    window.setTimeout(onEnter, 420);
  };
  return (
    <main className={`intro-screen ${leaving ? 'leaving' : ''}`}>
      <section className="intro-window" aria-label="Mai Anh's mini homepage introduction">
        <WindowBar title="WELCOME — MINI HOMEPAGE" />
        <div className="intro-body">
          <span className="float-sticker sticker yellow" style={{ top: 30, left: '9%' }}>NEW TAB</span>
          <span className="float-sticker sticker pink" style={{ top: 95, right: '9%', animationDelay: '.7s' }}>ONLINE</span>
          <span className="float-sticker sticker lime" style={{ bottom: 75, left: '10%', animationDelay: '1.2s' }}>CLICK ME</span>
          <span className="float-sticker sticker blue" style={{ bottom: 105, right: '10%', animationDelay: '1.7s' }}>ROOM 01</span>
          <Sparkles className="absolute left-[20%] top-[25%] text-[#f35b8a]" size={28} />
          <Sparkles className="absolute right-[23%] bottom-[28%] text-[#7550c2]" size={22} />
          <div className="micro text-[#6d4a65]">A decorated personal internet room</div>
          <h1 className="intro-title mt-4">MAI ANH&apos;S<br />MINI HOMEPAGE</h1>
          <img className="intro-photo" src={profilePhoto} alt="Nguyễn Mai Anh" data-testid="img-intro-profile" />
          <p className="text-center font-mono text-sm text-[#572b4d]">WELCOME TO MY LITTLE INTERNET WORLD</p>
          <p className="micro mt-2 text-[#6d4a65]">PRESS ENTER TO VISIT</p>
          <button className="glossy-button mt-6" onClick={enter} data-testid="button-enter-world">
            ENTER MY WORLD
          </button>
          <button className="mt-5 border-b-2 border-[#572b4d] font-mono text-[10px] text-[#572b4d]" onClick={enter} data-testid="button-skip-intro">
            SKIP INTRO
          </button>
        </div>
      </section>
    </main>
  );
}

function ProfileCard({ onProfile }: { onProfile: () => void }) {
  return (
    <aside className="paper-card p-3">
      <div className="micro mb-2 flex items-center justify-between"><span>PROFILE CARD</span><span className="text-[#ef3e71]">ONLINE</span></div>
      <button onClick={onProfile} className="group block w-full" data-testid="button-open-profile-card">
        <div className="border-2 border-[#572b4d] bg-[#ffcfda] p-2 shadow-[3px_3px_0_#572b4d] transition-transform group-hover:-rotate-2">
          <img src={profilePhoto} alt="Nguyễn Mai Anh profile" className="aspect-[4/3] w-full object-cover" data-testid="img-profile-card" />
        </div>
      </button>
      <h2 className="mt-4 text-lg font-black text-[#572b4d]" data-testid="text-profile-name">NGUYỄN MAI ANH</h2>
      <p className="micro mt-1 text-[#e33d72]">CURRENTLY ONLINE</p>
      <div className="mt-4 border-t-2 border-dotted border-[#d894a8] pt-3 text-xs leading-6 text-[#663d52]">
        <p><b>LOCATION</b><br />Thanh Xuan, Ha Noi</p>
        <p className="mt-2"><b>VISITOR COUNTER</b><br /><span className="font-mono text-[#dc356c]">00 04 10 07</span></p>
      </div>
      <button className="glossy-button mt-4 w-full !px-2 !py-2 !text-[10px]" onClick={onProfile} data-testid="button-view-profile">VIEW PROFILE</button>
    </aside>
  );
}

function MiniRoom({ onOpen }: { onOpen: (id: SectionId) => void }) {
  return (
    <div className="room" data-testid="panel-mini-room">
      <span className="sticker yellow absolute right-4 top-10 z-10">CLICK OBJECTS</span>
      <div className="room-wall" /><div className="room-floor" />
      <button className="room-object photo-mini" onClick={() => onOpen('profile')} data-testid="button-room-photo">
        <img src={profilePhoto} alt="Open profile" /><span className="mt-1 block text-center font-mono text-[9px]">PHOTO / PROFILE</span>
      </button>
      <button className="room-object shelf" onClick={() => onOpen('work')} aria-label="Open workroom" data-testid="button-room-shelf" />
      <button className="room-object computer" onClick={() => onOpen('work')} data-testid="button-room-computer">
        <div className="computer-screen" /><div className="computer-base" /><span className="room-label mt-1 block text-center">MY WORK</span>
      </button>
      <button className="room-object poster" onClick={() => onOpen('stage')} data-testid="button-room-stage">
        <span className="micro">LIVE ARCHIVE</span><b>MY<br />STAGE</b><span className="mt-2 block text-[9px]">OPEN POSTER</span>
      </button>
      <button className="room-object cd" onClick={() => onOpen('diary')} aria-label="Open diary" data-testid="button-room-cd" />
      <button className="room-object plant" onClick={() => onOpen('guestbook')} aria-label="Open guestbook" data-testid="button-room-plant">✦</button>
      <div className="room-object desk" />
      <span className="sticker pink absolute bottom-[35%] right-[7%] z-10">NOTE BOARD</span>
      <span className="sticker lime absolute bottom-[8%] left-[7%] z-10">WELCOME</span>
    </div>
  );
}

function MoodNoteWindow({ initialNote, onClose, onSave }: { initialNote: MoodNote | null; onClose: () => void; onSave: (text: string) => void }) {
  const [text, setText] = useState(initialNote?.text ?? '');
  return (
    <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <div className="modal-window max-w-lg" data-testid="mood-note-window">
        <WindowBar title="TODAY'S MOOD — new note" onClose={onClose} />
        <form className="p-5" onSubmit={(event) => { event.preventDefault(); if (text.trim()) { onSave(text.trim()); onClose(); } }}>
          <p className="micro text-[#df3b70]">PERSONAL DESK NOTE</p>
          <h2 className="section-title mt-1">READY TO CREATE</h2>
          <p className="mt-3 text-sm leading-6 text-[#70445b]">Write a little note for today. It stays on this homepage in your browser.</p>
          <label className="micro mt-5 block">YOUR NOTE
            <textarea autoFocus className="input-retro mt-2 min-h-32 resize-y" value={text} onChange={(event) => setText(event.target.value)} maxLength={280} placeholder="today I want to remember..." data-testid="input-mood-note" />
          </label>
          <div className="mt-4 flex flex-wrap gap-3">
            <button className="glossy-button" type="submit" data-testid="button-save-mood-note">PIN NOTE</button>
            <button className="nav-chip" type="button" onClick={onClose} data-testid="button-cancel-mood-note">CANCEL</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MiniCalendar({ summary, isLoading, hasError }: { summary?: CalendarSummary; isLoading: boolean; hasError: boolean }) {
  const now = new Date();
  const fallbackParts = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  const [year, month] = (summary?.month ?? `${fallbackParts.year}-${String(fallbackParts.month).padStart(2, '0')}`).split('-').map(Number);
  const today = summary ? Number(summary.currentDate.slice(-2)) : fallbackParts.day;
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const eventDays = new Set((summary?.events ?? []).map((event) => event.start.slice(0, 10)));
  const monthLabel = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: summary?.timeZone }).format(new Date(Date.UTC(year, month - 1, 1)));
  const cells = Array.from({ length: firstWeekday + daysInMonth }, (_, index) => index < firstWeekday ? null : index - firstWeekday + 1);
  return (
    <div className="paper-card p-3" data-testid="mini-calendar">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="micro">MINI CALENDAR</div>
        <span className={`font-mono text-[9px] ${hasError ? 'text-[#d94170]' : 'text-[#5e8a42]'}`}>{hasError ? 'OFFLINE' : isLoading ? 'SYNCING...' : 'LIVE'}</span>
      </div>
      <p className="mb-2 text-center font-mono text-[10px] font-bold text-[#572b4d]">{monthLabel}</p>
      <div className="grid grid-cols-7 gap-1 text-center font-mono text-[9px] text-[#572b4d]">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => <span key={`${day}-${index}`} className="font-bold">{day}</span>)}
        {cells.map((day, index) => {
          const dateKey = day ? `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';
          const hasEvent = dateKey ? eventDays.has(dateKey) : false;
          return <span key={`${dateKey || 'empty'}-${index}`} data-testid={dateKey ? `calendar-day-${dateKey}` : undefined} data-today={day === today ? 'true' : undefined} data-event-day={hasEvent ? 'true' : undefined} className={`${day === today ? 'bg-[#ef4e77] text-white' : ''} ${hasEvent ? 'underline decoration-2 decoration-[#6b4ab5] underline-offset-2' : ''}`}>{day ?? ''}</span>;
        })}
      </div>
      <p className="mt-3 border-t border-dotted border-[#d894a8] pt-2 font-mono text-[9px] text-[#70445b]">
        {summary?.events.length ? `${summary.events.length} event${summary.events.length === 1 ? '' : 's'} this month` : isLoading ? 'checking your calendar...' : hasError ? 'calendar needs a reconnect' : 'no events this month'}
      </p>
    </div>
  );
}

function HeroHome({ onOpen, onOpenPhotoBooth, calendarSummary, calendarLoading, calendarError, note, onCreateNote }: { onOpen: (id: SectionId) => void; onOpenPhotoBooth?: () => void; calendarSummary?: CalendarSummary; calendarLoading: boolean; calendarError: boolean; note: MoodNote | null; onCreateNote: () => void }) {
  return (
    <section id="home" className="section-window">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div><p className="micro text-[#d83b6d]">PERSONAL HOMEPAGE / ROOM 01</p><h1 className="section-title mt-1">WELCOME TO MAI ANH&apos;S WORLD</h1></div>
        <div className="sticker blue">LAST LOGIN: ONLINE</div>
      </div>
      <div className="grid gap-4 lg:grid-cols-[190px_1fr_190px]">
        <ProfileCard onProfile={() => onOpen('profile')} />
        <MiniRoom onOpen={onOpen} />
        <aside className="space-y-4">
          <div className="paper-card p-3">
            <div className="micro mb-3">TODAY&apos;S MOOD</div>
            <button className="w-full border-2 border-[#572b4d] bg-[#ffea65] p-3 text-center shadow-[3px_3px_0_#572b4d] transition-transform hover:-translate-y-0.5" onClick={onCreateNote} data-testid="button-create-mood-note">
              <Sparkles className="mx-auto mb-2 text-[#ef3e71]" size={28} />
              <p className="font-mono text-xs font-bold text-[#572b4d]">{note ? "EDIT TODAY'S NOTE" : 'READY TO CREATE'}</p>
              <p className="mt-2 line-clamp-2 text-left text-[11px] leading-4 text-[#70445b]">{note?.text ?? 'click here to pin a note'}</p>
            </button>
          </div>
          <MiniCalendar summary={calendarSummary} isLoading={calendarLoading} hasError={calendarError} />
          <div className="paper-card p-3">
            <div className="micro mb-2">QUICK LINKS</div>
            <button className="mb-2 w-full border-2 border-[#572b4d] bg-[#b9f269] p-2 text-left font-mono text-[10px]" onClick={() => onOpen('stage')} data-testid="button-quick-stage">WATCH THE STAGE</button>
            <button className="mb-2 w-full border-2 border-[#572b4d] bg-[#ff9dbb] p-2 text-left font-mono text-[10px]" onClick={() => onOpen('guestbook')} data-testid="button-quick-guestbook">SIGN THE GUESTBOOK</button>
            {onOpenPhotoBooth && (
              <button className="w-full border-2 border-[#572b4d] bg-[#ffea65] p-2 text-left font-mono text-[10px] font-bold text-[#d94170] hover:bg-[#ffcedb] transition-colors" onClick={onOpenPhotoBooth} data-testid="button-quick-photobooth">
                ♡ MINI PHOTO BOOTH 📸
              </button>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}

function ProfileSection() {
  return (
    <section id="profile" className="section-window paper-card">
      <WindowBar title="PROFILE.exe — personal information" />
      <div className="grid gap-6 p-5 md:grid-cols-[220px_1fr]">
        <div>
          <div className="border-4 border-[#572b4d] bg-[#ffcedb] p-2 shadow-[5px_5px_0_#65cbdc]">
            <img src={profilePhoto} alt="Nguyễn Mai Anh" className="aspect-[3/4] w-full object-cover" data-testid="img-profile-main" />
          </div>
          <div className="sticker yellow mt-4">PROFILE / 01</div>
        </div>
        <div>
          <p className="micro text-[#df3b70]">PROFILE NOTE</p>
          <h2 className="section-title mt-1">NGUYỄN MAI ANH</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {[
              ['DATE OF BIRTH', '04/10/2007'],
              ['EDUCATION', 'Foreign Trade University — 2025'],
              ['MAJOR', 'International Economics'],
              ['GPA', '3.83/4.0'],
              ['HIGH SCHOOL', 'Nhan Chinh High School — 2022–2025'],
              ['IELTS', '7.5 Overall'],
              ['HIGH SCHOOL GPA', '9.5/10'],
              ['LOCATION', 'Thanh Xuan, Ha Noi'],
            ].map(([label, value]) => <div key={label} className="border-l-4 border-[#f24f7d] bg-[#fff0d6] p-3"><p className="micro text-[#8a5570]">{label}</p><p className="mt-1 text-sm font-bold text-[#572b4d]" data-testid={`text-profile-${label.toLowerCase().replaceAll(' ', '-')}`}>{value}</p></div>)}
          </div>
          <div className="mt-5 border-2 border-dashed border-[#572b4d] bg-[#a8edfb] p-3">
            <p className="micro">LANGUAGE LIST</p><p className="mt-2 text-sm font-semibold text-[#572b4d]">Vietnamese · English · Korean</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WorkSection({ onOpen }: { onOpen: (work: string) => void }) {
  const work = [
    { id: 'np', org: 'NP EDUCATION', year: '2026', position: 'Customer Service Officer', color: '#ffea65', duties: ['Taking attendance', 'Sending learning reports to parents after each lesson', 'Creating class materials', 'Assisting students and teachers when needed'] },
    { id: 'gtp', org: 'GTP MEDIA', year: '2025', position: 'KOL/KOC Booker', color: '#a8edfb', duties: ['Responsible for finding and contacting suitable KOLs and KOCs to review the brand’s products.', 'Setting up TikTokShop and Shopee stores.', 'Creating videos for KOCs.', 'Responsible for posting content on the brand’s fanpage.'] },
  ];
  return (
    <section id="work" className="section-window paper-card">
      <WindowBar title="WORKROOM — folders on desk" />
      <div className="p-5"><p className="micro text-[#df3b70]">OPEN A FOLDER</p><h2 className="section-title mt-1">MY WORKROOM</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {work.map((item) => <button key={item.id} onClick={() => onOpen(item.id)} className="group border-3 border-[#572b4d] p-4 text-left shadow-[5px_5px_0_#572b4d] transition-transform hover:-translate-y-1" style={{ background: item.color }} data-testid={`button-work-${item.id}`}>
            <div className="flex items-start justify-between"><span className="font-mono text-3xl text-[#d43168]">▰</span><span className="micro">{item.year}</span></div>
            <h3 className="mt-3 text-lg font-black text-[#572b4d]">{item.org}</h3><p className="mt-1 font-mono text-xs text-[#7a4560]">{item.position}</p><p className="mt-5 font-mono text-[10px] font-bold text-[#572b4d]">CLICK TO OPEN FOLDER →</p>
          </button>)}
        </div>
      </div>
    </section>
  );
}

function StageSection({ onVideo }: { onVideo: (performance: Performance) => void }) {
  return (
    <section id="stage" className="section-window paper-card">
      <WindowBar title="MY STAGE — performance archive" />
      <div className="p-5">
        <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="micro text-[#df3b70]">VIDEO / ACTIVITY ARCHIVE</p><h2 className="section-title mt-1">MY STAGE</h2><p className="mt-2 text-sm text-[#70445b]">Some things are better shown than written.</p></div><div className="sticker pink">PLAYLIST 03</div></div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {performanceLinks.map((item, index) => <article key={item.id} className="group border-3 border-[#572b4d] bg-[#fff8e9] p-3 shadow-[5px_5px_0_#572b4d]">
            <button className="relative block aspect-video w-full overflow-hidden border-2 border-[#572b4d] text-left" style={{ background: item.color }} onClick={() => onVideo(item)} data-testid={`button-performance-${item.id}`}>
              <span className="absolute left-3 top-3 font-mono text-[10px] text-[#572b4d]">STAGE TAPE / 0{index + 1}</span>
              <Play className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#572b4d] bg-[#fff8e9] p-3 text-[#df3b70] shadow-[3px_3px_0_#572b4d]" size={58} />
              <span className="absolute bottom-2 right-2 font-mono text-[9px] text-[#572b4d]">OPEN VIDEO</span>
            </button>
            <p className="micro mt-4 text-[#df3b70]">{item.year}</p><h3 className="mt-1 min-h-12 text-sm font-black leading-5 text-[#572b4d]">{item.title}</h3><p className="mt-2 text-xs leading-5 text-[#70445b]">{item.detail}</p>
            <button className="mt-4 flex items-center gap-2 font-mono text-[10px] font-bold text-[#d72e67]" onClick={() => onVideo(item)} data-testid={`button-open-video-${item.id}`}>WATCH VIDEO <ExternalLink size={13} /></button>
          </article>)}
        </div>
      </div>
    </section>
  );
}

function AchievementsSection() {
  const badges = [
    ['1', 'FIRST PRIZE', 'Melody of Youth — Thanh Xuan - Cau Giay Cluster (2022)'],
    ['3', 'THIRD PRIZE', 'High School Choir Festival — Thanh Xuan - Cau Giay Cluster'],
    ['CP', 'CERTIFICATE', 'Certificate of Completion: Create agents in Microsoft Copilot Studio'],
    ['AI', 'CERTIFICATE', 'Certificate of Completion: Transform business workflows with generative AI'],
  ];
  const skills = ['Word', 'Excel', 'Powerpoint', 'Canva', 'AI tools'];
  return (
    <section id="achievements" className="section-window paper-card">
      <WindowBar title="COLLECTION — badges and skill stickers" />
      <div className="grid gap-7 p-5 lg:grid-cols-[1.2fr_.8fr]">
        <div><p className="micro text-[#df3b70]">COLLECTED NOTES</p><h2 className="section-title mt-1">ACHIEVEMENT UNLOCKED</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{badges.map(([mark, title, text]) => <div className="badge" key={text}><span className="badge-mark">{mark}</span><div><p className="micro">{title}</p><p className="mt-1 text-xs leading-4 text-[#70445b]">{text}</p></div></div>)}</div></div>
        <div><p className="micro text-[#df3b70]">STICKER SHEET</p><h2 className="section-title mt-1">SKILL STICKERS</h2><div className="mt-5 flex flex-wrap gap-3">{skills.map((skill, i) => <span className={`sticker ${['yellow', 'blue', 'lime', 'pink'][i % 4]}`} key={skill}>{skill}</span>)}</div><div className="mt-7 border-2 border-[#572b4d] bg-[#ffedd7] p-4"><p className="micro">LANGUAGES</p><p className="mt-2 text-sm font-bold text-[#572b4d]">Vietnamese · English · Korean</p><p className="micro mt-5">STRENGTHS</p><p className="mt-2 text-xs leading-6 text-[#70445b]">Hardworking · Punctual · Diligent · Always willing to listen and learn.</p></div></div>
      </div>
    </section>
  );
}

function DiarySection() {
  return (
    <section id="diary" className="section-window paper-card">
      <WindowBar title="DIARY.txt — little updates" />
      <div className="grid gap-5 p-5 md:grid-cols-[1fr_220px]">
        <div><p className="micro text-[#df3b70]">PRIVATE / PUBLIC NOTE</p><h2 className="section-title mt-1">MY DIARY</h2><div className="mt-5 space-y-4"><article className="border-l-4 border-[#ef4e77] bg-[#fff0d6] p-4"><p className="micro">NOTE 001 / MINI HOMEPAGE</p><p className="mt-2 text-sm leading-6 text-[#70445b]">Another little update from my internet world. Collecting memories, projects and little ideas.</p></article><article className="border-l-4 border-[#62cfe5] bg-[#e0f8fb] p-4"><p className="micro">NOTE 002 / CURRENTLY</p><p className="mt-2 text-sm leading-6 text-[#70445b]">Currently building my next chapter.</p></article></div></div>
        <div className="border-2 border-[#572b4d] bg-[#ffea65] p-4 shadow-[4px_4px_0_#572b4d]"><p className="micro">DESK MEMO</p><div className="mt-5 text-center"><Music2 className="mx-auto text-[#d9376c]" size={38} /><p className="mt-3 font-mono text-xs font-bold text-[#572b4d]">SOUNDTRACK<br />PAUSED UNTIL ENTER</p></div></div>
      </div>
    </section>
  );
}

function GuestbookSection() {
  const [nickname, setNickname] = useState('');
  const [message, setMessage] = useState('');
  const [guests, setGuests] = useState<Guest[]>(() => {
    try { const stored = localStorage.getItem('mai-anh-guestbook'); return stored ? [...demoGuests, ...JSON.parse(stored) as Guest[]] : demoGuests; } catch { return demoGuests; }
  });
  const [flash, setFlash] = useState<string | null>(null);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!nickname.trim() || !message.trim()) { setFlash('Please add a nickname and a message.'); return; }
    const next: Guest = { id: `guest-${Date.now()}`, nickname: nickname.trim(), message: message.trim(), hearts: 0 };
    const userGuests = guests.filter((item) => !item.demo);
    const updated = [next, ...userGuests];
    setGuests([...demoGuests, ...updated]);
    localStorage.setItem('mai-anh-guestbook', JSON.stringify(updated));
    setNickname(''); setMessage(''); setFlash('Your note is pinned to the board.');
  };
  const react = (id: string) => {
    setGuests((current) => current.map((item) => item.id === id ? { ...item, hearts: item.hearts + 1 } : item));
    setFlash('LOVE added to this note.');
  };
  return (
    <section id="guestbook" className="section-window paper-card">
      <WindowBar title="GUESTBOOK — sign the board" />
      <div className="grid gap-6 p-5 lg:grid-cols-[.8fr_1.2fr]">
        <form onSubmit={submit} className="border-2 border-[#572b4d] bg-[#a8edfb] p-4 shadow-[4px_4px_0_#572b4d]">
          <p className="micro text-[#572b4d]">LEAVE A NOTE</p><h2 className="section-title mt-1">GUESTBOOK</h2>
          <label className="micro mt-5 block">NICKNAME<input className="input-retro mt-2" value={nickname} onChange={(e) => setNickname(e.target.value)} maxLength={30} placeholder="your screen name" data-testid="input-guestbook-nickname" /></label>
          <label className="micro mt-4 block">MESSAGE<textarea className="input-retro mt-2 min-h-24 resize-y" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={180} placeholder="write something nice..." data-testid="input-guestbook-message" /></label>
          <button className="glossy-button mt-4" type="submit" data-testid="button-submit-guestbook">PIN MESSAGE</button>
          {flash && <p className="mt-3 font-mono text-[10px] text-[#c72f62]" role="status" data-testid="status-guestbook">{flash}</p>}
        </form>
        <div className="border-2 border-[#572b4d] bg-[#fff0d6] p-4">
          <div className="flex items-center justify-between"><p className="micro">MESSAGE BOARD</p><span className="sticker yellow !text-[9px]">LOCAL ONLY</span></div>
          <div className="mt-2">{guests.map((item) => <div className="guest-line" key={item.id}><div className="flex items-center justify-between gap-3"><p className="font-mono text-xs font-bold text-[#572b4d]">{item.nickname} {item.demo && <span className="text-[#d94170]">[DEMO DATA]</span>}</p><button className="flex items-center gap-1 font-mono text-[10px] text-[#d94170]" onClick={() => react(item.id)} data-testid={`button-react-guest-${item.id}`}><Heart size={13} fill="currentColor" /> {item.hearts}</button></div><p className="mt-1 text-xs text-[#70445b]">{item.message}</p></div>)}</div>
        </div>
      </div>
    </section>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="section-window paper-card">
      <WindowBar title="CONTACT — open channel" />
      <div className="grid gap-4 p-5 md:grid-cols-3">
        <div className="border-2 border-[#572b4d] bg-[#ffea65] p-4"><p className="micro">EMAIL</p><a href="mailto:maianhh4107@gmail.com" className="mt-2 block break-all text-sm font-bold text-[#d33368]" data-testid="link-contact-email">maianhh4107@gmail.com</a></div>
        <div className="border-2 border-[#572b4d] bg-[#ff9dbb] p-4"><p className="micro">PHONE</p><a href="tel:+84339036607" className="mt-2 block text-sm font-bold text-[#572b4d]" data-testid="link-contact-phone">(+84) 339036607</a></div>
        <div className="border-2 border-[#572b4d] bg-[#a8edfb] p-4"><p className="micro">LOCATION</p><p className="mt-2 text-sm font-bold text-[#572b4d]">Thanh Xuan, Ha Noi</p></div>
      </div>
    </section>
  );
}

function WorkModal({ id, onClose }: { id: string; onClose: () => void }) {
  const item = id === 'np'
    ? { org: 'NP EDUCATION', year: '2026', position: 'Customer Service Officer', duties: ['Taking attendance', 'Sending learning reports to parents after each lesson', 'Creating class materials', 'Assisting students and teachers when needed'] }
    : { org: 'GTP MEDIA', year: '2025', position: 'KOL/KOC Booker', duties: ['Responsible for finding and contacting suitable KOLs and KOCs to review the brand’s products.', 'Setting up TikTokShop and Shopee stores.', 'Creating videos for KOCs.', 'Responsible for posting content on the brand’s fanpage.'] };
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div className="modal-window"><WindowBar title={`${item.org} — folder opened`} onClose={onClose} /><div className="p-5"><p className="micro text-[#df3b70]">{item.year} / WORK EXPERIENCE</p><h2 className="section-title mt-1">{item.org}</h2><p className="mt-2 font-mono text-sm text-[#70445b]">{item.position}</p><ul className="mt-5 space-y-3">{item.duties.map((duty) => <li key={duty} className="flex gap-2 text-sm text-[#70445b]"><span className="text-[#df3b70]">▸</span>{duty}</li>)}</ul></div></div></div>;
}

function PerformanceModal({ item, onClose }: { item: Performance; onClose: () => void }) {
  const id = item.url.match(/youtu\.be\/([^?]+)/)?.[1] ?? '';
  return <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}><div className="modal-window"><WindowBar title="MY STAGE / VIDEO PLAYER" onClose={onClose} /><div className="p-4 sm:p-6"><div className="aspect-video border-3 border-[#572b4d] bg-[#211833]"><iframe className="h-full w-full" src={`https://www.youtube-nocookie.com/embed/${id}`} title={item.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div><p className="micro mt-5 text-[#df3b70]">{item.year}</p><h2 className="mt-1 text-xl font-black text-[#572b4d]">{item.title}</h2><p className="mt-2 text-sm text-[#70445b]">{item.detail}</p><div className="mt-5 flex flex-wrap gap-3"><a href={item.url} target="_blank" rel="noreferrer" className="glossy-button inline-flex items-center gap-2" data-testid="link-watch-youtube">WATCH ON YOUTUBE <ExternalLink size={14} /></a><button className="nav-chip" onClick={onClose} data-testid="button-close-video">CLOSE WINDOW</button></div></div></div></div>;
}

function Homepage({ soundOn, onToggleSound, onResumeMusic }: { soundOn: boolean; onToggleSound: () => void; onResumeMusic?: () => void }) {
  const [active, setActive] = useState<SectionId>('home');
  const [workModal, setWorkModal] = useState<string | null>(null);
  const [performance, setPerformance] = useState<Performance | null>(null);
  const [noteWindowOpen, setNoteWindowOpen] = useState(false);
  const [photoBoothOpen, setPhotoBoothOpen] = useState(false);
  const [note, setNote] = useState<MoodNote | null>(() => {
    try {
      const stored = localStorage.getItem('mai-anh-mood-note');
      return stored ? JSON.parse(stored) as MoodNote : null;
    } catch {
      return null;
    }
  });
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  const [calendarSummary, setCalendarSummary] = useState<CalendarSummary>();
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [calendarError, setCalendarError] = useState(false);
  useEffect(() => {
    let active = true;
    const loadCalendar = async () => {
      setCalendarLoading(true);
      try {
        const response = await fetch(`/api/calendar/summary?timeZone=${encodeURIComponent(timeZone)}`);
        if (!response.ok) throw new Error(`Calendar request failed: ${response.status}`);
        const data = await response.json() as CalendarSummary;
        if (active) {
          setCalendarSummary(data);
          setCalendarError(false);
        }
      } catch {
        if (active) setCalendarError(true);
      } finally {
        if (active) setCalendarLoading(false);
      }
    };
    void loadCalendar();
    const interval = window.setInterval(loadCalendar, 60_000);
    return () => {
      active = false;
      window.clearInterval(interval);
    };
  }, [timeZone]);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target.id) setActive(visible.target.id as SectionId);
    }, { rootMargin: '-18% 0px -60% 0px', threshold: [0.1, 0.35, 0.7] });
    navItems.concat({ id: 'achievements', label: 'ACHIEVEMENTS' }, { id: 'contact', label: 'CONTACT' }).forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setPerformance(null);
        setWorkModal(null);
        setPhotoBoothOpen(false);
        onResumeMusic?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onResumeMusic]);
  const nav = useMemo(() => navItems, []);
  const openSection = (id: SectionId) => scrollToSection(id);
  const saveMoodNote = (text: string) => {
    const nextNote = { text, savedAt: new Date().toISOString() };
    setNote(nextNote);
    localStorage.setItem('mai-anh-mood-note', JSON.stringify(nextNote));
  };
  const handleCloseBooth = () => {
    setPhotoBoothOpen(false);
    onResumeMusic?.();
  };
  const handleClosePerformance = () => {
    setPerformance(null);
    onResumeMusic?.();
  };
  return (
    <main className="world-wallpaper min-h-dvh pb-12 pt-3">
      <div className="retro-shell">
        <div className="browser-top flex flex-wrap items-center gap-2 px-3 py-2"><span className="font-bold">◉ MAI ANH&apos;S MINI HOMEPAGE</span><span className="hidden text-cyan-50/80 sm:inline">— personal internet room</span><span className="ml-auto flex gap-1"><i className="h-3 w-3 bg-[#ffec68]" /><i className="h-3 w-3 bg-[#a9f35b]" /><i className="h-3 w-3 bg-[#ff837e]" /></span></div>
         <div className="flex flex-wrap items-center gap-2 border-b-2 border-[#572b4d] bg-[#f8c3d3] p-2"><span className="browser-address min-w-[220px] flex-1 px-3 py-1">MINI HOMEPAGE / PERSONAL INTERNET ROOM</span><span className="micro text-[#572b4d]">STATUS: ONLINE</span><button className={`nav-chip ml-auto !px-2 !py-1 ${soundOn ? 'active' : ''}`} onClick={onToggleSound} data-testid="button-toggle-sound"><Music2 size={13} className="inline" /> {soundOn ? 'SOUND ON' : 'SOUND OFF'}</button></div>
        <nav className="flex gap-2 overflow-x-auto border-b-3 border-[#572b4d] bg-[#fff0d6] p-2" aria-label="Homepage navigation">{nav.map((item) => <button key={item.id} className={`nav-chip shrink-0 ${active === item.id ? 'active' : ''}`} onClick={() => openSection(item.id)} data-testid={`button-nav-${item.id}`}>{item.label}</button>)}</nav>
         <div className="space-y-7 p-3 sm:p-5">
           <HeroHome onOpen={openSection} onOpenPhotoBooth={() => setPhotoBoothOpen(true)} calendarSummary={calendarSummary} calendarLoading={calendarLoading} calendarError={calendarError} note={note} onCreateNote={() => setNoteWindowOpen(true)} />
           <ProfileSection />
           <MiniPhotoBoothBanner onOpen={() => setPhotoBoothOpen(true)} />
           <WorkSection onOpen={setWorkModal} />
           <StageSection onVideo={setPerformance} />
           <AchievementsSection />
           <DiarySection />
           <GuestbookSection />
           <ContactSection />
         </div>
        <footer className="border-t-3 border-[#572b4d] bg-[#7c49a4] px-4 py-5 text-center font-mono text-[10px] text-[#fff8e9]">END OF PAGE / THANK YOU FOR VISITING / <button className="underline" onClick={() => scrollToSection('home')} data-testid="button-back-top">BACK TO TOP</button></footer>
      </div>
      {workModal && <WorkModal id={workModal} onClose={() => setWorkModal(null)} />}
      {performance && <PerformanceModal item={performance} onClose={handleClosePerformance} />}
      {noteWindowOpen && <MoodNoteWindow initialNote={note} onClose={() => setNoteWindowOpen(false)} onSave={saveMoodNote} />}
      <MiniPhotoBoothModal isOpen={photoBoothOpen} onClose={handleCloseBooth} onStreamClose={onResumeMusic} />
    </main>
  );
}

function App() {
  const [entered, setEntered] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(bgmAudio);
    audio.loop = true;
    audio.volume = 0.35;

    // Bulletproof loop listener so music never stops at the end of track
    const handleEnded = () => {
      if (audioRef.current && soundOn) {
        audio.currentTime = 0;
        void audio.play().catch(() => {});
      }
    };
    audio.addEventListener('ended', handleEnded);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [soundOn]);

  // Keep audio playing on user interactions if soundOn is enabled
  useEffect(() => {
    if (!entered || !soundOn) return;

    const resumeIfPaused = () => {
      const audio = audioRef.current;
      if (audio && audio.paused && soundOn) {
        void audio.play().catch(() => {});
      }
    };

    // Auto-resume on tab focus
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && soundOn) {
        resumeIfPaused();
      }
    };

    window.addEventListener('click', resumeIfPaused);
    window.addEventListener('touchstart', resumeIfPaused);
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      window.removeEventListener('click', resumeIfPaused);
      window.removeEventListener('touchstart', resumeIfPaused);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [entered, soundOn]);

  const startMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setSoundOn(true);
    void audio.play().catch(() => {
      // Don't turn soundOn to false; keep user intent enabled, click listeners will start it on first touch
    });
  };

  const resumeMusic = () => {
    const audio = audioRef.current;
    if (audio && soundOn && audio.paused) {
      void audio.play().catch(() => {});
    }
  };

  const toggleSound = () => {
    const nextValue = !soundOn;
    setSoundOn(nextValue);
    const audio = audioRef.current;
    if (!audio) return;
    if (nextValue) {
      audio.currentTime = audio.currentTime || 0;
      void audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return entered
    ? <Homepage soundOn={soundOn} onToggleSound={toggleSound} onResumeMusic={resumeMusic} />
    : <IntroScreen onStartMusic={startMusic} onEnter={() => setEntered(true)} />;
}

export default App;