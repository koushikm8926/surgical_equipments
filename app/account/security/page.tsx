import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SecurityForm } from '@/components/account/security-form';

export default function SecurityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Security & Password</CardTitle>
        <CardDescription>Update your password to keep your account secure.</CardDescription>
      </CardHeader>
      <CardContent>
        <SecurityForm />
      </CardContent>
    </Card>
  );
}
