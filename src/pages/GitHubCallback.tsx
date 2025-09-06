import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { githubAuth } from '@/services/githubAuth';

const GitHubCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');

        if (!code || !state) {
          throw new Error('Missing authorization code or state');
        }

        // Exchange code for token
        const token = await githubAuth.exchangeCodeForToken(code, state);
        
        // Get user info
        const user = await githubAuth.getAuthenticatedUser(token);
        
        // Redirect back to projects page
        navigate('/projects', { 
          state: { 
            githubConnected: true, 
            user: user 
          } 
        });
      } catch (error) {
        console.error('GitHub OAuth callback error:', error);
        navigate('/projects', { 
          state: { 
            error: 'Failed to connect to GitHub. Please try again.' 
          } 
        });
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting to GitHub...</p>
      </div>
    </div>
  );
};

export default GitHubCallback;
