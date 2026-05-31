// ======================== AUTHENTICATION MANAGER ========================
class AuthManager {
  constructor() {
    this.user = null;
    this.userProfile = null;
    this.token = null;
    this.isAuthenticated = false;
    this.loadSession();
  }

  // Load session from localStorage
  loadSession() {
    const session = localStorage.getItem('supabase_session');
    if (session) {
      const parsed = JSON.parse(session);
      this.token = parsed.access_token;
      this.user = parsed.user;
      this.isAuthenticated = true;
    }
  }

  // Save session to localStorage
  saveSession(response) {
    if (response.access_token) {
      const session = {
        access_token: response.access_token,
        user: response.user,
      };
      localStorage.setItem('supabase_session', JSON.stringify(session));
      this.token = response.access_token;
      this.user = response.user;
      this.isAuthenticated = true;
    }
  }

  // Sign Up
  async signUp(email, password, name) {
    try {
      const response = await supabase.signUp(email, password, name);
      this.saveSession(response);
      await this.loadUserProfile();
      return response;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Sign In
  async signIn(email, password) {
    try {
      const response = await supabase.signIn(email, password);
      this.saveSession(response);
      await this.loadUserProfile();
      return response;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  // Sign Out
  signOut() {
    localStorage.removeItem('supabase_session');
    this.user = null;
    this.userProfile = null;
    this.token = null;
    this.isAuthenticated = false;
  }

  // Load User Profile
  async loadUserProfile() {
    if (!this.user) return;

    try {
      const profiles = await supabase.getUserProfile(this.user.id);
      if (profiles && profiles.length > 0) {
        this.userProfile = profiles[0];
      }
    } catch (error) {
      console.error('Load profile error:', error);
    }
  }

  // Update User Profile
  async updateProfile(data) {
    if (!this.user) throw new Error('Pas d\'utilisateur');

    try {
      await supabase.updateUserProfile(this.user.id, data);
      this.userProfile = { ...this.userProfile, ...data };
      return this.userProfile;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  // Get current user
  getCurrentUser() {
    return this.user;
  }

  // Get user profile
  getUserProfile() {
    return this.userProfile;
  }

  // Check if authenticated
  isLoggedIn() {
    return this.isAuthenticated && this.token;
  }

  // Get token
  getToken() {
    return this.token;
  }
}

// Initialize Auth Manager
const auth = new AuthManager();

// ⚠️ CRITICAL: Export to window
window.auth = auth;

console.log('✅ Auth Manager initialized');
