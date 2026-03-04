import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { signout } from '@/app/auth/actions';
import { AccountNavItem } from '@/components/account/nav-item';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>My Account</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <AccountNavItem href="/account" label="Profile Details" />
              <AccountNavItem href="/account/addresses" label="Saved Addresses" />
              <AccountNavItem href="/account/security" label="Security" />
              <form action={signout} className="mt-4 border-t pt-4 w-full">
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full justify-start text-destructive"
                >
                  Log out
                </Button>
              </form>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
