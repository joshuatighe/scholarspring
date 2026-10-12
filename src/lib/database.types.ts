// Types for the tables in supabase/migrations. Keep in sync with the SQL.

export type ScholarshipRow = {
  id: string
  name: string
  provider: string
  category: string
  amount: number
  /** ISO date, e.g. "2026-04-30". */
  deadline: string
  min_gpa: number
  majors: string[]
  regions: string[]
  description: string
  eligibility: string
  url: string | null
  created_at: string
}

export type ProfileRow = {
  id: string
  username: string
  gpa: number
  major: string
  region: string
  created_at: string
  updated_at: string
}

export type SavedScholarshipRow = {
  profile_id: string
  scholarship_id: string
  saved_at: string
}

// Same shape as `supabase gen types typescript` output. Writes the database refuses
// (scholarships, profile inserts, username changes) are still enforced by its grants and RLS.
export type Database = {
  __InternalSupabase: { PostgrestVersion: '12' }
  public: {
    Tables: {
      scholarships: {
        Row: ScholarshipRow
        Insert: Omit<ScholarshipRow, 'created_at'> & { created_at?: string }
        Update: Partial<ScholarshipRow>
        Relationships: []
      }
      profiles: {
        Row: ProfileRow
        Insert: Omit<ProfileRow, 'created_at' | 'updated_at'> & { created_at?: string; updated_at?: string }
        Update: Partial<Pick<ProfileRow, 'gpa' | 'major' | 'region'>>
        Relationships: []
      }
      saved_scholarships: {
        Row: SavedScholarshipRow
        Insert: { scholarship_id: string; profile_id?: string; saved_at?: string }
        Update: Partial<SavedScholarshipRow>
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: {
      username_available: { Args: { name: string }; Returns: boolean }
    }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}
