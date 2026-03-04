'use client';

import { useActionState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { updatePassword, type ActionState } from '@/app/account/actions';

export function SecurityForm() {
  const [state, formAction, isPending] = useActionState(updatePassword, null);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      {state?.error && <div className="text-sm text-destructive">{state.error}</div>}
      {state?.success && (
        <div className="text-sm text-green-600">Password updated successfully.</div>
      )}

      <div className="space-y-2">
        <Label htmlFor="current_password">Current Password</Label>
        <Input id="current_password" name="current_password" type="password" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="new_password">New Password</Label>
        <Input id="new_password" name="new_password" type="password" required minLength={6} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm_password">Confirm New Password</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          required
          minLength={6}
        />
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  );
}
