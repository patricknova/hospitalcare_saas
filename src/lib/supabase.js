import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  db: {
    schema: 'public'
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error) => {
  if (!error) return null;
  
  // Network/Infrastructure errors
  if (error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('AuthRetryableFetchError')) {
    return 'Cannot connect to authentication service. Your Supabase project may be paused or inactive. Please check your Supabase dashboard and resume your project if needed.';
  }
  
  // Common auth errors with user-friendly messages
  if (error.message === 'Invalid login credentials') {
    return 'Email ou mot de passe incorrect';
  }
  
  if (error.message === 'Email not confirmed') {
    return 'Veuillez vérifier votre email et cliquer sur le lien de confirmation';
  }
  
  if (error.message === 'User not found') {
    return 'Aucun compte trouvé avec cette adresse email';
  }
  
  if (error.message === 'Password should be at least 6 characters') {
    return 'Le mot de passe doit contenir au moins 6 caractères';
  }
  
  if (error.message === 'Signup not allowed for this instance') {
    return 'Les inscriptions ne sont pas autorisées. Contactez votre administrateur.';
  }
  
  // Return the original message for other errors
  return error.message || 'Une erreur inattendue s\'est produite';
};

export default supabase;