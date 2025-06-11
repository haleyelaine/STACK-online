// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://adsmgubyhoujugapdptm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkc21ndWJ5aG91anVnYXBkcHRtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjcxODgsImV4cCI6MjA2Mzk0MzE4OH0.geBkcPfhv9mtuQOHGVat8wtOsLJxToj1mj5szZVqP4c';
export const supabase = createClient(supabaseUrl, supabaseKey);
