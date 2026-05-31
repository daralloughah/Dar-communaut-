// ======================== SUPABASE CONFIG ========================
const SUPABASE_CONFIG = {
  URL: 'https://swcytwobqvotkcaqzqus.supabase.co',
  ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3Y3l0d29icXZvdGtjYXF6cXVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNDY2NDIsImV4cCI6MjA5NTgyMjY0Mn0.3Ni927oWmyqVM1KtPxq6ebcey_DPC64SgQDgGmePjXk',
};

// ======================== APP CONFIG ========================
const APP_CONFIG = {
  appName: 'Dar Al Loughah',
  appTagline: 'Communauté',
  maxBioLength: 500,
  maxPostLength: 5000,
  messagesPerPage: 50,
  postsPerPage: 20,
};

// ======================== COLORS ========================
const COLORS = {
  primary: '#6366f1',
  secondary: '#10b981',
  gold: '#D4AF37',
};

// ======================== TOAST TYPES ========================
const TOAST_TYPES = {
  success: { icon: '✅', color: 'text-emerald-400' },
  error: { icon: '❌', color: 'text-red-400' },
  warning: { icon: '⚠️', color: 'text-yellow-400' },
  info: { icon: 'ℹ️', color: 'text-blue-400' },
};

// ======================== ANNONCE TYPES ========================
const ANNONCE_TYPES = {
  prof: 'Je suis prof',
  cherche: 'Cherche prof',
  correspondant: 'Correspondant',
  zawaj: 'Zawaj',
};

// ======================== FORMATION CATEGORIES ========================
const FORMATION_CATEGORIES = {
  arabe: 'Arabe Classique',
  quran: 'Quran',
  hadith: 'Hadith',
  fiqh: 'Fiqh',
};

// ======================== USER BADGES ========================
const USER_BADGES = {
  newbie: { icon: '🌟', label: 'Nouveau' },
  helper: { icon: '🤝', label: 'Aidant' },
  teacher: { icon: '👨‍🏫', label: 'Enseignant' },
  streak7: { icon: '🔥', label: 'Streak 7j' },
  streak30: { icon: '🌪️', label: 'Streak 30j' },
};

console.log('✅ Constants loaded');
