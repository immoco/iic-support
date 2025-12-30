-- Fix Security Issues

-- 1. Remove the overly permissive policy that exposes resolved requests to all users
DROP POLICY IF EXISTS "Anyone authenticated can view resolved requests" ON public.requests;

-- 2. Add INSERT policy for profiles (only the trigger/system should create profiles)
-- This ensures users can't manually insert profiles for other users
CREATE POLICY "System creates profiles via trigger"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Ensure user_roles has explicit policies to prevent privilege escalation
-- Drop and recreate to be explicit about what admins can do
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Admin can INSERT roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can UPDATE roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Admin can DELETE roles (if needed)
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));