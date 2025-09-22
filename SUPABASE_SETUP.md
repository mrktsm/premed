# Supabase Setup Instructions

## 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/login and create a new project
3. Wait for the project to be ready

## 2. Get Your Keys

1. Go to Settings > API
2. Copy your `Project URL` and `anon public` key
3. Create a `.env` file in the `client` folder:

```bash
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## 3. Set Up Database Tables

Go to the SQL Editor in your Supabase dashboard and run these commands:

### Enable RLS (Row Level Security)

```sql
-- Enable RLS on auth.users
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;
```

### Create Profiles Table

```sql
-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  user_type TEXT CHECK (user_type IN ('mentee', 'mentor')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy - users can only see their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Create Mentees Table

```sql
-- Create mentees table
CREATE TABLE mentees (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  academic_level TEXT,
  university TEXT,
  has_university BOOLEAN DEFAULT FALSE,
  primary_specialty TEXT,
  md_do_interest TEXT,
  applicant_type TEXT,
  gender_identity TEXT,
  guidance_areas JSONB,
  mentorship_goals JSONB,
  communication_mode TEXT,
  meeting_frequency TEXT,
  geographical_preference TEXT,
  research_experience TEXT,
  research_interest TEXT,
  similar_identity_preference TEXT,
  mcat_status TEXT,
  application_timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mentees ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Mentees can view own profile" ON mentees
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Mentees can update own profile" ON mentees
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Mentees can insert own profile" ON mentees
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow mentors to view mentee profiles for matching
CREATE POLICY "Mentors can view mentee profiles" ON mentees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'mentor'
    )
  );
```

### Create Mentors Table

```sql
-- Create mentors table
CREATE TABLE mentors (
  id UUID REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  primary_specialty TEXT,
  career_stage TEXT,
  education_type TEXT,
  research_field TEXT,
  research_experience TEXT,
  applicant_type_experience TEXT,
  mentorship_style TEXT,
  comfortable_topics JSONB,
  communication_mode TEXT,
  meeting_frequency TEXT,
  geographical_openness TEXT,
  gender_identity TEXT,
  similar_identity_importance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE mentors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Mentors can view own profile" ON mentors
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Mentors can update own profile" ON mentors
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Mentors can insert own profile" ON mentors
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow mentees to view mentor profiles for matching
CREATE POLICY "Mentees can view mentor profiles" ON mentors
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.user_type = 'mentee'
    )
  );
```

### Create Matches Table

```sql
-- Create matches table
CREATE TABLE matches (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  mentee_id UUID REFERENCES mentees(id) ON DELETE CASCADE,
  mentor_id UUID REFERENCES mentors(id) ON DELETE CASCADE,
  match_score DECIMAL(5,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their matches" ON matches
  FOR SELECT USING (
    auth.uid() = mentee_id OR auth.uid() = mentor_id
  );

CREATE POLICY "Users can update their matches" ON matches
  FOR UPDATE USING (
    auth.uid() = mentee_id OR auth.uid() = mentor_id
  );

CREATE POLICY "System can create matches" ON matches
  FOR INSERT WITH CHECK (true);
```

### Create Functions (Optional)

```sql
-- Function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, user_type)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'user_type', 'mentee')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

## 4. Test Your Setup

1. Start your React app: `npm run dev`
2. Try signing up with a test email
3. Check your Supabase dashboard to see if the user was created
4. Check the profiles table to see if a profile was created

## Next Steps

Once this is working, you can:

1. Update the questionnaire to save data to mentees table
2. Create a mentor signup flow
3. Implement the matching algorithm
4. Add a matches viewing page
