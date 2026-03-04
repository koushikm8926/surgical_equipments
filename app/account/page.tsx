import { createClient } from '@/utils/supabase/server';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileForm } from '@/components/account/profile-form';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch from profiles table
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user?.id).single();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Details</CardTitle>
        <CardDescription>Update your personal information.</CardDescription>
      </CardHeader>
      <CardContent>
        <ProfileForm user={user} profile={profile} />
      </CardContent>
    </Card>
  );
}
