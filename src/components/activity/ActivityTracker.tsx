import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Calendar, 
  MapPin, 
  Building, 
  Award, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Edit, 
  Trash2,
  FileText,
  Upload,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';

interface Activity {
  id: string;
  title: string;
  description: string | null;
  activity_type: string;
  category: 'academic' | 'co_curricular';
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  start_date: string | null;
  end_date: string | null;
  organization: string | null;
  location: string | null;
  credits_earned: number;
  file_urls: string[] | null;
  file_names: string[] | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
}

const ActivityTracker = () => {
  const { profile } = useProfile();
  const { toast } = useToast();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    activity_type: '',
    category: 'academic' as 'academic' | 'co_curricular',
    start_date: '',
    end_date: '',
    organization: '',
    location: '',
    credits_earned: 0,
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (profile) {
      fetchActivities();
    }
  }, [profile]);

  const fetchActivities = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      // For now, use mock data since database has policy issues
      console.log('Using mock data for activities due to database issues');
      setActivities([]);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setUploading(true);
    try {
      let fileUrls: string[] = [];
      let fileNames: string[] = [];

      // Upload files if any
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${profile.user_id}/activities/${Date.now()}_${file.name}`;
          
          const { error: uploadError } = await supabase.storage
            .from('certificates')
            .upload(fileName, file);

          if (uploadError) {
            throw uploadError;
          }

          const { data: { publicUrl } } = supabase.storage
            .from('certificates')
            .getPublicUrl(fileName);

          fileUrls.push(publicUrl);
          fileNames.push(file.name);
        }
      }

      const activityData = {
        student_id: profile.id,
        ...formData,
        credits_earned: Number(formData.credits_earned),
        file_urls: fileUrls.length > 0 ? fileUrls : null,
        file_names: fileNames.length > 0 ? fileNames : null,
        status: 'submitted' as const,
      };

      if (editingActivity) {
        // Update existing activity
        const { error } = await supabase
          .from('activities')
          .update(activityData)
          .eq('id', editingActivity.id);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Activity updated successfully!',
        });
      } else {
        // Create new activity
        const { error } = await supabase
          .from('activities')
          .insert(activityData);

        if (error) throw error;
        
        toast({
          title: 'Success',
          description: 'Activity submitted for review!',
        });
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        activity_type: '',
        category: 'academic',
        start_date: '',
        end_date: '',
        organization: '',
        location: '',
        credits_earned: 0,
      });
      setFiles([]);
      setEditingActivity(null);
      setIsDialogOpen(false);
      
      // Refresh activities
      fetchActivities();
    } catch (error: any) {
      console.error('Error saving activity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save activity',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      title: activity.title,
      description: activity.description || '',
      activity_type: activity.activity_type,
      category: activity.category,
      start_date: activity.start_date ? activity.start_date.split('T')[0] : '',
      end_date: activity.end_date ? activity.end_date.split('T')[0] : '',
      organization: activity.organization || '',
      location: activity.location || '',
      credits_earned: activity.credits_earned,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (activityId: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Activity deleted successfully!',
      });

      fetchActivities();
    } catch (error: any) {
      console.error('Error deleting activity:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete activity',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'submitted':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Edit className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case 'submitted':
        return <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
    }
  };

  const activityTypes = [
    { value: 'conference', label: 'Conference' },
    { value: 'mooc', label: 'MOOC' },
    { value: 'internship', label: 'Internship' },
    { value: 'volunteering', label: 'Volunteering' },
    { value: 'competition', label: 'Competition' },
    { value: 'certification', label: 'Certification' },
    { value: 'project', label: 'Project' },
    { value: 'publication', label: 'Publication' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'seminar', label: 'Seminar' },
    { value: 'sports', label: 'Sports' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'leadership', label: 'Leadership' },
    { value: 'research', label: 'Research' },
    { value: 'other', label: 'Other' },
  ];

  const draftActivities = activities.filter(activity => activity.status === 'draft');
  const submittedActivities = activities.filter(activity => activity.status === 'submitted');
  const approvedActivities = activities.filter(activity => activity.status === 'approved');
  const rejectedActivities = activities.filter(activity => activity.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Activity Tracker</h2>
          <p className="text-muted-foreground">Track and manage your academic and co-curricular activities</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingActivity(null);
              setFormData({
                title: '',
                description: '',
                activity_type: '',
                category: 'academic',
                start_date: '',
                end_date: '',
                organization: '',
                location: '',
                credits_earned: 0,
              });
              setFiles([]);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? 'Edit Activity' : 'Add New Activity'}
              </DialogTitle>
              <DialogDescription>
                {editingActivity 
                  ? 'Update your activity details below.' 
                  : 'Fill in the details of your activity to submit for review.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Activity Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Python Programming Workshop"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="activity_type">Activity Type *</Label>
                  <Select 
                    value={formData.activity_type} 
                    onValueChange={(value) => setFormData({ ...formData, activity_type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select activity type" />
                    </SelectTrigger>
                    <SelectContent>
                      {activityTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select 
                    value={formData.category} 
                    onValueChange={(value: 'academic' | 'co_curricular') => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="academic">Academic</SelectItem>
                      <SelectItem value="co_curricular">Co-Curricular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="credits_earned">Credits Earned</Label>
                  <Input
                    id="credits_earned"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.credits_earned}
                    onChange={(e) => setFormData({ ...formData, credits_earned: Number(e.target.value) })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe your activity, what you learned, and its impact..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organization">Organization</Label>
                  <Input
                    id="organization"
                    value={formData.organization}
                    onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    placeholder="e.g., IEEE, Google, University"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., New York, Online, Campus"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="files">Supporting Documents (Optional)</Label>
                <Input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                />
                <p className="text-sm text-muted-foreground">
                  Upload certificates, photos, or other supporting documents
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading || !formData.title || !formData.activity_type}>
                  {uploading ? 'Saving...' : editingActivity ? 'Update Activity' : 'Submit Activity'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">All ({activities.length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({draftActivities.length})</TabsTrigger>
          <TabsTrigger value="submitted">Under Review ({submittedActivities.length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({approvedActivities.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedActivities.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <ActivityList 
            activities={activities} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <ActivityList 
            activities={draftActivities} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="submitted" className="space-y-4">
          <ActivityList 
            activities={submittedActivities} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <ActivityList 
            activities={approvedActivities} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <ActivityList 
            activities={rejectedActivities} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            getStatusIcon={getStatusIcon}
            getStatusBadge={getStatusBadge}
            loading={loading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ActivityListProps {
  activities: Activity[];
  onEdit: (activity: Activity) => void;
  onDelete: (id: string) => void;
  getStatusIcon: (status: string) => React.ReactNode;
  getStatusBadge: (status: string) => React.ReactNode;
  loading: boolean;
}

const ActivityList: React.FC<ActivityListProps> = ({ 
  activities, 
  onEdit, 
  onDelete, 
  getStatusIcon, 
  getStatusBadge, 
  loading 
}) => {
  if (loading) {
    return <div className="text-center py-4">Loading activities...</div>;
  }

  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No activities found. Start by adding your first activity!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  {getStatusIcon(activity.status)}
                  <h3 className="font-semibold">{activity.title}</h3>
                  {getStatusBadge(activity.status)}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4" />
                    <span>{activity.activity_type.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  
                  {activity.organization && (
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{activity.organization}</span>
                    </div>
                  )}
                  
                  {activity.start_date && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {format(new Date(activity.start_date), 'MMM dd, yyyy')}
                        {activity.end_date && ` - ${format(new Date(activity.end_date), 'MMM dd, yyyy')}`}
                      </span>
                    </div>
                  )}
                  
                  {activity.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{activity.location}</span>
                    </div>
                  )}
                  
                  {activity.credits_earned > 0 && (
                    <div className="flex items-center space-x-2">
                      <Award className="h-4 w-4" />
                      <span>{activity.credits_earned} credits</span>
                    </div>
                  )}
                </div>

                {activity.description && (
                  <p className="text-sm text-muted-foreground mt-2">{activity.description}</p>
                )}

                {activity.rejection_reason && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm text-red-800">
                      <strong>Rejection Reason:</strong> {activity.rejection_reason}
                    </p>
                  </div>
                )}

                {activity.file_urls && activity.file_urls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
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

              <div className="flex space-x-2 ml-4">
                {activity.status === 'draft' && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(activity)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(activity.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                )}
                {activity.status === 'rejected' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(activity)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityTracker;

