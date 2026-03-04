import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AddressesPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Addresses</CardTitle>
        <CardDescription>Manage your shipping and billing addresses.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">You have no saved addresses yet.</p>
        <Button>Add New Address</Button>
      </CardContent>
    </Card>
  );
}
