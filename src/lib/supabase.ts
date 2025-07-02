import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ctbdaguwxibcvlxohdqv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0YmRhZ3V3eGliY3ZseG9oZHF2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE0NTQyNDcsImV4cCI6MjA2NzAzMDI0N30.RhTBnU_5NoFBtA0EDj-783wHRr61hpJL756K0-MZhdg';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
