-- Enhanced schema for Smart Student Hub
-- Add new tables and extend existing ones for comprehensive student management

-- Drop existing trigger and function to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create activity types enum
CREATE TYPE public.activity_type AS ENUM (
  'conference', 'mooc', 'internship', 'volunteering', 'competition', 
  'certification', 'project', 'publication', 'workshop', 'seminar',
  'sports', 'cultural', 'leadership', 'research', 'other'
);

-- Create activity status enum
CREATE TYPE public.activity_status AS ENUM ('draft', 'submitted', 'approved', 'rejected');

-- Create attendance status enum
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late', 'excused');

-- Create report type enum
CREATE TYPE public.report_type AS ENUM ('naac', 'aicte', 'nirf', 'internal', 'custom');

-- Create activities table for comprehensive activity tracking
CREATE TABLE public.activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_type activity_type NOT NULL,
  category certificate_category NOT NULL, -- Reuse existing enum
  status activity_status NOT NULL DEFAULT 'draft',
  start_date DATE,
  end_date DATE,
  organization TEXT,
  location TEXT,
  credits_earned DECIMAL(5,2) DEFAULT 0,
  file_urls TEXT[], -- Array of file URLs
  file_names TEXT[], -- Array of file names
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create academic records table
CREATE TABLE public.academic_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  semester TEXT NOT NULL,
  subject_code TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  credits DECIMAL(5,2) NOT NULL,
  grade TEXT NOT NULL,
  grade_points DECIMAL(3,2),
  cgpa DECIMAL(4,2),
  academic_year TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  subject_code TEXT NOT NULL,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  remarks TEXT,
  marked_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create student portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_public BOOLEAN DEFAULT false,
  share_token TEXT UNIQUE,
  pdf_url TEXT,
  last_generated TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create institutional reports table
CREATE TABLE public.institutional_reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  report_type report_type NOT NULL,
  generated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  parameters JSONB, -- Store report parameters as JSON
  file_url TEXT,
  status TEXT DEFAULT 'generating',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create student achievements summary view
CREATE VIEW public.student_achievements_summary AS
SELECT 
  p.id as student_id,
  p.full_name,
  p.student_id as student_number,
  COUNT(DISTINCT c.id) as total_certificates,
  COUNT(DISTINCT CASE WHEN c.status = 'approved' THEN c.id END) as approved_certificates,
  COUNT(DISTINCT a.id) as total_activities,
  COUNT(DISTINCT CASE WHEN a.status = 'approved' THEN a.id END) as approved_activities,
  COALESCE(SUM(a.credits_earned), 0) as total_credits,
  COALESCE(AVG(ar.cgpa), 0) as current_cgpa
FROM public.profiles p
LEFT JOIN public.certificates c ON p.id = c.student_id
LEFT JOIN public.activities a ON p.id = a.student_id
LEFT JOIN public.academic_records ar ON p.id = ar.student_id
WHERE p.role = 'student'
GROUP BY p.id, p.full_name, p.student_id;

-- Enable RLS on new tables
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutional_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies for activities
CREATE POLICY "Students can view their own activities" ON public.activities FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = activities.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Faculty can view activities of assigned students" ON public.activities FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p2.assigned_faculty_id = p1.id 
    WHERE p1.user_id = auth.uid() AND p1.role = 'faculty' AND p2.id = activities.student_id
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty' AND profiles.faculty_level IN ('senior', 'admin'))
);
CREATE POLICY "Students can insert their own activities" ON public.activities FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = activities.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Faculty can update activities" ON public.activities FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p2.assigned_faculty_id = p1.id 
    WHERE p1.user_id = auth.uid() AND p1.role = 'faculty' AND p2.id = activities.student_id
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty' AND profiles.faculty_level IN ('senior', 'admin'))
);

-- RLS Policies for academic records
CREATE POLICY "Students can view their own academic records" ON public.academic_records FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = academic_records.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Faculty can view academic records of assigned students" ON public.academic_records FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p2.assigned_faculty_id = p1.id 
    WHERE p1.user_id = auth.uid() AND p1.role = 'faculty' AND p2.id = academic_records.student_id
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty' AND profiles.faculty_level IN ('senior', 'admin'))
);
CREATE POLICY "Faculty can manage academic records" ON public.academic_records FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty')
);

-- RLS Policies for attendance
CREATE POLICY "Students can view their own attendance" ON public.attendance FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = attendance.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Faculty can manage attendance" ON public.attendance FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty')
);

-- RLS Policies for portfolios
CREATE POLICY "Students can manage their own portfolios" ON public.portfolios FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = portfolios.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Public portfolios are viewable by all" ON public.portfolios FOR SELECT USING (is_public = true);

-- RLS Policies for institutional reports
CREATE POLICY "Faculty can manage institutional reports" ON public.institutional_reports FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty')
);

-- Create indexes for better performance
CREATE INDEX idx_activities_student_id ON public.activities(student_id);
CREATE INDEX idx_activities_type ON public.activities(activity_type);
CREATE INDEX idx_activities_status ON public.activities(status);
CREATE INDEX idx_academic_records_student_id ON public.academic_records(student_id);
CREATE INDEX idx_attendance_student_id ON public.attendance(student_id);
CREATE INDEX idx_attendance_date ON public.attendance(date);
CREATE INDEX idx_portfolios_student_id ON public.portfolios(student_id);
CREATE INDEX idx_portfolios_share_token ON public.portfolios(share_token);

-- Update the handle_new_user function to set faculty_level for faculty
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role, faculty_level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    CASE 
      WHEN COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student') = 'faculty' 
      THEN 'basic'::faculty_level
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Function to generate share token for portfolios
CREATE OR REPLACE FUNCTION public.generate_share_token()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$;

-- Function to create portfolio with share token
CREATE OR REPLACE FUNCTION public.create_portfolio_with_token()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.share_token IS NULL THEN
    NEW.share_token := public.generate_share_token();
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for portfolio share token generation
CREATE TRIGGER generate_portfolio_share_token
  BEFORE INSERT ON public.portfolios
  FOR EACH ROW EXECUTE FUNCTION public.create_portfolio_with_token();

-- Function to notify activity status change
CREATE OR REPLACE FUNCTION public.notify_activity_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'submitted' AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.student_id,
      'Activity ' || NEW.status,
      'Your activity "' || NEW.title || '" has been ' || NEW.status || 
      CASE WHEN NEW.status = 'rejected' AND NEW.rejection_reason IS NOT NULL 
           THEN '. Reason: ' || NEW.rejection_reason 
           ELSE '.' 
      END,
      'activity_' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for activity status change notifications
CREATE TRIGGER on_activity_status_change
  AFTER UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.notify_activity_status_change();

-- Recreate the user creation trigger with enhanced functionality
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


