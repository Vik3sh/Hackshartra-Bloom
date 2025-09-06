import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Users, 
  FileText, 
  MessageSquare,
  Activity,
  Award,
  TrendingUp,
  BarChart3,
  Bell,
  Target,
  Calendar
} from 'lucide-react';
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard';
import NotificationCenter from '@/components/notifications/NotificationCenter';

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
  student: {
    id: string;
    full_name: string;
    email: string;
    student_id?: string;
  };
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  student_id?: string;
}

const FacultyDashboard = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [processingCert, setProcessingCert] = useState<string | null>(null);
  const [processingActivity, setProcessingActivity] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    if (profile) {
      fetchCertificates();
      fetchActivities();
      fetchStudents();
      fetchUnreadNotifications();
    }
  }, [profile]);

  const fetchCertificates = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // For now, use mock data since database has policy issues
      console.log('Using mock data for certificates due to database issues');
      
      setCertificates([]);
    } catch (error) {
      console.error('Error fetching certificates:', error);
      setCertificates([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async () => {
    if (!profile) return;
    
    try {
      // For now, use mock data since database has policy issues
      console.log('Using mock data for activities due to database issues');
      
      setActivities([]);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    }
  };

  const fetchUnreadNotifications = async () => {
    if (!profile) return;
    
    try {
      // For now, use mock data since database has policy issues
      console.log('Using mock data for notifications due to database issues');
      
      setUnreadNotifications(0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setUnreadNotifications(0);
    }
  };

  const fetchStudents = async () => {
    if (!profile) return;
    
    try {
      // For now, use mock data since database has policy issues
      console.log('Using mock data for students due to database issues');
      
      setStudents([]);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    }
  };

  const handleCertificateAction = async (certificateId: string, action: 'approve' | 'reject', reason?: string) => {
    setProcessingCert(certificateId);
    try {
      const updates: any = {
        status: action === 'approve' ? 'approved' : 'rejected',
        verified_by: profile?.id,
        verified_at: new Date().toISOString(),
      };

      if (action === 'reject' && reason) {
        updates.rejection_reason = reason;
      }

      // For now, skip database update due to policy issues
      console.log('Skipping certificate update due to database issues');

      toast({
        title: 'Success',
        description: `Certificate ${action}ed successfully! (Mock)`,
      });

      // Refresh certificates
      fetchCertificates();
      setRejectionReason('');
    } catch (error: any) {
      console.error('Error updating certificate:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} certificate`,
        variant: 'destructive',
      });
    } finally {
      setProcessingCert(null);
    }
  };

  const handleActivityAction = async (activityId: string, action: 'approve' | 'reject', reason?: string) => {
    setProcessingActivity(activityId);
    try {
      const updates: any = {
        status: action === 'approve' ? 'approved' : 'rejected',
        verified_by: profile?.id,
        verified_at: new Date().toISOString(),
      };

      if (action === 'reject' && reason) {
        updates.rejection_reason = reason;
      }

      // For now, skip database update due to policy issues
      console.log('Skipping activity update due to database issues');

      toast({
        title: 'Success',
        description: `Activity ${action}ed successfully! (Mock)`,
      });

      // Refresh activities
      fetchActivities();
      setRejectionReason('');
    } catch (error: any) {
      console.error('Error updating activity:', error);
      toast({
        title: 'Error',
        description: error.message || `Failed to ${action} activity`,
        variant: 'destructive',
      });
    } finally {
      setProcessingActivity(null);
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

  const pendingCertificates = certificates.filter(cert => cert.status === 'pending');
  const processedCertificates = certificates.filter(cert => cert.status !== 'pending');
  const pendingActivities = activities.filter(activity => activity.status === 'submitted');
  const processedActivities = activities.filter(activity => activity.status !== 'submitted');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Faculty Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name}!</p>
        </div>
        <div className="flex items-center space-x-2">
          {unreadNotifications > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              <Bell className="h-3 w-3 mr-1" />
              {unreadNotifications} new
            </Badge>
          )}
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{students.length}</div>
            <p className="text-xs text-muted-foreground">
              Assigned students
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCertificates.length + pendingActivities.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Certificates & Activities
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{certificates.length}</div>
            <p className="text-xs text-muted-foreground">
              {certificates.filter(cert => cert.status === 'approved').length} approved
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">
              {activities.filter(activity => activity.status === 'approved').length} approved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="certificates">
            Certificates ({pendingCertificates.length})
          </TabsTrigger>
          <TabsTrigger value="activities">
            Activities ({pendingActivities.length})
          </TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="analytics">
            Analytics
            {(profile?.faculty_level === 'senior' || profile?.faculty_level === 'admin') && (
              <BarChart3 className="h-3 w-3 ml-1" />
            )}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {unreadNotifications > 0 && (
              <Badge variant="destructive" className="ml-2 h-4 w-4 rounded-full p-0 flex items-center justify-center text-xs">
                {unreadNotifications}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Quick Stats</span>
                </CardTitle>
                <CardDescription>
                  Overview of your assigned students' progress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Total Students</span>
                    <span className="text-2xl font-bold">{students.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Pending Reviews</span>
                    <span className="text-xl font-semibold text-yellow-600">
                      {pendingCertificates.length + pendingActivities.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Approved Items</span>
                    <span className="text-xl font-semibold text-green-600">
                      {certificates.filter(c => c.status === 'approved').length + 
                       activities.filter(a => a.status === 'approved').length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Latest submissions from your students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Recent activity will appear here</p>
                  <p className="text-sm">Student submissions will show up in real-time</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Certificate Reviews</CardTitle>
              <CardDescription>
                Review and verify student certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading certificates...</div>
              ) : pendingCertificates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending certificates to review
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingCertificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(cert.status)}
                            <h3 className="font-semibold">{cert.title}</h3>
                            {getStatusBadge(cert.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Student: {cert.student.full_name} ({cert.student.email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Category: {cert.category.replace('_', ' ')} • Uploaded: {new Date(cert.uploaded_at).toLocaleDateString()}
                          </p>
                          {cert.description && (
                            <p className="text-sm text-muted-foreground mt-2">{cert.description}</p>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(cert.file_url, '_blank')}
                        >
                          View Certificate
                        </Button>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleCertificateAction(cert.id, 'approve')}
                          disabled={processingCert === cert.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <div className="flex-1 flex space-x-2">
                          <Textarea
                            placeholder="Reason for rejection (required)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="flex-1"
                            rows={1}
                          />
                          <Button
                            variant="destructive"
                            onClick={() => handleCertificateAction(cert.id, 'reject', rejectionReason)}
                            disabled={processingCert === cert.id || !rejectionReason.trim()}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="processed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Processed Certificates</CardTitle>
              <CardDescription>
                Previously reviewed certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {processedCertificates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No processed certificates yet
                </div>
              ) : (
                <div className="space-y-4">
                  {processedCertificates.map((cert) => (
                    <div key={cert.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(cert.status)}
                            <h3 className="font-semibold">{cert.title}</h3>
                            {getStatusBadge(cert.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Student: {cert.student.full_name} ({cert.student.email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Category: {cert.category.replace('_', ' ')} • Processed: {new Date(cert.uploaded_at).toLocaleDateString()}
                          </p>
                          {cert.rejection_reason && (
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
                          View Certificate
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Students Overview</CardTitle>
              <CardDescription>
                {profile?.faculty_level === 'senior' || profile?.faculty_level === 'admin' 
                  ? 'All students in the system'
                  : 'Students assigned to you'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {students.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No students found
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((student) => {
                    const studentCerts = certificates.filter(cert => cert.student.id === student.id);
                    const approvedCerts = studentCerts.filter(cert => cert.status === 'approved').length;
                    const progress = studentCerts.length > 0 ? (approvedCerts / studentCerts.length) * 100 : 0;
                    
                    return (
                      <Card key={student.id}>
                        <CardContent className="p-4">
                          <h3 className="font-semibold">{student.full_name}</h3>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                          {student.student_id && (
                            <p className="text-sm text-muted-foreground">ID: {student.student_id}</p>
                          )}
                          <div className="mt-3 space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>Certificates:</span>
                              <span>{studentCerts.length}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Approved:</span>
                              <span className="text-green-600">{approvedCerts}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Progress:</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Activity Reviews</CardTitle>
              <CardDescription>
                Review and verify student activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-4">Loading activities...</div>
              ) : pendingActivities.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No pending activities to review
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingActivities.map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(activity.status)}
                            <h3 className="font-semibold">{activity.title}</h3>
                            {getStatusBadge(activity.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            Student: {activity.student.full_name} ({activity.student.email})
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Type: {activity.activity_type.replace('_', ' ')} • Category: {activity.category.replace('_', ' ')}
                          </p>
                          {activity.description && (
                            <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                          )}
                          {activity.organization && (
                            <p className="text-sm text-muted-foreground">
                              Organization: {activity.organization}
                            </p>
                          )}
                          {activity.credits_earned > 0 && (
                            <p className="text-sm text-muted-foreground">
                              Credits: {activity.credits_earned}
                            </p>
                          )}
                        </div>
                        {activity.file_urls && activity.file_urls.length > 0 && (
                          <div className="flex space-x-2">
                            {activity.file_urls.map((url, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(url, '_blank')}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                {activity.file_names?.[index] || `Document ${index + 1}`}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleActivityAction(activity.id, 'approve')}
                          disabled={processingActivity === activity.id}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <div className="flex-1 flex space-x-2">
                          <Textarea
                            placeholder="Reason for rejection (required)"
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="flex-1"
                            rows={1}
                          />
                          <Button
                            variant="destructive"
                            onClick={() => handleActivityAction(activity.id, 'reject', rejectionReason)}
                            disabled={processingActivity === activity.id || !rejectionReason.trim()}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {(profile?.faculty_level === 'senior' || profile?.faculty_level === 'admin') ? (
            <AnalyticsDashboard />
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Access Restricted</h3>
                <p className="text-muted-foreground">
                  You need senior faculty or admin privileges to access analytics and reporting.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationCenter />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboard;