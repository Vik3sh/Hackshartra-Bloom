export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      academic_records: {
        Row: {
          id: string
          student_id: string
          semester: string
          subject_code: string
          subject_name: string
          credits: number
          grade: string
          grade_points: number | null
          cgpa: number | null
          academic_year: string
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          semester: string
          subject_code: string
          subject_name: string
          credits: number
          grade: string
          grade_points?: number | null
          cgpa?: number | null
          academic_year: string
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          semester?: string
          subject_code?: string
          subject_name?: string
          credits?: number
          grade?: string
          grade_points?: number | null
          cgpa?: number | null
          academic_year?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "academic_records_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      activities: {
        Row: {
          id: string
          student_id: string
          title: string
          description: string | null
          activity_type: Database["public"]["Enums"]["activity_type"]
          category: Database["public"]["Enums"]["certificate_category"]
          status: Database["public"]["Enums"]["activity_status"]
          start_date: string | null
          end_date: string | null
          organization: string | null
          location: string | null
          credits_earned: number
          file_urls: string[] | null
          file_names: string[] | null
          verified_by: string | null
          verified_at: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          description?: string | null
          activity_type: Database["public"]["Enums"]["activity_type"]
          category: Database["public"]["Enums"]["certificate_category"]
          status?: Database["public"]["Enums"]["activity_status"]
          start_date?: string | null
          end_date?: string | null
          organization?: string | null
          location?: string | null
          credits_earned?: number
          file_urls?: string[] | null
          file_names?: string[] | null
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string
          description?: string | null
          activity_type?: Database["public"]["Enums"]["activity_type"]
          category?: Database["public"]["Enums"]["certificate_category"]
          status?: Database["public"]["Enums"]["activity_status"]
          start_date?: string | null
          end_date?: string | null
          organization?: string | null
          location?: string | null
          credits_earned?: number
          file_urls?: string[] | null
          file_names?: string[] | null
          verified_by?: string | null
          verified_at?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance: {
        Row: {
          id: string
          student_id: string
          subject_code: string
          date: string
          status: Database["public"]["Enums"]["attendance_status"]
          remarks: string | null
          marked_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          student_id: string
          subject_code: string
          date: string
          status: Database["public"]["Enums"]["attendance_status"]
          remarks?: string | null
          marked_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          subject_code?: string
          date?: string
          status?: Database["public"]["Enums"]["attendance_status"]
          remarks?: string | null
          marked_by?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_marked_by_fkey"
            columns: ["marked_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          category: Database["public"]["Enums"]["certificate_category"]
          description: string | null
          file_name: string
          file_url: string
          id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["certificate_status"]
          student_id: string
          title: string
          uploaded_at: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["certificate_category"]
          description?: string | null
          file_name: string
          file_url: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          student_id: string
          title: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["certificate_category"]
          description?: string | null
          file_name?: string
          file_url?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["certificate_status"]
          student_id?: string
          title?: string
          uploaded_at?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      institutional_reports: {
        Row: {
          id: string
          title: string
          description: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          generated_by: string | null
          parameters: Json | null
          file_url: string | null
          status: string
          created_at: string
          completed_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          report_type: Database["public"]["Enums"]["report_type"]
          generated_by?: string | null
          parameters?: Json | null
          file_url?: string | null
          status?: string
          created_at?: string
          completed_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          report_type?: Database["public"]["Enums"]["report_type"]
          generated_by?: string | null
          parameters?: Json | null
          file_url?: string | null
          status?: string
          created_at?: string
          completed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_reports_generated_by_fkey"
            columns: ["generated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          read_at: string | null
          receiver_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          read_at?: string | null
          receiver_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolios: {
        Row: {
          id: string
          student_id: string
          title: string
          description: string | null
          is_public: boolean
          share_token: string
          pdf_url: string | null
          last_generated: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          student_id: string
          title: string
          description?: string | null
          is_public?: boolean
          share_token?: string
          pdf_url?: string | null
          last_generated?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          student_id?: string
          title?: string
          description?: string | null
          is_public?: boolean
          share_token?: string
          pdf_url?: string | null
          last_generated?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolios_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          assigned_faculty_id: string | null
          created_at: string
          email: string
          faculty_id: string | null
          faculty_level: Database["public"]["Enums"]["faculty_level"] | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          student_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          assigned_faculty_id?: string | null
          created_at?: string
          email: string
          faculty_id?: string | null
          faculty_level?: Database["public"]["Enums"]["faculty_level"] | null
          full_name: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          student_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          assigned_faculty_id?: string | null
          created_at?: string
          email?: string
          faculty_id?: string | null
          faculty_level?: Database["public"]["Enums"]["faculty_level"] | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          student_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_assigned_faculty_id_fkey"
            columns: ["assigned_faculty_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_status: "draft" | "submitted" | "approved" | "rejected"
      activity_type: "conference" | "mooc" | "internship" | "volunteering" | "competition" | "certification" | "project" | "publication" | "workshop" | "seminar" | "sports" | "cultural" | "leadership" | "research" | "other"
      attendance_status: "present" | "absent" | "late" | "excused"
      certificate_category: "academic" | "co_curricular"
      certificate_status: "pending" | "approved" | "rejected"
      faculty_level: "basic" | "senior" | "admin"
      report_type: "naac" | "aicte" | "nirf" | "internal" | "custom"
      user_role: "student" | "faculty"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_status: ["draft", "submitted", "approved", "rejected"],
      activity_type: ["conference", "mooc", "internship", "volunteering", "competition", "certification", "project", "publication", "workshop", "seminar", "sports", "cultural", "leadership", "research", "other"],
      attendance_status: ["present", "absent", "late", "excused"],
      certificate_category: ["academic", "co_curricular"],
      certificate_status: ["pending", "approved", "rejected"],
      faculty_level: ["basic", "senior", "admin"],
      report_type: ["naac", "aicte", "nirf", "internal", "custom"],
      user_role: ["student", "faculty"],
    },
  },
} as const
