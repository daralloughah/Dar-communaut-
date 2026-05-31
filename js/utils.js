// ======================== UTILITY FUNCTIONS ========================

// Toast Notifications
function showToast(message, type = 'info', duration = 3000) {
  const toastContainer = document.getElementById('toastContainer') || createToastContainer();
  
  const toast = document.createElement('div');
  toast.className = `glass-dark rounded-lg p-4 mb-2 border border-emerald-500/20 animate-slideInDown`;
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-lg">${TOAST_TYPES[type]?.icon || 'ℹ️'}</span>
      <span>${message}</span>
    </div>
  `;
  
  toastContainer.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, duration);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.id = 'toastContainer';
  container.className = 'fixed top-6 right-6 z-50 w-96 max-w-full';
  document.body.appendChild(container);
  return container;
}

// Format Date
function formatDate(date, locale = 'fr-FR') {
  const d = new Date(date);
  const now = new Date();
  const diff = now - d;

  // Less than 1 minute
  if (diff < 60000) return 'À l\'instant';

  // Less than 1 hour
  if (diff < 3600000) {
    const mins = Math.floor(diff / 60000);
    return `Il y a ${mins}m`;
  }

  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `Il y a ${hours}h`;
  }

  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `Il y a ${days}j`;
  }

  // Format as date
  return d.toLocaleDateString(locale);
}

// Format Number
function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

// Validate Email
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Validate Password
function validatePassword(password) {
  return password && password.length >= 6;
}

// Truncate Text
function truncateText(text, length = 100) {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}

// Generate Avatar
function generateAvatar(name) {
  if (!name) return 'AY';
  return name.substring(0, 2).toUpperCase();
}

// Generate Random Color
function getAvatarColor(name) {
  const colors = [
    'bg-gradient-to-br from-blue-500 to-cyan-500',
    'bg-gradient-to-br from-purple-500 to-pink-500',
    'bg-gradient-to-br from-green-500 to-teal-500',
    'bg-gradient-to-br from-yellow-500 to-orange-500',
    'bg-gradient-to-br from-red-500 to-pink-500',
    'bg-gradient-to-br from-indigo-500 to-emerald-500',
  ];
  
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

// Debounce
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Copy to Clipboard
async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showToast('Copié !', 'success');
  } catch (error) {
    console.error('Copy error:', error);
    showToast('Erreur copie', 'error');
  }
}

// Get URL Parameters
function getUrlParam(param) {
  const searchParams = new URLSearchParams(window.location.search);
  return searchParams.get(param);
}

// Format Price
function formatPrice(price) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

// Safe HTML Escape
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// Check if User is Online
function isUserOnline(lastSeen) {
  const now = new Date();
  const lastSeenDate = new Date(lastSeen);
  const diffMinutes = (now - lastSeenDate) / (1000 * 60);
  return diffMinutes < 5;
}

// Get Initials
function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

// Sleep (Promise)
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('✅ Utils loaded');
