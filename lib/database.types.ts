export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '12.2.3 (519615d)'
  }
  public: {
    Tables: {
      bucket_list_items: {
        Row: {
          completed: boolean | null
          created_at: string | null
          elo_score: number | null
          id: string
          price: number | null
          suggested_by: string | null
          suggested_by_avatar: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          elo_score?: number | null
          id?: string
          price?: number | null
          suggested_by?: string | null
          suggested_by_avatar?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          elo_score?: number | null
          id?: string
          price?: number | null
          suggested_by?: string | null
          suggested_by_avatar?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      drawings: {
        Row: {
          author_name: string | null
          created_at: string | null
          id: string
          image_url: string
          is_flagged: boolean | null
          message: string | null
          reviewed: boolean | null
          user_id: string | null
        }
        Insert: {
          author_name?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          is_flagged?: boolean | null
          message?: string | null
          reviewed?: boolean | null
          user_id?: string | null
        }
        Update: {
          author_name?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          is_flagged?: boolean | null
          message?: string | null
          reviewed?: boolean | null
          user_id?: string | null
        }
        Relationships: []
      }
      votes: {
        Row: {
          created_at: string
          id: string
          loser_id: string | null
          winner_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          loser_id?: string | null
          winner_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          loser_id?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'votes_loser_id_fkey'
            columns: ['loser_id']
            isOneToOne: false
            referencedRelation: 'bucket_list_items'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'votes_winner_id_fkey'
            columns: ['winner_id']
            isOneToOne: false
            referencedRelation: 'bucket_list_items'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_bucket_list_vote: {
        Args: { p_loser_id: string; p_winner_id: string }
        Returns: undefined
      }
      update_elo_scores: {
        Args: { k_factor?: number; loser_id: string; winner_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>
type DefaultSchema = DatabaseWithoutInternals['public']

export type Tables<
  TableName extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views']),
> = (DefaultSchema['Tables'] & DefaultSchema['Views'])[TableName] extends {
  Row: infer Row
}
  ? Row
  : never

export type TablesInsert<TableName extends keyof DefaultSchema['Tables']> =
  DefaultSchema['Tables'][TableName] extends { Insert: infer Insert }
    ? Insert
    : never

export type TablesUpdate<TableName extends keyof DefaultSchema['Tables']> =
  DefaultSchema['Tables'][TableName] extends { Update: infer Update }
    ? Update
    : never
