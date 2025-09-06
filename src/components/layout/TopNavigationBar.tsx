import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, User, Sun, Moon, Settings, UserCircle, Camera, Upload, X, Check, CheckCheck, AlertCircle, Info, Award } from 'lucide-react';

interface TopNavigationBarProps {
  isDarkMode: boolean;
  setIsDarkMode: (darkMode: boolean) => void;
  showProfileDropdown: boolean;
  setShowProfileDropdown: (show: boolean) => void;
  showNotificationsDropdown: boolean;
  setShowNotificationsDropdown: (show: boolean) => void;
  profile: any;
  signOut: () => void;
  isStudent?: boolean;
}

const TopNavigationBar: React.FC<TopNavigationBarProps> = ({
  isDarkMode,
  setIsDarkMode,
  showProfileDropdown,
  setShowProfileDropdown,
  showNotificationsDropdown,
  setShowNotificationsDropdown,
  profile,
  signOut,
  isStudent = true
}) => {
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: profile?.full_name || '',
    email: profile?.email || '',
    bio: 'Passionate about learning and technology. Always eager to explore new opportunities and grow both personally and professionally.',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    year: '3rd',
    studentId: 'CS2021001',
    profileImage: null as string | null
  });
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Notification state
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Assignment Posted",
      message: "Mathematics Assignment 3 is now available",
      type: "assignment",
      time: "2 hours ago",
      read: false,
      icon: "📝"
    },
    {
      id: 2,
      title: "Certificate Ready",
      message: "Your Python Programming certificate is ready for download",
      type: "certificate",
      time: "1 day ago",
      read: false,
      icon: "🏆"
    },
    {
      id: 3,
      title: "Deadline Reminder",
      message: "Project submission deadline is in 3 days",
      type: "reminder",
      time: "2 days ago",
      read: true,
      icon: "⏰"
    },
    {
      id: 4,
      title: "Grade Updated",
      message: "Your Data Structures exam grade has been posted",
      type: "grade",
      time: "3 days ago",
      read: true,
      icon: "📊"
    },
    {
      id: 5,
      title: "Event Invitation",
      message: "Tech Talk: AI in Education - Tomorrow at 3 PM",
      type: "event",
      time: "4 days ago",
      read: false,
      icon: "🎯"
    }
  ]);

  // Load dark mode preference from localStorage on component mount
  React.useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
      const isDark = JSON.parse(savedDarkMode);
      setIsDarkMode(isDark);
    }
  }, [setIsDarkMode]);

  // Load profile data from localStorage on component mount
  React.useEffect(() => {
    const savedProfileData = localStorage.getItem('profileData');
    if (savedProfileData) {
      try {
        const parsedData = JSON.parse(savedProfileData);
        setProfileData(prev => ({
          ...prev,
          ...parsedData
        }));
        if (parsedData.profileImage) {
          setProfileImagePreview(parsedData.profileImage);
        }
      } catch (error) {
        console.error('Error loading profile data from localStorage:', error);
      }
    }
  }, []);

  // Update profile data when profile changes
  React.useEffect(() => {
    if (profile) {
      setProfileData(prev => ({
        ...prev,
        fullName: profile.full_name || prev.fullName,
        email: profile.email || prev.email
      }));
    }
  }, [profile]);

  // Save dark mode preference to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save profile data to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('profileData', JSON.stringify(profileData));
  }, [profileData]);
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    weeklyDigest: true,
    language: 'en',
    timezone: 'UTC'
  });

  const handleProfileSave = () => {
    // Here you would typically save to database
    console.log('Saving profile:', profileData);
    setShowProfileSettings(false);
    // The profile data is automatically saved to localStorage via useEffect
    // You could add a toast notification here
  };

  const handleSignOut = () => {
    // Clear profile data and dark mode preference from localStorage when signing out
    localStorage.removeItem('profileData');
    localStorage.removeItem('darkMode');
    signOut();
  };

  const handlePreferencesSave = () => {
    // Here you would typically save to database
    console.log('Saving preferences:', preferences);
    setShowPreferences(false);
    // You could add a toast notification here
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfileImagePreview(result);
        setProfileData(prev => ({ ...prev, profileImage: result }));
        // The useEffect will automatically save to localStorage
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImagePreview(null);
    setProfileData(prev => ({ ...prev, profileImage: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Notification functions
  const markAsRead = (notificationId: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (notificationId: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'assignment': return '📝';
      case 'certificate': return '🏆';
      case 'reminder': return '⏰';
      case 'grade': return '📊';
      case 'event': return '🎯';
      default: return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'assignment': return 'text-blue-600';
      case 'certificate': return 'text-yellow-600';
      case 'reminder': return 'text-red-600';
      case 'grade': return 'text-green-600';
      case 'event': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };
  return (
    <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'} backdrop-blur-md shadow-lg border-b px-4 py-2 sticky top-0 z-50 transition-colors duration-300`}>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">AH</span>
          </div>
          <h2 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {isStudent ? 'Academic Hub' : 'Faculty Dashboard'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`h-9 w-9 p-0 ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Notifications */}
          <div className="relative notifications-dropdown">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className={`h-9 w-9 p-0 relative ${isDarkMode ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100'}`}
            >
              <Bell className="h-4 w-4" />
              {getUnreadCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium">
                  {getUnreadCount() > 9 ? '9+' : getUnreadCount()}
                </span>
              )}
            </Button>
            
            {showNotificationsDropdown && (
              <div className={`absolute right-0 mt-2 w-96 rounded-lg shadow-lg border z-50 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Header */}
                <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                      Notifications
                    </h3>
                    <div className="flex items-center space-x-2">
                      {getUnreadCount() > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${
                            isDarkMode 
                              ? 'text-blue-400 hover:bg-blue-900/20' 
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                        >
                          Mark all as read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={clearAllNotifications}
                          className={`text-xs px-2 py-1 rounded-md transition-colors ${
                            isDarkMode 
                              ? 'text-red-400 hover:bg-red-900/20' 
                              : 'text-red-600 hover:bg-red-50'
                          }`}
                        >
                          Clear all
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center">
                      <Bell className={`h-8 w-8 mx-auto mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${
                                  isDarkMode ? 'text-white' : 'text-slate-800'
                                } ${!notification.read ? 'font-semibold' : ''}`}>
                                  {notification.title}
                                </p>
                                <div className="flex items-center space-x-1">
                                  {!notification.read && (
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                  )}
                                  <button
                                    onClick={() => deleteNotification(notification.id)}
                                    className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors`}
                                  >
                                    <X className="h-3 w-3 text-gray-400" />
                                  </button>
                                </div>
                              </div>
                              <p className={`text-xs mt-1 ${
                                isDarkMode ? 'text-gray-300' : 'text-slate-600'
                              }`}>
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className={`text-xs ${
                                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {notification.time}
                                </span>
                                {!notification.read && (
                                  <button
                                    onClick={() => markAsRead(notification.id)}
                                    className={`text-xs px-2 py-1 rounded transition-colors ${
                                      isDarkMode 
                                        ? 'text-blue-400 hover:bg-blue-900/20' 
                                        : 'text-blue-600 hover:bg-blue-50'
                                    }`}
                                  >
                                    Mark as read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer */}
                {notifications.length > 0 && (
                  <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <button
                      className={`w-full text-center text-sm py-2 rounded-md transition-colors ${
                        isDarkMode 
                          ? 'text-gray-300 hover:bg-gray-700' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      View all notifications
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative profile-dropdown">
            <div
              className={`flex items-center space-x-2 cursor-pointer rounded-lg p-2 transition-colors ${
                isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center">
                {profileImagePreview || profileData.profileImage ? (
                  <img 
                    src={profileImagePreview || profileData.profileImage || ''} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-xs">
                    {profileData.fullName?.charAt(0) || profile?.full_name?.charAt(0) || (isStudent ? 'S' : 'F')}
                  </div>
                )}
              </div>
              <div className="hidden sm:block">
                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  {profileData.fullName || profile?.full_name || (isStudent ? 'Student' : 'Faculty')}
                </p>
                <p className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                  {profileData.department || profileData.year ? `${profileData.department} ${profileData.year}` : (isStudent ? 'Student' : 'Faculty')}
                </p>
              </div>
            </div>
            
            {showProfileDropdown && (
              <div className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg border z-50 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                {/* Profile Header */}
                <div className={`px-4 py-3 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center">
                      {profileImagePreview || profileData.profileImage ? (
                        <img 
                          src={profileImagePreview || profileData.profileImage || ''} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {profileData.fullName?.charAt(0) || profile?.full_name?.charAt(0) || (isStudent ? 'S' : 'F')}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {profileData.fullName || profile?.full_name || (isStudent ? 'Student' : 'Faculty')}
                      </h3>
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>
                        {profileData.email || profile?.email || 'user@example.com'}
                      </p>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        {profileData.department && profileData.year ? `${profileData.department} • ${profileData.year} Year` : 
                         profileData.department ? profileData.department :
                         isStudent ? 'Student' : 'Faculty'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Profile Details */}
                <div className="px-4 py-3 space-y-3">
                  {/* Bio Section - Always Show */}
                  <div className="space-y-1">
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>About:</span>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-slate-600'} leading-relaxed`}>
                      {profileData.bio || 'No bio available. Click "Edit Profile" to add one.'}
                    </p>
                  </div>
                  
                  {/* Contact Info */}
                  <div className="space-y-2">
                    {profileData.phone && (
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Phone:</span>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{profileData.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Student ID:</span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-slate-600'}`}>{profileData.studentId || 'Not assigned'}</span>
                    </div>
                  </div>
                  
                  {/* Role Badge */}
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>Role:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isStudent 
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' 
                        : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    }`}>
                      {isStudent ? 'Student' : 'Faculty'}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="py-2">
                  <button 
                    onClick={() => {
                      setShowProfileSettings(true);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                      isDarkMode ? 'text-slate-200 hover:bg-gray-700' : 'text-slate-700'
                    }`}
                  >
                    <UserCircle className="h-4 w-4 mr-2" />
                    Edit Profile
                  </button>
                  <button 
                    onClick={() => {
                      setShowPreferences(true);
                      setShowProfileDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                      isDarkMode ? 'text-slate-200 hover:bg-gray-700' : 'text-slate-700'
                    }`}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </button>
                  <hr className={`my-1 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`} />
                  <button 
                    onClick={handleSignOut}
                    className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 ${
                      isDarkMode ? 'hover:bg-red-900/20' : ''
                    }`}
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Profile Settings Modal */}
      <Dialog open={showProfileSettings} onOpenChange={setShowProfileSettings}>
        <DialogContent className={`max-w-md max-h-[90vh] ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <UserCircle className="h-5 w-5 mr-2" />
              Profile Settings
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Full Name</Label>
              <Input
                value={profileData.fullName}
                onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Email</Label>
              <Input
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                placeholder="Enter your email"
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Phone</Label>
              <Input
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Department</Label>
              <Input
                value={profileData.department}
                onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                placeholder="Enter your department"
              />
            </div>
            
            {isStudent && (
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Student ID</Label>
                <Input
                  value={profileData.studentId}
                  onChange={(e) => setProfileData(prev => ({ ...prev, studentId: e.target.value }))}
                  className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                  placeholder="e.g., CS2021001"
                />
              </div>
            )}
            
            {isStudent && (
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Year</Label>
                <Select value={profileData.year} onValueChange={(value) => setProfileData(prev => ({ ...prev, year: value }))}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1st">1st Year</SelectItem>
                    <SelectItem value="2nd">2nd Year</SelectItem>
                    <SelectItem value="3rd">3rd Year</SelectItem>
                    <SelectItem value="4th">4th Year</SelectItem>
                    <SelectItem value="5th">5th Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-3">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Profile Image</Label>
              <div className="flex items-center space-x-4">
                <div 
                  className={`w-20 h-20 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-105 ${
                    isDarkMode 
                      ? 'border-gray-500 hover:border-gray-400 hover:bg-gray-700/50' 
                      : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                  onClick={triggerFileInput}
                >
                  {profileImagePreview || profileData.profileImage ? (
                    <img 
                      src={profileImagePreview || profileData.profileImage || ''} 
                      alt="Profile Preview" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isDarkMode ? 'bg-gray-600' : 'bg-gray-100'
                      }`}>
                        <Camera className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`} />
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={triggerFileInput}
                    className={`${isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-600 hover:bg-gray-50'} transition-all duration-200`}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Image
                  </Button>
                  {(profileImagePreview || profileData.profileImage) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveImage}
                      className={`${isDarkMode ? 'border-red-600 text-red-300 hover:bg-red-900/20' : 'border-red-300 text-red-600 hover:bg-red-50'} transition-all duration-200`}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Click the circle to upload. JPG, PNG or GIF. Max size 5MB.
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Bio</Label>
              <Textarea
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                className={isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white'}
                placeholder="Tell us about yourself"
                rows={3}
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={() => setShowProfileSettings(false)}
              className={isDarkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'hover:bg-gray-50'}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleProfileSave} 
              className="bg-blue-600 hover:bg-blue-700 text-white transition-colors duration-200"
            >
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Preferences Modal */}
      <Dialog open={showPreferences} onOpenChange={setShowPreferences}>
        <DialogContent className={`max-w-md ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}`}>
          <DialogHeader>
            <DialogTitle className={`flex items-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              <Settings className="h-5 w-5 mr-2" />
              Preferences
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Notifications</h3>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Email Notifications</Label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  checked={preferences.emailNotifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Push Notifications</Label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Receive push notifications in browser
                  </p>
                </div>
                <Switch
                  checked={preferences.pushNotifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, pushNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>SMS Notifications</Label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Receive notifications via SMS
                  </p>
                </div>
                <Switch
                  checked={preferences.smsNotifications}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, smsNotifications: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Weekly Digest</Label>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Receive weekly summary emails
                  </p>
                </div>
                <Switch
                  checked={preferences.weeklyDigest}
                  onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, weeklyDigest: checked }))}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>General</h3>
              
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Language</Label>
                <Select value={preferences.language} onValueChange={(value) => setPreferences(prev => ({ ...prev, language: value }))}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label className={isDarkMode ? 'text-white' : 'text-slate-700'}>Timezone</Label>
                <Select value={preferences.timezone} onValueChange={(value) => setPreferences(prev => ({ ...prev, timezone: value }))}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white'}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="EST">Eastern Time</SelectItem>
                    <SelectItem value="PST">Pacific Time</SelectItem>
                    <SelectItem value="IST">Indian Standard Time</SelectItem>
                    <SelectItem value="GMT">Greenwich Mean Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPreferences(false)}
                className={isDarkMode ? 'border-gray-600 text-gray-300' : ''}
              >
                Cancel
              </Button>
              <Button onClick={handlePreferencesSave} className="bg-blue-600 hover:bg-blue-700">
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TopNavigationBar;
