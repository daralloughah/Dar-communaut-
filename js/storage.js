// ======================== SUPABASE CLIENT ========================
class SupabaseClient {
  constructor(url, anonKey) {
    this.url = url;
    this.anonKey = anonKey;
    this.headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${anonKey}`,
      'apikey': anonKey,
    };
  }

  async request(method, path, body = null) {
    const options = {
      method,
      headers: this.headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.url}/rest/v1${path}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur réseau');
      }

      return data;
    } catch (error) {
      console.error('Supabase error:', error);
      throw error;
    }
  }

  // AUTH - Sign Up
  async signUp(email, password, name) {
    try {
      const url = `${this.url}/auth/v1/signup`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': this.anonKey,
        },
        body: JSON.stringify({ email, password }),
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        alert(`❌ Erreur signup: ${data.message || data.error || 'Erreur inconnue'}`);
        throw new Error(data.message || data.error || 'Erreur inscription');
      }

      alert('✅ Signup OK! Création profil...');

      // Créer le profil utilisateur
      if (data.user) {
        await this.createUserProfile(data.user.id, email, name);
        alert('✅ Profil créé!');
      }

      return data;
    } catch (error) {
      alert(`💥 SignUp ERROR: ${error.message}`);
      throw error;
    }
  }

  // AUTH - Sign In
  async signIn(email, password) {
    const url = `${this.url}/auth/v1/token?grant_type=password`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': this.anonKey,
      },
      body: JSON.stringify({ email, password }),
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || 'Erreur connexion');
    }

    return data;
  }

  // AUTH - Get Current User
  async getCurrentUser(token) {
    const url = `${this.url}/auth/v1/user`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': this.anonKey,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error('Pas d\'utilisateur');
    }

    return data;
  }

  // USER PROFILE
  async createUserProfile(userId, email, name) {
    try {
      alert(`📝 Création profil pour ${email}...`);
      const result = await this.request('POST', '/users', {
        id: userId,
        email,
        name,
        avatar: name.substring(0, 2).toUpperCase(),
        bio: '',
        level: 1,
        xp: 0,
        streak: 0,
      });
      alert(`✅ Profil créé!`);
      return result;
    } catch (error) {
      alert(`❌ Erreur création profil: ${error.message}`);
      throw error;
    }
  }

  async getUserProfile(userId) {
    return this.request('GET', `/users?id=eq.${userId}`);
  }

  async updateUserProfile(userId, data) {
    return this.request('PATCH', `/users?id=eq.${userId}`, data);
  }

  // POSTS
  async createPost(userId, content) {
    return this.request('POST', '/posts', {
      user_id: userId,
      content,
    });
  }

  async getPosts(limit = 20) {
    return this.request('GET', `/posts?order=created_at.desc&limit=${limit}`);
  }

  async getUserPosts(userId) {
    return this.request('GET', `/posts?user_id=eq.${userId}&order=created_at.desc`);
  }

  async deletePost(postId) {
    return this.request('DELETE', `/posts?id=eq.${postId}`);
  }

  // ANNONCES
  async createAnnonce(userId, type, title, description, location) {
    return this.request('POST', '/annonces', {
      user_id: userId,
      type,
      title,
      description,
      location,
    });
  }

  async getAnnonces(type = null, limit = 50) {
    let query = `/annonces?order=created_at.desc&limit=${limit}`;
    if (type) {
      query += `&type=eq.${type}`;
    }
    return this.request('GET', query);
  }

  async getUserAnnonces(userId) {
    return this.request('GET', `/annonces?user_id=eq.${userId}&order=created_at.desc`);
  }

  async deleteAnnonce(annonceId) {
    return this.request('DELETE', `/annonces?id=eq.${annonceId}`);
  }

  // FORMATIONS
  async createFormation(userId, title, category, description, price, hours) {
    return this.request('POST', '/formations', {
      user_id: userId,
      title,
      category,
      description,
      price,
      hours,
    });
  }

  async getFormations(category = null, limit = 50) {
    let query = `/formations?order=created_at.desc&limit=${limit}`;
    if (category) {
      query += `&category=eq.${category}`;
    }
    return this.request('GET', query);
  }

  async getUserFormations(userId) {
    return this.request('GET', `/formations?user_id=eq.${userId}&order=created_at.desc`);
  }

  async deleteFormation(formationId) {
    return this.request('DELETE', `/formations?id=eq.${formationId}`);
  }

  // AIDS
  async createAid(userId, title, description, category, urgency) {
    return this.request('POST', '/aids', {
      user_id: userId,
      title,
      description,
      category,
      urgency,
    });
  }

  async getAids(limit = 50) {
    return this.request('GET', `/aids?order=created_at.desc&limit=${limit}`);
  }

  async getUserAids(userId) {
    return this.request('GET', `/aids?user_id=eq.${userId}&order=created_at.desc`);
  }

  async deleteAid(aidId) {
    return this.request('DELETE', `/aids?id=eq.${aidId}`);
  }

  // MESSAGES
  async sendMessage(senderId, recipientId, content) {
    return this.request('POST', '/messages', {
      sender_id: senderId,
      recipient_id: recipientId,
      content,
    });
  }

  async getMessages(userId1, userId2) {
    return this.request('GET', `/messages?or=(and(sender_id.eq.${userId1},recipient_id.eq.${userId2}),and(sender_id.eq.${userId2},recipient_id.eq.${userId1}))&order=created_at.asc`);
  }

  async getAllUserMessages(userId) {
    return this.request('GET', `/messages?or=(sender_id.eq.${userId},recipient_id.eq.${userId})&order=created_at.desc`);
  }

  async markMessageAsRead(messageId) {
    return this.request('PATCH', `/messages?id=eq.${messageId}`, { read: true });
  }

  // FAVORIS
  async addToFavoris(userId, itemId, itemType) {
    return this.request('POST', '/favoris', {
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
    });
  }

  async removeFromFavoris(userId, itemId) {
    return this.request('DELETE', `/favoris?user_id=eq.${userId}&item_id=eq.${itemId}`);
  }

  async getUserFavoris(userId) {
    return this.request('GET', `/favoris?user_id=eq.${userId}`);
  }
}

// Initialize Supabase Client
const supabase = new SupabaseClient(
  SUPABASE_CONFIG.URL,
  SUPABASE_CONFIG.ANON_KEY
);

console.log('✅ Storage (Supabase) initialized');
