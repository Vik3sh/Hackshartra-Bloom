-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student', 'faculty');
CREATE TYPE public.faculty_level AS ENUM ('basic', 'senior', 'admin');
CREATE TYPE public.certificate_category AS ENUM ('academic', 'co_curricular');
CREATE TYPE public.certificate_status AS ENUM ('pending', 'approved', 'rejected');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  faculty_level faculty_level DEFAULT NULL,
  student_id TEXT,
  faculty_id TEXT,
  assigned_faculty_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category certificate_category NOT NULL,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  status certificate_status NOT NULL DEFAULT 'pending',
  verified_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  verified_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for certificates
CREATE POLICY "Students can view their own certificates" ON public.certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = certificates.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Faculty can view certificates of assigned students" ON public.certificates FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p2.assigned_faculty_id = p1.id 
    WHERE p1.user_id = auth.uid() AND p1.role = 'faculty' AND p2.id = certificates.student_id
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty' AND profiles.faculty_level IN ('senior', 'admin'))
);
CREATE POLICY "Students can insert their own certificates" ON public.certificates FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = certificates.student_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Faculty can update certificates" ON public.certificates FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.profiles p1 
    JOIN public.profiles p2 ON p2.assigned_faculty_id = p1.id 
    WHERE p1.user_id = auth.uid() AND p1.role = 'faculty' AND p2.id = certificates.student_id
  ) OR 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty' AND profiles.faculty_level IN ('senior', 'admin'))
);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = messages.sender_id AND profiles.user_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = messages.receiver_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = messages.sender_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can update their received messages" ON public.messages FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = messages.receiver_id AND profiles.user_id = auth.uid())
);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = notifications.user_id AND profiles.user_id = auth.uid())
);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = notifications.user_id AND profiles.user_id = auth.uid())
);

-- Create storage bucket for certificates
INSERT INTO storage.buckets (id, name, public) VALUES ('certificates', 'certificates', false);

-- Storage policies for certificates
CREATE POLICY "Students can upload their certificates" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'certificates' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'student')
);

CREATE POLICY "Users can view their related certificates" ON storage.objects FOR SELECT USING (
  bucket_id = 'certificates' AND (
    -- Students can view their own files
    (auth.uid()::text = (storage.foldername(name))[1]) OR
    -- Faculty can view files of their assigned students or if they are senior/admin
    EXISTS (
      SELECT 1 FROM public.profiles p1 
      JOIN public.profiles p2 ON p2.assigned_faculty_id = p1.id 
      WHERE p1.user_id = auth.uid() AND p1.role = 'faculty' AND p2.user_id::text = (storage.foldername(name))[1]
    ) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.user_id = auth.uid() AND profiles.role = 'faculty' AND profiles.faculty_level IN ('senior', 'admin'))
  )
);

-- Function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Triggers for timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create notification when certificate is verified
CREATE OR REPLACE FUNCTION public.notify_certificate_verification()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF OLD.status = 'pending' AND NEW.status IN ('approved', 'rejected') THEN
    INSERT INTO public.notifications (user_id, title, message, type)
    VALUES (
      NEW.student_id,
      'Certificate ' || NEW.status,
      'Your certificate "' || NEW.title || '" has been ' || NEW.status || 
      CASE WHEN NEW.status = 'rejected' AND NEW.rejection_reason IS NOT NULL 
           THEN '. Reason: ' || NEW.rejection_reason 
           ELSE '.' 
      END,
      'certificate_' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger for certificate verification notifications
CREATE TRIGGER on_certificate_status_change
  AFTER UPDATE ON public.certificates
  FOR EACH ROW EXECUTE FUNCTION public.notify_certificate_verification();