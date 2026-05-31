// ======================== APP MAIN ========================
const app = {
  state: {
    currentPage: 'accueil',
    currentChatUser: null,
    realtimeSubscription: null,
  },

  // ======================== AUTH ========================
  async handleLogin() {
    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
      showToast('Remplissez tous les champs', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      showToast('Email invalide', 'error');
      return;
    }

    try {
      showToast('Connexion en cours...', 'info');
      await auth.signIn(email, password);
      showToast('Connecté !', 'success');
      closeModal('loginModal');
      this.updateUI();
      await this.loadFeed();
    } catch (error) {
      showToast(error.message || 'Erreur connexion', 'error');
    }
  },

  async handleRegister() {
    alert('🔵 Inscription en cours...');
    const name = document.getElementById('registerName')?.value;
    const email = document.getElementById('registerEmail')?.value;
    const password = document.getElementById('registerPassword')?.value;
    const confirm = document.getElementById('registerPasswordConfirm')?.value;

    if (!name || !email || !password || !confirm) {
      alert('⚠️ Remplissez TOUS les champs!');
      showToast('Remplissez tous les champs', 'warning');
      return;
    }

    if (!validateEmail(email)) {
      alert(`⚠️ Email invalide: ${email}`);
      showToast('Email invalide', 'error');
      return;
    }

    if (!validatePassword(password)) {
      alert('⚠️ Mot de passe: minimum 6 caractères');
      showToast('Minimum 6 caractères', 'error');
      return;
    }

    if (password !== confirm) {
      alert('⚠️ Les mots de passe ne correspondent pas');
      showToast('Mots de passe non identiques', 'error');
      return;
    }

    try {
      alert('⏳ Appel auth.signUp...');
      showToast('Inscription en cours...', 'info');
      await auth.signUp(email, password, name);
      alert('✅✅✅ COMPTE CRÉÉ! ✅✅✅');
      showToast('Compte créé !', 'success');
      closeModal('registerModal');
      this.updateUI();
      await this.loadFeed();
    } catch (error) {
      alert(`💥 ERREUR: ${error.message}`);
      showToast(error.message || 'Erreur inscription', 'error');
    }
  },

  handleLogout() {
    auth.signOut();
    showToast('Déconnecté', 'info');
    closeModal('settingsModal');
    this.updateUI();
    openModal('loginModal');
  },

  // ======================== POSTS ========================
  async createPost() {
    const text = document.getElementById('composerText')?.value;

    if (!text) {
      showToast('Écrivez quelque chose !', 'warning');
      return;
    }

    if (!auth.isLoggedIn()) {
      showToast('Connectez-vous d\'abord', 'warning');
      return;
    }

    try {
      showToast('Publication...', 'info');
      await supabase.createPost(auth.user.id, text);
      document.getElementById('composerText').value = '';
      showToast('Post publié !', 'success');
      await this.loadFeed();
    } catch (error) {
      showToast(error.message || 'Erreur publication', 'error');
    }
  },

  async loadFeed() {
    try {
      const posts = await supabase.getPosts(50);
      const container = document.getElementById('feedContainer');

      if (!container) return;

      container.innerHTML = posts.map(post => {
        const user = post.user || {};
        return `
          <div class="glass-dark rounded-2xl p-4 sm:p-6 border border-emerald-500/20 card-hover animate-slideInUp">
            <div class="flex items-start gap-3 sm:gap-4 pb-4 border-b border-indigo-500/20">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full grad-primary flex items-center justify-center font-bold flex-shrink-0 text-sm">${generateAvatar(user.name || 'User')}</div>
              <div class="flex-1">
                <div class="font-bold text-sm">${user.name || 'Anonyme'}</div>
                <div class="text-xs text-gray-400">${formatDate(post.created_at)}</div>
              </div>
              ${auth.user?.id === post.user_id ? `
                <button onclick="app.deletePost('${post.id}')" class="flex-shrink-0 p-2 hover:bg-red-500/10 rounded-lg transition-all text-red-400">
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
                </button>
              ` : ''}
            </div>
            <p class="text-sm leading-relaxed py-4">${escapeHtml(post.content)}</p>
            <div class="flex gap-2 pt-4 border-t border-indigo-500/20">
              <button class="px-3 py-1 rounded-full text-xs font-bold glass hover:border-emerald-500/60">🤲 ${post.likes || 0}</button>
              <button class="px-3 py-1 rounded-full text-xs font-bold glass hover:border-emerald-500/60">💬 0</button>
            </div>
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Load feed error:', error);
    }
  },

  async deletePost(postId) {
    if (!confirm('Supprimer ce post ?')) return;

    try {
      await supabase.deletePost(postId);
      showToast('Post supprimé', 'success');
      await this.loadFeed();
    } catch (error) {
      showToast(error.message || 'Erreur suppression', 'error');
    }
  },

  // ======================== ANNONCES ========================
  async handleCreateAnnonce() {
    const type = document.getElementById('annonceType')?.value;
    const title = document.getElementById('annonceTitle')?.value;
    const desc = document.getElementById('annonceDesc')?.value;
    const location = document.getElementById('annonceLocation')?.value;

    if (!type || !title || !desc || !location) {
      showToast('Remplissez tous les champs', 'warning');
      return;
    }

    if (!auth.isLoggedIn()) {
      showToast('Connectez-vous d\'abord', 'warning');
      return;
    }

    try {
      showToast('Création annonce...', 'info');
      await supabase.createAnnonce(auth.user.id, type, title, desc, location);
      showToast('Annonce créée !', 'success');
      closeModal('createAnnonceModal');
      await this.loadAnnonces();
    } catch (error) {
      showToast(error.message || 'Erreur création', 'error');
    }
  },

  async loadAnnonces() {
    try {
      const filter = document.querySelector('.annonce-filter.active')?.dataset.filter || 'all';
      let annonces;

      if (filter === 'all') {
        annonces = await supabase.getAnnonces();
      } else {
        annonces = await supabase.getAnnonces(filter);
      }

      const container = document.getElementById('annoncesContainer');
      if (!container) return;

      container.innerHTML = annonces.map(annonce => {
        const user = annonce.user || {};
        return `
          <div class="glass-dark rounded-2xl p-4 sm:p-6 border border-emerald-500/20 card-hover">
            <div class="flex items-start gap-3 pb-3 border-b border-indigo-500/20">
              <div class="w-10 h-10 rounded-full grad-primary flex items-center justify-center font-bold text-sm">${generateAvatar(user.name || 'User')}</div>
              <div class="flex-1">
                <h3 class="font-bold text-sm">${annonce.title}</h3>
                <p class="text-xs text-gray-400">${user.name || 'Anonyme'}</p>
              </div>
              <span class="badge px-2 py-1 rounded-full text-xs bg-blue-500/20 text-blue-400">${annonce.type}</span>
            </div>
            <p class="text-sm py-3">${truncateText(annonce.description, 100)}</p>
            <p class="text-xs text-gray-400 mb-3">📍 ${annonce.location}</p>
            <button class="w-full py-2 rounded-lg grad-primary text-sm font-bold hover:scale-105" onclick="app.contactUser('${user.id}')">Contacter</button>
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Load annonces error:', error);
    }
  },

  // ======================== FORMATIONS ========================
  async handleCreateFormation() {
    const title = document.getElementById('formationTitle')?.value;
    const category = document.getElementById('formationCategory')?.value;
    const desc = document.getElementById('formationDesc')?.value;
    const price = document.getElementById('formationPrice')?.value;
    const hours = document.getElementById('formationHours')?.value;

    if (!title || !category || !desc || !price) {
      showToast('Remplissez tous les champs', 'warning');
      return;
    }

    if (!auth.isLoggedIn()) {
      showToast('Connectez-vous d\'abord', 'warning');
      return;
    }

    try {
      showToast('Création formation...', 'info');
      await supabase.createFormation(auth.user.id, title, category, desc, parseFloat(price), parseInt(hours) || 0);
      showToast('Formation créée !', 'success');
      closeModal('createFormationModal');
      await this.loadFormations();
    } catch (error) {
      showToast(error.message || 'Erreur création', 'error');
    }
  },

  async loadFormations() {
    try {
      const filter = document.querySelector('.formation-filter.active')?.dataset.filter || 'all';
      let formations;

      if (filter === 'all') {
        formations = await supabase.getFormations();
      } else {
        formations = await supabase.getFormations(filter);
      }

      const container = document.getElementById('formationsContainer');
      if (!container) return;

      container.innerHTML = formations.map(formation => {
        const user = formation.user || {};
        return `
          <div class="glass-dark rounded-2xl p-4 sm:p-6 border border-emerald-500/20 card-hover">
            <h3 class="font-bold text-sm mb-2">${formation.title}</h3>
            <p class="text-xs text-gray-400 mb-3">${user.name || 'Prof'} • ${formation.hours}h</p>
            <p class="text-sm leading-relaxed py-2 mb-3">${truncateText(formation.description, 80)}</p>
            <div class="flex items-center justify-between">
              <span class="text-xl font-bold grad-text">${formatPrice(formation.price)}</span>
              <button class="px-4 py-1 rounded-lg grad-primary text-xs font-bold hover:scale-105" onclick="app.enrollFormation('${formation.id}')">S'inscrire</button>
            </div>
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Load formations error:', error);
    }
  },

  enrollFormation(formationId) {
    if (!auth.isLoggedIn()) {
      showToast('Connectez-vous d\'abord', 'warning');
      return;
    }
    showToast('Inscription en cours...', 'success');
    // TODO: Implement enrollment
  },

  // ======================== MESSAGES ========================
  async sendMessage() {
    const input = document.getElementById('msgInput');
    const msg = input?.value.trim();

    if (!msg) return;

    if (!auth.isLoggedIn() || !this.state.currentChatUser) {
      showToast('Sélectionnez un utilisateur', 'warning');
      return;
    }

    try {
      await supabase.sendMessage(auth.user.id, this.state.currentChatUser, msg);
      input.value = '';
      await this.loadMessages();
    } catch (error) {
      showToast(error.message || 'Erreur envoi', 'error');
    }
  },

  async loadMessages(userId) {
    if (!userId) {
      console.warn('No user ID provided');
      return;
    }

    try {
      const messages = await supabase.getMessages(auth.user.id, userId);
      const chatBox = document.getElementById('chatBox');

      if (!chatBox) return;

      chatBox.innerHTML = messages.map(msg => {
        const isSent = msg.sender_id === auth.user.id;
        return `
          <div class="animate-slideInUp">
            <div class="msg-${isSent ? 'sent' : 'recv'} glass rounded-2xl rounded-${isSent ? 'br' : 'bl'}-none px-4 py-3 max-w-xs text-sm ${isSent ? 'ml-auto grad-primary' : ''}">
              ${!isSent ? `<div class="font-bold text-emerald-400 text-xs mb-1">${escapeHtml(msg.user?.name || 'User')}</div>` : ''}
              <div>${escapeHtml(msg.content)}</div>
              <div class="text-xs opacity-70 mt-1">${formatDate(msg.created_at)}</div>
            </div>
          </div>
        `;
      }).join('');

      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error('Load messages error:', error);
    }
  },

  contactUser(userId) {
    if (!auth.isLoggedIn()) {
      showToast('Connectez-vous d\'abord', 'warning');
      return;
    }

    this.state.currentChatUser = userId;
    toggleChat();
    showToast('Chat ouvert', 'success');
    this.loadMessages(userId);
  },

  // ======================== AIDS ========================
  async handleCreateAid() {
    const title = document.getElementById('aidTitle')?.value;
    const desc = document.getElementById('aidDesc')?.value;
    const category = document.getElementById('aidCategory')?.value;
    const urgency = document.getElementById('aidUrgency')?.value;

    if (!title || !desc || !category) {
      showToast('Remplissez tous les champs', 'warning');
      return;
    }

    if (!auth.isLoggedIn()) {
      showToast('Connectez-vous d\'abord', 'warning');
      return;
    }

    try {
      showToast('Création demande...', 'info');
      await supabase.createAid(auth.user.id, title, desc, category, urgency);
      showToast('Demande créée !', 'success');
      closeModal('createAidModal');
      await this.loadAids();
    } catch (error) {
      showToast(error.message || 'Erreur création', 'error');
    }
  },

  async loadAids() {
    try {
      const aids = await supabase.getAids();
      const container = document.getElementById('aidContainer');

      if (!container) return;

      container.innerHTML = aids.map(aid => {
        const user = aid.user || {};
        return `
          <div class="glass-dark rounded-2xl p-4 sm:p-6 border border-emerald-500/20 card-hover">
            <div class="flex items-start gap-3 pb-3 border-b border-indigo-500/20">
              <div class="w-10 h-10 rounded-full grad-primary flex items-center justify-center font-bold text-sm">${generateAvatar(user.name || 'User')}</div>
              <div class="flex-1">
                <h3 class="font-bold text-sm">${aid.title}</h3>
                <p class="text-xs text-gray-400">${user.name || 'Anonyme'}</p>
              </div>
              <span class="badge px-2 py-1 rounded-full text-xs ${aid.urgency === 'urgent' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}">${aid.urgency}</span>
            </div>
            <p class="text-sm py-3">${truncateText(aid.description, 100)}</p>
            <div class="flex gap-2">
              <button class="flex-1 py-2 rounded-lg glass hover:bg-indigo-500/10 text-sm font-bold">Voir</button>
              <button class="flex-1 py-2 rounded-lg grad-primary text-sm font-bold" onclick="app.contactUser('${user.id}')">Répondre</button>
            </div>
          </div>
        `;
      }).join('');
    } catch (error) {
      console.error('Load aids error:', error);
    }
  },

  // ======================== PROFILE ========================
  async loadProfile() {
    if (!auth.isLoggedIn()) {
      openModal('loginModal');
      return;
    }

    const profile = auth.getUserProfile();
    if (!profile) return;

    document.getElementById('profileName').textContent = profile.name;
    document.getElementById('profileAvatar').textContent = generateAvatar(profile.name);
    document.getElementById('profileBio').textContent = profile.bio || 'Pas de bio';
    document.getElementById('profileLevel').textContent = profile.level || 1;
    document.getElementById('profileXP').textContent = profile.xp || 0;
    document.getElementById('profileStreak').textContent = profile.streak || 0;
  },

  async handleEditProfile() {
    const name = document.getElementById('editName')?.value;
    const bio = document.getElementById('editBio')?.value;
    const country = document.getElementById('editCountry')?.value;
    const city = document.getElementById('editCity')?.value;

    if (!name && !bio && !country && !city) {
      showToast('Remplissez au moins un champ', 'warning');
      return;
    }

    try {
      showToast('Mise à jour...', 'info');
      const updateData = {};
      if (name) updateData.name = name;
      if (bio) updateData.bio = bio;
      if (country) updateData.country = country;
      if (city) updateData.city = city;

      await auth.updateProfile(updateData);
      showToast('Profil mis à jour !', 'success');
      closeModal('editProfileModal');
      this.updateUI();
    } catch (error) {
      showToast(error.message || 'Erreur update', 'error');
    }
  },

  // ======================== UI ========================
  updateUI() {
    if (auth.isLoggedIn()) {
      const profile = auth.getUserProfile();
      document.getElementById('userAvatarComposer').textContent = generateAvatar(profile?.name || 'User');
      document.querySelector('#loginModal')?.classList.remove('active');
    } else {
      document.getElementById('userAvatarComposer').textContent = 'AY';
    }
  },

  // ======================== FILTERS ========================
  async initFilters() {
    document.querySelectorAll('.annonce-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.annonce-filter').forEach(b => b.classList.remove('active', 'grad-primary'));
        btn.classList.add('active', 'grad-primary');
        this.loadAnnonces();
      });
    });

    document.querySelectorAll('.formation-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.formation-filter').forEach(b => b.classList.remove('active', 'grad-primary'));
        btn.classList.add('active', 'grad-primary');
        this.loadFormations();
      });
    });
  },

  // ======================== INIT ========================
  async init() {
    // Check if logged in
    if (auth.isLoggedIn()) {
      await auth.loadUserProfile();
      this.updateUI();
      await this.loadFeed();
      await this.loadAnnonces();
      await this.loadFormations();
      await this.loadAids();
    } else {
      openModal('loginModal');
    }

    // Init filters
    this.initFilters();

    // Enter key for messages
    document.getElementById('msgInput')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });

    console.log('✅ App initialized');
  }
};

// ⚠️ CRITICAL: Export app to window so HTML can access it
window.app = app;

// Start app
document.addEventListener('DOMContentLoaded', () => {
  alert('🔵 APP STARTING...');
  app.init();
  alert('✅ APP READY!');
});
