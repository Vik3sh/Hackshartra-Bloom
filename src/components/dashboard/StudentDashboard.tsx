import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, FileText, CheckCircle, XCircle, Clock, MessageSquare, Search, User, LogOut, UserCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useNavigate } from 'react-router-dom';

interface Certificate {
  id: string;
  title: string;
  description: string;
  category: 'academic' | 'co_curricular';
  status: 'pending' | 'approved' | 'rejected';
  file_url: string;
  file_name: string;
  uploaded_at: string;
  rejection_reason?: string;
}

const StudentDashboard = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending' | 'rejected'>('all');

  // Upload form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'academic' | 'co_curricular'>('academic');
  const [file, setFile] = useState<File | null>(null);

  // Add this for the user dropdown
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      fetchCertificates();
    }
  }, [profile]);

  const fetchCertificates = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('student_id', profile.id)
        .order('uploaded_at', { ascending: false });

      if (error) {
        console.error('Error fetching certificates:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch certificates',
          variant: 'destructive',
        });
      } else {
        setCertificates(data || []);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const uploadCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !profile) return;

    setUploading(true);
    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.user_id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('certificates')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('certificates')
        .getPublicUrl(fileName);

      // Insert certificate record
      const { error: insertError } = await supabase
        .from('certificates')
        .insert({
          student_id: profile.id,
          title,
          description,
          category,
          file_url: publicUrl,
          file_name: file.name,
        });

      if (insertError) {
        throw insertError;
      }

      toast({
        title: 'Success',
        description: 'Certificate uploaded successfully!',
      });

      // Reset form
      setTitle('');
      setDescription('');
      setCategory('academic');
      setFile(null);

      // Refresh certificates
      fetchCertificates();
    } catch (error: any) {
      console.error('Error uploading certificate:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload certificate',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const calculateProgress = () => {
    if (certificates.length === 0) return 0;
    const approved = certificates.filter(cert => cert.status === 'approved').length;
    return (approved / certificates.length) * 100;
  };

  // Filter and search certificates
  const filteredCertificates = certificates.filter(cert => {
    const matchesFilter = filter === 'all' ? true : cert.status === filter;
    const matchesSearch =
      cert.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      cert.description?.toLowerCase().includes(searchValue.toLowerCase());
    return matchesFilter && (searchValue ? matchesSearch : true);
  });

  // Helper to determine role (student or not)
  const isStudent = profile?.role === 'student' || profile?.role === undefined;

  // User dropdown open/close logic for click only
  useEffect(() => {
    if (!userDropdownOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const userBtn = document.getElementById('user-btn');
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        userBtn &&
        !userBtn.contains(event.target as Node)
      ) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userDropdownOpen]);

  return (
    <div>
      {/* Enhanced Navigation Bar */}
      <nav className="bg-[#222222] text-white sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="hidden lg:flex items-center space-x-6">
              <a href="/home" className="hover:text-red-500 transition-colors font-semibold">HOME</a>
              <div className="relative group">
                <button className="hover:text-red-500 transition-colors py-2 font-semibold">
                  DEPARTMENTS
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <a href="/departments/co_curricular" className="block px-4 py-2 hover:bg-red-50">Co-Curricular</a>
                  <a href="/departments/academic" className="block px-4 py-2 hover:bg-red-50 border-t">Academic</a>
                </div>
              </div>
              <div className="relative group">
                <button className="hover:text-red-500 transition-colors py-2 font-semibold">
                  EVENTS
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <a href="/events/co_curricular" className="block px-4 py-2 hover:bg-red-50">Co-Curricular</a>
                  <a href="/events/academic" className="block px-4 py-2 hover:bg-red-50 border-t">Academic</a>
                </div>
              </div>
              <div className="relative group">
                <button className="hover:text-red-500 transition-colors py-2 font-semibold">
                  ACHIEVEMENTS
                </button>
                <div className="absolute left-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <a href="/achievements/co_curricular" className="block px-4 py-2 hover:bg-red-50">Co-Curricular</a>
                  <a href="/achievements/academic" className="block px-4 py-2 hover:bg-red-50 border-t">Academic</a>
                </div>
              </div>
              <a href="/contact" className="hover:text-red-500 transition-colors font-semibold">CONTACT</a>
              <a href="/about" className="hover:text-red-500 transition-colors font-semibold">ABOUT US</a>
            </div>
            <div className="flex items-center space-x-4">
              {/* Search Icon & Input */}
              <div className="relative">
                {isSearchOpen ? (
                  <div className="flex items-center">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
                    <Input
                      type="search"
                      placeholder="Search"
                      value={searchValue}
                      onChange={e => setSearchValue(e.target.value)}
                      className="w-48 bg-gray-700 text-white border-gray-600 focus:border-red-500 pl-9"
                      autoFocus
                      onBlur={() => setIsSearchOpen(false)}
                    />
                  </div>
                ) : (
                  <button
                    className="p-2 hover:bg-red-500 rounded-sm transition-colors"
                    onClick={() => setIsSearchOpen(true)}
                    aria-label="Open search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </div>
              {/* User Icon Dropdown */}
              <div className="relative">
                <button
                  id="user-btn"
                  className="p-2 rounded-full hover:bg-red-500 transition-colors"
                  aria-label="User menu"
                  onClick={() => setUserDropdownOpen((open) => !open)}
                >
                  <User className="h-6 w-6" />
                </button>
                {userDropdownOpen && (
                  <div
                    id="user-dropdown"
                    className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-lg z-50 animate-fade-in"
                  >
                    <div className="px-4 py-3 border-b flex items-center space-x-2">
                      <UserCircle2 className="h-6 w-6 text-red-500" />
                      <div>
                        <div className="font-semibold">{profile?.full_name || "User"}</div>
                        <div className="text-xs text-gray-500">
                          {isStudent ? "Student" : "Not a Student"}
                        </div>
                      </div>
                    </div>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-red-50 transition-colors"
                    >
                      Your Profile
                    </a>
                    <button
                      onClick={() => navigate('/signup')}
                      className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 transition-colors flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 hover:bg-red-500 rounded-sm transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Student Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {profile?.full_name}!</p>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{certificates.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {certificates.filter(cert => cert.status === 'approved').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.round(calculateProgress())}%</div>
              <Progress value={calculateProgress()} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        {/* Upload Certificate */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Upload Certificate</span>
            </CardTitle>
            <CardDescription>
              Upload your academic or co-curricular certificates for verification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={uploadCertificate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Certificate Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Computer Science Degree"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={(value: 'academic' | 'co_curricular') => setCategory(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="co_curricular">Co-Curricular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the certificate..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="file">Certificate File (PDF/JPEG)</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  required
                />
              </div>

              <Button type="submit" disabled={uploading || !file}>
                {uploading ? 'Uploading...' : 'Upload Certificate'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Certificates List */}
        <Card>
          <CardHeader>
            <CardTitle>My Certificates</CardTitle>
            <CardDescription>
              Track the status of your uploaded certificates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filter Buttons */}
            <div className="flex space-x-2 mb-4">
              {['all', 'approved', 'pending', 'rejected'].map(f => (
                <Button
                  key={f}
                  variant={filter === f ? "default" : "outline"}
                  onClick={() => setFilter(f as any)}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Button>
              ))}
            </div>
            {loading ? (
              <div className="text-center py-4">Loading certificates...</div>
            ) : filteredCertificates.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No certificates found.
              </div>
            ) : (
              <div className="space-y-4">
                {filteredCertificates.map((cert) => (
                  <div key={cert.id} className="border rounded-lg p-4 space-y-2 hover:shadow-lg transition-shadow">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(cert.status)}
                          <h3 className="font-semibold">{cert.title}</h3>
                          {getStatusBadge(cert.status)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Category: {cert.category.replace('_', ' ')} • Uploaded: {new Date(cert.uploaded_at).toLocaleDateString()}
                        </p>
                        {cert.description && (
                          <p className="text-sm text-muted-foreground mt-2">{cert.description}</p>
                        )}
                        {cert.status === 'rejected' && cert.rejection_reason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                            <p className="text-sm text-red-800">
                              <strong>Rejection Reason:</strong> {cert.rejection_reason}
                            </p>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(cert.file_url, '_blank')}
                      >
                        View File
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;