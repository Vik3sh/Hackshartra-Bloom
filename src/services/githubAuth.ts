// GitHub OAuth Configuration
const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || 'your_github_client_id';
const GITHUB_REDIRECT_URI = `${window.location.origin}/auth/github/callback`;

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
  email: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
}

export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  html_url: string;
  archived: boolean;
  fork: boolean;
}

class GitHubAuthService {
  private TOKEN_KEY = 'github_oauth_token';
  private USER_KEY = 'github_user_info';

  // Generate OAuth URL for GitHub authentication
  getAuthUrl(): string {
    const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('github_oauth_state', state);
    
    const params = new URLSearchParams({
      client_id: GITHUB_CLIENT_ID,
      redirect_uri: GITHUB_REDIRECT_URI,
      scope: 'repo,read:user',
      state: state,
      allow_signup: 'true'
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  // Store OAuth token
  storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Get stored OAuth token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Remove OAuth token
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Store user info
  storeUserInfo(user: GitHubUser): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  // Get stored user info
  getUserInfo(): GitHubUser | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Exchange authorization code for access token (this would normally be done on your backend)
  async exchangeCodeForToken(code: string, state: string): Promise<string> {
    const storedState = localStorage.getItem('github_oauth_state');
    if (!storedState || storedState !== state) {
      throw new Error('Invalid OAuth state. Possible CSRF attack.');
    }
    localStorage.removeItem('github_oauth_state');

    // Check if we have real OAuth credentials
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_GITHUB_CLIENT_SECRET;
    
    if (!clientId || clientId === 'your_github_client_id' || !clientSecret) {
      // Demo mode: Create a mock token
      const mockToken = `demo_token_${Date.now()}_${Math.random().toString(36).substring(2)}`;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.storeToken(mockToken);
      return mockToken;
    }

    // Real OAuth: Exchange code for token
    try {
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
          redirect_uri: GITHUB_REDIRECT_URI,
          state: state
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(`GitHub OAuth error: ${data.error_description || data.error}`);
      }

      if (!data.access_token) {
        throw new Error('No access token received from GitHub');
      }

      this.storeToken(data.access_token);
      return data.access_token;
    } catch (error) {
      console.error('OAuth token exchange error:', error);
      throw new Error(`Failed to exchange code for token: ${error.message}`);
    }
  }

  // Get authenticated user info
  async getAuthenticatedUser(token: string): Promise<GitHubUser> {
    try {
      const response = await fetch('https://api.github.com/user', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const user = await response.json();
      this.storeUserInfo(user);
      return user;
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Get user's repositories (only owned by the authenticated user)
  async getUserRepositories(token: string): Promise<GitHubRepository[]> {
    try {
      const response = await fetch('https://api.github.com/user/repos?type=owner&sort=updated&per_page=100', {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch repositories');
      }

      const repos = await response.json();
      
      // Filter to only show repositories owned by the authenticated user
      return repos.filter((repo: any) => !repo.fork);
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // Get current user
  getCurrentUser(): GitHubUser | null {
    return this.getUserInfo();
  }
}

export const githubAuth = new GitHubAuthService();
