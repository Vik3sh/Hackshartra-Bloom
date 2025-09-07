import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Activity, User, TrendingUp, Plus, Search, Filter, ArrowLeft, Github, ExternalLink, Star, GitFork, Calendar, Code, Eye, Download, Settings, Link as LinkIcon, LayoutTemplate, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import TopNavigationBar from '@/components/layout/TopNavigationBar';
import { githubAuth, GitHubUser, GitHubRepository } from '@/services/githubAuth';
import { useLocation, useNavigate } from 'react-router-dom';

const MyProjectsPage: React.FC = () => {
  const { signOut } = useAuth();
  const { profile } = useProfile();
  const location = useLocation();
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  
  // GitHub Integration State
  const [isGitHubConnected, setIsGitHubConnected] = React.useState(false);
  const [githubUser, setGithubUser] = React.useState<GitHubUser | null>(null);
  const [repositories, setRepositories] = React.useState<GitHubRepository[]>([]);
  const [showConnectDialog, setShowConnectDialog] = React.useState(false);
  const [showAddProjectDialog, setShowAddProjectDialog] = React.useState(false);
  const [showCollaboratorsDialog, setShowCollaboratorsDialog] = React.useState(false);
  const [showTemplatesDialog, setShowTemplatesDialog] = React.useState(false);
  const [showImportDialog, setShowImportDialog] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [showProfileDropdown, setShowProfileDropdown] = React.useState(false);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = React.useState(false);
  const [isLoadingRepos, setIsLoadingRepos] = React.useState(false);

  // Manual Project Creation State
  const [manualProjects, setManualProjects] = React.useState<GitHubRepository[]>([]);
  const [newProject, setNewProject] = React.useState({
    name: '',
    description: '',
    language: '',
    url: '',
    status: 'in-progress' as 'in-progress' | 'completed'
  });
  

  // Apply dark mode to document
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Check for existing GitHub connection on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('github_user');
    const savedRepos = localStorage.getItem('github_repos');
    
    if (savedUser && savedRepos) {
      try {
        const user = JSON.parse(savedUser);
        const repos = JSON.parse(savedRepos);
        setGithubUser(user);
        setRepositories(repos);
        setIsGitHubConnected(true);
      } catch (error) {
        console.error('Error loading saved GitHub data:', error);
      }
    }
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown')) {
        setShowProfileDropdown(false);
      }
      if (!target.closest('.notifications-dropdown')) {
        setShowNotificationsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const goBack = () => {
    navigate('/');
  };

  // Manual Project Creation Functions
  const handleAddProject = () => {
    if (!newProject.name.trim()) {
      alert('Please enter a project name');
      return;
    }

    const project: GitHubRepository = {
      id: Date.now(), // Use timestamp as ID for manual projects
      name: newProject.name,
      full_name: `${profile?.full_name || 'user'}/${newProject.name}`,
      description: newProject.description,
      language: newProject.language || 'Other',
      stargazers_count: 0,
      forks_count: 0,
      updated_at: new Date().toISOString(),
      html_url: newProject.url || '#',
      archived: newProject.status === 'completed',
      fork: false
    };

    setManualProjects(prev => [project, ...prev]);
    setNewProject({
      name: '',
      description: '',
      language: '',
      url: '',
      status: 'in-progress'
    });
    setShowAddProjectDialog(false);
    alert('Project added successfully!');
  };

  const handleDeleteProject = (projectId: number) => {
    setManualProjects(prev => prev.filter(p => p.id !== projectId));
    alert('Project deleted successfully!');
  };


  // GitHub Integration Functions
  const connectGitHub = async () => {
    try {
      console.log('Connect GitHub button clicked');
      setIsLoadingRepos(true);
      
      // Use GitHub's public API (no CORS issues)
      const username = prompt('Enter your GitHub username:');
      if (!username) {
        console.log('No username provided');
        setIsLoadingRepos(false);
        return;
      }
      
      console.log('Fetching data for username:', username);

      // Fetch user info
      const userResponse = await fetch(`https://api.github.com/users/${username}`);
      if (!userResponse.ok) {
        throw new Error('GitHub username not found. Please check your username.');
      }
      const user = await userResponse.json();

      // Fetch user's repositories
      const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=20&type=owner`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories.');
      }
      const repos = await reposResponse.json();

      // Filter to only show repositories owned by the user (not forks)
      const userRepos = repos.filter((repo: any) => 
        repo.owner.login === username && !repo.fork
      );

      // Transform to our format
      const transformedRepos = userRepos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || 'No description available',
        language: repo.language || 'Unknown',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
        archived: repo.archived,
        fork: repo.fork
      }));

      // Set user data
      const githubUser: GitHubUser = {
        login: user.login,
        id: user.id,
        avatar_url: user.avatar_url,
        name: user.name || user.login,
        email: user.email || '',
        bio: user.bio || '',
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following
      };

      setGithubUser(githubUser);
      setRepositories(transformedRepos);
      setIsGitHubConnected(true);
      setShowConnectDialog(false);
      
      // Save to localStorage for persistence
      localStorage.setItem('github_user', JSON.stringify(githubUser));
      localStorage.setItem('github_repos', JSON.stringify(transformedRepos));
      
      alert(`GitHub connected successfully! Welcome ${githubUser.name}!`);
      
    } catch (error) {
      console.error('Error connecting to GitHub:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to connect to GitHub: ${errorMessage}`);
    } finally {
      setIsLoadingRepos(false);
    }
  };



  const disconnectGitHub = () => {
    // Clear localStorage
    localStorage.removeItem('github_user');
    localStorage.removeItem('github_repos');
    
    setGithubUser(null);
    setIsGitHubConnected(false);
    setRepositories([]);
    alert('GitHub disconnected successfully!');
  };

  const syncRepositories = async () => {
    if (!isGitHubConnected || !githubUser) {
      alert('No GitHub connection found. Please connect your GitHub account first.');
      return;
    }

    try {
      setIsLoadingRepos(true);
      
      // Re-fetch repositories for the connected user
      const reposResponse = await fetch(`https://api.github.com/users/${githubUser.login}/repos?sort=updated&per_page=20&type=owner`);
      if (!reposResponse.ok) {
        throw new Error('Failed to fetch repositories.');
      }
      const repos = await reposResponse.json();

      // Filter to only show repositories owned by the user (not forks)
      const userRepos = repos.filter((repo: any) => 
        repo.owner.login === githubUser.login && !repo.fork
      );

      // Transform to our format
      const transformedRepos = userRepos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || 'No description available',
        language: repo.language || 'Unknown',
        stargazers_count: repo.stargazers_count,
        forks_count: repo.forks_count,
        updated_at: repo.updated_at,
        html_url: repo.html_url,
        archived: repo.archived,
        fork: repo.fork
      }));

      setRepositories(transformedRepos);
      
      // Update localStorage
      localStorage.setItem('github_repos', JSON.stringify(transformedRepos));
      
      alert('Repositories synced successfully!');
    } catch (error) {
      console.error('Error syncing repositories:', error);
      alert('Failed to sync repositories. Please try again.');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  const openRepository = (url: string) => {
    window.open(url, '_blank');
  };

  // Download project as ZIP
  const downloadProject = async (repo: GitHubRepository) => {
    try {
      // For GitHub repositories, download from GitHub's archive API
      if (repo.html_url.includes('github.com')) {
        const downloadUrl = `https://github.com/${repo.full_name}/archive/refs/heads/main.zip`;
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = `${repo.name}.zip`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        alert(`Downloading ${repo.name}...`);
      } else {
        // For manual projects, create a simple text file with project info
        const projectInfo = `Project: ${repo.name}\nDescription: ${repo.description}\nLanguage: ${repo.language}\nURL: ${repo.html_url}`;
        const blob = new Blob([projectInfo], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${repo.name}-info.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        alert(`Downloaded project info for ${repo.name}`);
      }
    } catch (error) {
      console.error('Error downloading project:', error);
      alert('Failed to download project. Please try again.');
    }
  };

  // Copy clone URL to clipboard
  const copyCloneUrl = async (repo: GitHubRepository) => {
    try {
      let cloneUrl = '';
      
      if (repo.html_url.includes('github.com')) {
        // GitHub repository clone URL
        cloneUrl = `https://github.com/${repo.full_name}.git`;
      } else {
        // Manual project - use the provided URL or create a placeholder
        cloneUrl = repo.html_url || `https://example.com/${repo.name}.git`;
      }
      
      await navigator.clipboard.writeText(cloneUrl);
      alert(`Clone URL copied to clipboard!\n${cloneUrl}`);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = repo.html_url.includes('github.com') 
        ? `https://github.com/${repo.full_name}.git`
        : repo.html_url || `https://example.com/${repo.name}.git`;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Clone URL copied to clipboard!');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-orange-100 text-orange-700';
      case 'planned': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'JavaScript': return 'text-yellow-500';
      case 'TypeScript': return 'text-blue-500';
      case 'Python': return 'text-green-500';
      case 'Vue': return 'text-green-600';
      case 'React': return 'text-blue-400';
      default: return 'text-gray-500';
    }
  };

  // Combine GitHub and manual projects
  const allProjects = [...repositories, ...manualProjects];

  // Filter repositories based on search and status
  // Calculate real-time statistics
  const totalProjects = allProjects.length;
  const completedProjects = allProjects.filter(repo => repo.archived).length;
  const inProgressProjects = allProjects.filter(repo => !repo.archived).length;
  const totalViews = allProjects.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

  const filteredRepositories = allProjects.filter(repo => {
    const matchesSearch = repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (repo.description && repo.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || (repo.archived ? 'completed' : 'in-progress') === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-slate-50 to-blue-50'
    }`}>

      {/* Top Navigation Bar */}
      <TopNavigationBar
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        showProfileDropdown={showProfileDropdown}
        setShowProfileDropdown={setShowProfileDropdown}
        showNotificationsDropdown={showNotificationsDropdown}
        setShowNotificationsDropdown={setShowNotificationsDropdown}
        profile={profile}
        signOut={signOut}
        isStudent={true}
      />

      {/* Main Content */}
      <div className="px-4 py-6">
        <div className="w-full">
          {/* Header Section */}
          <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className={`hover:bg-opacity-80 ${
                isDarkMode 
                  ? 'text-gray-300 hover:bg-gray-700' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Project Portfolio
              </h2>
              <p className={`mt-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                Showcase your work and track your project progress
              </p>
              {isGitHubConnected && (
                <div className="flex items-center mt-2 space-x-2">
                  <Github className="h-4 w-4 text-gray-500" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Connected as @{githubUser?.login || 'github-user'}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={syncRepositories}
                    disabled={isLoadingRepos}
                    className="text-xs h-6 px-2"
                  >
                    {isLoadingRepos ? 'Syncing...' : 'Sync'}
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {isGitHubConnected && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={disconnectGitHub}
                    className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                  <Button 
                    onClick={() => setShowAddProjectDialog(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Project
                  </Button>
                </div>
              )}
            </div>
          </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-slate-800'
                  }`}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className={`w-40 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white'}`}>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Projects</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="planned">Planned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Total Projects
                    </p>
                    <p className="text-3xl font-bold text-green-600">{totalProjects}</p>
                  </div>
                  <Activity className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Completed
                    </p>
                    <p className="text-3xl font-bold text-blue-600">{completedProjects}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      In Progress
                    </p>
                    <p className="text-3xl font-bold text-orange-600">{inProgressProjects}</p>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                      Total Stars
                    </p>
                    <p className="text-3xl font-bold text-purple-600">{totalViews}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {isGitHubConnected ? 'GitHub Repositories' : 'Recent Projects'}
              </h3>
              {isGitHubConnected && (
                <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  {filteredRepositories.length} of {repositories.length} repositories
                </span>
              )}
            </div>
            
            {!isGitHubConnected ? (
              <div className="text-center py-12">
                <Github className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Connect GitHub to Import Projects
                </h4>
                <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  Link your GitHub account to automatically import and showcase your repositories
                </p>
                <Button 
                  onClick={connectGitHub}
                  className="bg-gray-800 hover:bg-gray-700 text-white"
                >
                  <Github className="h-4 w-4 mr-2" />
                  Connect GitHub
                </Button>
              </div>
            ) : isLoadingRepos ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  Loading repositories...
                </p>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Fetching data from GitHub
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRepositories.map((repo) => (
                  <Card 
                    key={repo.id} 
                    className={`hover:shadow-lg transition-all duration-300 cursor-pointer group ${
                      isDarkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white hover:border-gray-300'
                    }`}
                  >
                    <CardContent className="p-6">
                      {/* Repository Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <Code className={`h-5 w-5 ${getLanguageColor(repo.language)}`} />
                          <h4 className={`font-semibold text-lg group-hover:text-blue-600 transition-colors ${
                            isDarkMode ? 'text-white' : 'text-slate-800'
                          }`}>
                            {repo.name}
                          </h4>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openRepository(repo.html_url)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Repository Description */}
                      <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        {repo.description || 'No description available'}
                      </p>

                      {/* Repository Stats */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {repo.stargazers_count}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <GitFork className="h-4 w-4 text-gray-500" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {repo.forks_count}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4 text-blue-500" />
                            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                              {Math.floor(Math.random() * 1000)}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(repo.archived ? 'completed' : 'in-progress')}>
                          {repo.archived ? 'completed' : 'in-progress'}
                        </Badge>
                      </div>

                      {/* Repository Footer */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                          Updated {new Date(repo.updated_at).toLocaleDateString()}
                        </span>
                        </div>
                        <div className="flex space-x-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadProject(repo)}
                            className="h-8 px-3"
                          >
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyCloneUrl(repo)}
                            className="h-8 px-3"
                          >
                            <GitFork className="h-3 w-3 mr-1" />
                            Clone
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button 
              onClick={() => {
                console.log('Create New Project button clicked');
                setShowAddProjectDialog(true);
              }}
              className="bg-green-600 hover:bg-green-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Project
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowCollaboratorsDialog(true)}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              <User className="h-4 w-4 mr-2" />
              Find Collaborators
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowTemplatesDialog(true)}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              <LayoutTemplate className="h-4 w-4 mr-2" />
              Browse Templates
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowImportDialog(true)}
              className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Local Project
            </Button>
          </div>
        </div>
      </div>

      {/* Add Project Dialog */}
      <Dialog open={showAddProjectDialog} onOpenChange={setShowAddProjectDialog}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
              Add New Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Project Name *</Label>
              <Input
                placeholder="Enter project name"
                value={newProject.name}
                onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Description</Label>
              <Input
                placeholder="Enter project description"
                value={newProject.description}
                onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Programming Language</Label>
              <Input
                placeholder="e.g., JavaScript, Python, React"
                value={newProject.language}
                onChange={(e) => setNewProject(prev => ({ ...prev, language: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Project URL</Label>
              <Input
                placeholder="https://github.com/username/project"
                value={newProject.url}
                onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Status</Label>
              <Select
                value={newProject.status}
                onValueChange={(value: 'in-progress' | 'completed') => 
                  setNewProject(prev => ({ ...prev, status: value }))
                }
              >
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAddProjectDialog(false)}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleAddProject}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Find Collaborators Dialog */}
      <Dialog open={showCollaboratorsDialog} onOpenChange={setShowCollaboratorsDialog}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
              Find Collaborators
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Search by Name or Skills</Label>
              <Input
                placeholder="Enter name, skills, or interests..."
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Department</Label>
              <Select>
                <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs">Computer Science</SelectItem>
                  <SelectItem value="it">Information Technology</SelectItem>
                  <SelectItem value="ece">Electronics & Communication</SelectItem>
                  <SelectItem value="me">Mechanical Engineering</SelectItem>
                  <SelectItem value="ce">Civil Engineering</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Skills</Label>
              <Input
                placeholder="e.g., React, Python, Machine Learning..."
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCollaboratorsDialog(false)}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Search functionality coming soon!');
                  setShowCollaboratorsDialog(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Search
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Browse Templates Dialog */}
      <Dialog open={showTemplatesDialog} onOpenChange={setShowTemplatesDialog}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
              Browse Project Templates
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <Card className={`cursor-pointer hover:shadow-lg transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Code className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>React App</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Modern web app template</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={`cursor-pointer hover:shadow-lg transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Github className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Python API</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>REST API with FastAPI</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={`cursor-pointer hover:shadow-lg transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <LayoutTemplate className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Mobile App</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>React Native template</p>
                  </div>
                </CardContent>
              </Card>
              <Card className={`cursor-pointer hover:shadow-lg transition-all ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Activity className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                    <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Data Science</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>Jupyter notebook setup</p>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowTemplatesDialog(false)}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Template selection coming soon!');
                  setShowTemplatesDialog(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Use Template
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Import Local Project Dialog */}
      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className={isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}>
          <DialogHeader>
            <DialogTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
              Import Local Project
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className={`border-2 border-dashed rounded-lg p-8 text-center ${isDarkMode ? 'border-gray-600' : 'border-gray-300'}`}>
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h4 className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                Upload Project Files
              </h4>
              <p className={`mb-4 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                Drag and drop your project folder or click to browse
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.webkitdirectory = true;
                  input.onchange = (e) => {
                    alert('File upload functionality coming soon!');
                  };
                  input.click();
                }}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Choose Folder
              </Button>
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Project Name</Label>
              <Input
                placeholder="Enter project name"
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Description</Label>
              <Input
                placeholder="Brief description of your project"
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
              />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowImportDialog(false)}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  alert('Import functionality coming soon!');
                  setShowImportDialog(false);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Import Project
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyProjectsPage;

