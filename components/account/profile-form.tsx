'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updateProfile, type ActionState } from '@/app/account/actions';
import { User } from '@supabase/supabase-js';

interface ProfileData {
  full_name?: string | null;
  phone?: string | null;
}

export function ProfileForm({ user, profile }: { user: User | null; profile: ProfileData | null }) {
  const [state, formAction, isPending] = useActionState(updateProfile, null);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {state?.error && <div className="text-sm text-destructive">{state.error}</div>}
      {state?.success && (
        <div className="text-sm text-green-600">Profile updated successfully.</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" value={user?.email || ''} disabled />
        <p className="text-xs text-muted-foreground">
          Your email is tied to your identity provider.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile?.full_name || ''}
          placeholder="Your full name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={profile?.phone || ''}
          placeholder="+91 1234567890"
          type="tel"
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Saving...' : 'Save Changes'}
      </Button>
    </form>
  );
}
