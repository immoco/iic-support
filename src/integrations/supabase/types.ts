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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          id: string
          actor_email: string
          action_type: string
          target_id: string
          target_type: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          actor_email: string
          action_type: string
          target_id: string
          target_type: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          actor_email?: string
          action_type?: string
          target_id?: string
          target_type?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: []
      }
      admin_notes: {
        Row: {
          admin_id: string
          created_at: string
          id: string
          note: string
          request_id: string
          visible_to_student: boolean
        }
        Insert: {
          admin_id: string
          created_at?: string
          id?: string
          note: string
          request_id: string
          visible_to_student?: boolean
        }
        Update: {
          admin_id?: string
          created_at?: string
          id?: string
          note?: string
          request_id?: string
          visible_to_student?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          active: boolean
          body: string
          created_at: string
          display_order: number
          id: string
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          body: string
          created_at?: string
          display_order?: number
          id?: string
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          body?: string
          created_at?: string
          display_order?: number
          id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      escalations: {
        Row: {
          created_at: string
          id: string
          reason: string
          request_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          reason: string
          request_id: string
        }
        Update: {
          created_at?: string
          id?: string
          reason?: string
          request_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "escalations_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "requests"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          active: boolean
          answer: string
          category: Database["public"]["Enums"]["issue_category"]
          created_at: string
          id: string
          keywords: string[] | null
          question: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          answer: string
          category: Database["public"]["Enums"]["issue_category"]
          created_at?: string
          id?: string
          keywords?: string[] | null
          question: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          answer?: string
          category?: Database["public"]["Enums"]["issue_category"]
          created_at?: string
          id?: string
          keywords?: string[] | null
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      requests: {
        Row: {
          admin_response: string | null
          affected_activity: string | null
          created_at: string
          description: string
          exception_type: Database["public"]["Enums"]["exception_type"] | null
          id: string
          issue_category: Database["public"]["Enums"]["issue_category"] | null
          priority: number
          request_type: Database["public"]["Enums"]["request_type"]
          status: Database["public"]["Enums"]["request_status"]
          student_id: string
          title: string
          training_level: Database["public"]["Enums"]["training_level"]
          updated_at: string
        }
        Insert: {
          admin_response?: string | null
          affected_activity?: string | null
          created_at?: string
          description: string
          exception_type?: Database["public"]["Enums"]["exception_type"] | null
          id?: string
          issue_category?: Database["public"]["Enums"]["issue_category"] | null
          priority?: number
          request_type: Database["public"]["Enums"]["request_type"]
          status?: Database["public"]["Enums"]["request_status"]
          student_id: string
          title: string
          training_level: Database["public"]["Enums"]["training_level"]
          updated_at?: string
        }
        Update: {
          admin_response?: string | null
          affected_activity?: string | null
          created_at?: string
          description?: string
          exception_type?: Database["public"]["Enums"]["exception_type"] | null
          id?: string
          issue_category?: Database["public"]["Enums"]["issue_category"] | null
          priority?: number
          request_type?: Database["public"]["Enums"]["request_type"]
          status?: Database["public"]["Enums"]["request_status"]
          student_id?: string
          title?: string
          training_level?: Database["public"]["Enums"]["training_level"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_allowed_email: { Args: { email: string }; Returns: boolean }
    }
    Enums: {
      app_role: "student" | "admin"
      exception_type:
        | "medical_emergency"
        | "personal_unforeseen"
        | "missed_activity"
        | "deadline_extension"
        | "reattempt_request"
      issue_category:
        | "registration_eligibility"
        | "payment_refund"
        | "activity_points"
        | "training_schedule"
        | "portal_technical"
        | "level_3_one_on_one"
        | "other"
      request_status:
        | "open"
        | "under_review"
        | "approved"
        | "rejected"
        | "resolved"
      request_type: "issue" | "exception"
      training_level: "level_1" | "level_2" | "level_3"
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
      app_role: ["student", "admin"],
      exception_type: [
        "medical_emergency",
        "personal_unforeseen",
        "missed_activity",
        "deadline_extension",
        "reattempt_request",
      ],
      issue_category: [
        "registration_eligibility",
        "payment_refund",
        "activity_points",
        "training_schedule",
        "portal_technical",
        "level_3_one_on_one",
        "other",
      ],
      request_status: [
        "open",
        "under_review",
        "approved",
        "rejected",
        "resolved",
      ],
      request_type: ["issue", "exception"],
      training_level: ["level_1", "level_2", "level_3"],
    },
  },
} as const
