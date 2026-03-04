import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function ResetPasswordPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email address and we will send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <Button type="button" className="w-full">
            Send Reset Link
          </Button>
          <div className="text-center text-sm text-muted-foreground mt-4">
            Remembered your password?{' '}
            <Link href="/auth/login" className="underline text-foreground">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
