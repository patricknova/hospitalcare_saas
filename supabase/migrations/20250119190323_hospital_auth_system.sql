-- Location: supabase/migrations/20250119190323_hospital_auth_system.sql

-- 1. Custom Types
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'doctor', 'nurse', 'receptionist', 'pharmacist', 'patient');
CREATE TYPE public.organization_plan AS ENUM ('basic', 'professional', 'enterprise');
CREATE TYPE public.user_status AS ENUM ('active', 'inactive', 'suspended', 'pending');

-- 2. Organizations Table (Multi-tenant)
CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    logo_url TEXT,
    plan public.organization_plan DEFAULT 'basic'::public.organization_plan,
    settings JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. User Profiles Table (Critical intermediary for PostgREST compatibility)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'patient'::public.user_role,
    status public.user_status DEFAULT 'active'::public.user_status,
    avatar_url TEXT,
    professional_id TEXT, -- Medical license number
    specialization TEXT, -- For doctors
    department TEXT,
    hire_date DATE,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Essential Indexes
CREATE INDEX idx_organizations_slug ON public.organizations(slug);
CREATE INDEX idx_user_profiles_organization_id ON public.user_profiles(organization_id);
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);

-- 5. RLS Setup
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- 6. Helper Functions (One per access pattern)
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT up.organization_id
FROM public.user_profiles up
WHERE up.id = auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.is_organization_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() 
    AND up.role IN ('super_admin'::public.user_role, 'admin'::public.user_role)
)
$$;

CREATE OR REPLACE FUNCTION public.is_same_organization(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up1
    JOIN public.user_profiles up2 ON up1.organization_id = up2.organization_id
    WHERE up1.id = auth.uid() AND up2.id = target_user_id
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, first_name, last_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'first_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::public.user_role, 'patient'::public.user_role)
  );
  RETURN NEW;
END;
$$;

-- 7. Trigger for new user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. RLS Policies (One function call per policy)
CREATE POLICY "organizations_viewable_by_members"
ON public.organizations
FOR SELECT
TO authenticated
USING (id = public.get_user_organization_id());

CREATE POLICY "organizations_manageable_by_admins"
ON public.organizations
FOR ALL
TO authenticated
USING (public.is_organization_admin() AND id = public.get_user_organization_id())
WITH CHECK (public.is_organization_admin() AND id = public.get_user_organization_id());

CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_same_organization(id));

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_manage_organization_users"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_organization_admin() AND public.is_same_organization(id))
WITH CHECK (public.is_organization_admin() AND public.is_same_organization(id));

-- 9. Complete Mock Data for Testing
DO $$
DECLARE
    org1_id UUID := gen_random_uuid();
    org2_id UUID := gen_random_uuid();
    admin_id UUID := gen_random_uuid();
    doctor_id UUID := gen_random_uuid();
    nurse_id UUID := gen_random_uuid();
    reception_id UUID := gen_random_uuid();
    patient_id UUID := gen_random_uuid();
BEGIN
    -- Create organizations
    INSERT INTO public.organizations (id, name, slug, address, phone, email, plan) VALUES
        (org1_id, 'Centre Hospitalier de Yaoundé', 'chu-yaounde', 'Avenue Kennedy, Yaoundé', '+237 222 234 567', 'contact@chu-yaounde.cm', 'professional'::public.organization_plan),
        (org2_id, 'Clinique Sainte Marie', 'clinique-sainte-marie', 'Bastos, Yaoundé', '+237 222 789 123', 'info@sainte-marie.cm', 'basic'::public.organization_plan);

    -- Create complete auth.users records
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@hospitalcare.cm', crypt('Admin123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"first_name": "Jean", "last_name": "Administrateur", "role": "admin"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (doctor_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'dr.martin@hospitalcare.cm', crypt('Doctor123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"first_name": "Dr. Jean", "last_name": "Martin", "role": "doctor"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (nurse_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'nurse.marie@hospitalcare.cm', crypt('Nurse123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"first_name": "Marie", "last_name": "Infirmiere", "role": "nurse"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (reception_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'reception@hospitalcare.cm', crypt('Reception123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"first_name": "Claire", "last_name": "Reception", "role": "receptionist"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (patient_id, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'patient@hospitalcare.cm', crypt('Patient123!', gen_salt('bf', 10)), now(), now(), now(),
         '{"first_name": "Paul", "last_name": "Patient", "role": "patient"}'::jsonb,
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Update user profiles with organization assignments
    UPDATE public.user_profiles SET 
        organization_id = org1_id,
        phone = '+237 677 123 456',
        professional_id = 'ADM001',
        department = 'Administration'
    WHERE id = admin_id;

    UPDATE public.user_profiles SET 
        organization_id = org1_id,
        phone = '+237 677 234 567',
        professional_id = 'DOC001',
        specialization = 'Médecine Générale',
        department = 'Consultation'
    WHERE id = doctor_id;

    UPDATE public.user_profiles SET 
        organization_id = org1_id,
        phone = '+237 677 345 678',
        professional_id = 'NUR001',
        department = 'Soins Généraux'
    WHERE id = nurse_id;

    UPDATE public.user_profiles SET 
        organization_id = org1_id,
        phone = '+237 677 456 789',
        department = 'Accueil'
    WHERE id = reception_id;

    UPDATE public.user_profiles SET 
        organization_id = org1_id,
        phone = '+237 677 567 890'
    WHERE id = patient_id;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Error creating mock data: %', SQLERRM;
END $$;

-- 10. Cleanup function for testing
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs for test accounts
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%hospitalcare.cm';

    -- Delete in dependency order (children first)
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.organizations WHERE email LIKE '%hospitalcare.cm' OR email LIKE '%sainte-marie.cm';
    
    -- Delete auth.users last
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;