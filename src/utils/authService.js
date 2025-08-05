import { supabase, handleSupabaseError } from '../lib/supabase';

class AuthService {
  // Sign in with email and password
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session
        }
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      
      return {
        success: false,
        error: 'Something went wrong during login. Please try again.'
      };
    }
  }

  // Sign up with email, password and additional user data
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
            role: userData.role || 'patient',
            organization_id: userData.organizationId || null
          }
        }
      });

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true,
        data: {
          user: data.user,
          session: data.session
        }
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      
      return {
        success: false,
        error: 'Something went wrong during signup. Please try again.'
      };
    }
  }

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      
      return {
        success: false,
        error: 'Something went wrong during logout. Please try again.'
      };
    }
  }

  // Get current session
  async getSession() {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to get session'
      };
    }
  }

  // Get user profile from our user_profiles table
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          organization:organizations(*)
        `)
        .eq('id', userId)
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to load user profile'
      };
    }
  }

  // Update user profile
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select(`
          *,
          organization:organizations(*)
        `)
        .single();

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to update profile'
      };
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('AuthRetryableFetchError')) {
        return {
          success: false,
          error: 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to send reset email'
      };
    }
  }

  // Get organizations for tenant selection
  async getOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('id, name, slug, plan')
        .order('name');

      if (error) {
        return {
          success: false,
          error: handleSupabaseError(error)
        };
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      if (error?.message?.includes('Failed to fetch') || 
          error?.message?.includes('NetworkError')) {
        return {
          success: false,
          error: 'Cannot connect to database. Your Supabase project may be paused or deleted. Please visit your Supabase dashboard to check project status.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to load organizations'
      };
    }
  }

  // Listen for auth state changes
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export default new AuthService();