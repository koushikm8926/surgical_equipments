'use client';

import { useEffect, useState } from 'react';
import { Store, Mail, Globe, Shield, Bell, Palette, User, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface AdminProfile {
  email: string;
  full_name: string | null;
  role: string;
}

export default function AdminSettingsPage() {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        if (res.ok) {
          setAdmin({
            email: 'admin@surgicalequip.com',
            full_name: 'Default Admin',
            role: 'admin',
          });
        }
      } catch {
        toast.error('Failed to load admin profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-400 font-bold tracking-widest text-[10px] uppercase">
          Loading Settings...
        </p>
      </div>
    );
  }

  const settingsCards = [
    {
      title: 'Store Information',
      icon: Store,
      items: [
        { label: 'Store Name', value: 'SurgicalStore' },
        { label: 'Support Email', value: 'support@surgicalequip.com' },
        { label: 'Currency', value: 'INR (₹)' },
        { label: 'Tax Included', value: 'Yes' },
      ],
    },
    {
      title: 'Regional Settings',
      icon: Globe,
      items: [
        { label: 'Default Language', value: 'English' },
        { label: 'Timezone', value: 'Asia/Kolkata (IST)' },
        { label: 'Date Format', value: 'DD MMM YYYY' },
        { label: 'Shipping Zone', value: 'India (Domestic)' },
      ],
    },
    {
      title: 'Security & Access',
      icon: Shield,
      items: [
        { label: 'Two-Factor Auth', value: 'Disabled' },
        { label: 'Session Timeout', value: '24 hours' },
        { label: 'Login Method', value: 'Email + Password' },
        { label: 'API Rate Limit', value: '100 req/min' },
      ],
    },
  ];

  const futureFeatures = [
    { title: 'Notifications', icon: Bell, description: 'Email & push notification preferences' },
    {
      title: 'Appearance',
      icon: Palette,
      description: 'Theme, branding & storefront customization',
    },
    { title: 'Billing', icon: IndianRupee, description: 'Payment gateway & invoice settings' },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 font-medium bg-slate-100 w-fit px-3 py-1 rounded-full text-xs">
          Store Configuration & Admin Profile
        </p>
      </div>

      {/* Admin Profile Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 shadow-2xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 blur-[80px] rounded-full" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/30 to-violet-500/30 flex items-center justify-center border border-white/10">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="font-black text-xl">{admin?.full_name || 'Admin'}</h2>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] font-black uppercase tracking-widest rounded-lg">
                {admin?.role}
              </Badge>
            </div>
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <Mail className="w-3.5 h-3.5" />
              {admin?.email}
            </div>
          </div>
          <Button
            variant="secondary"
            className="rounded-2xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border-0"
            disabled
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {settingsCards.map((card) => (
          <Card
            key={card.title}
            className="border-slate-200 rounded-[24px] shadow-sm hover:shadow-md transition-shadow"
          >
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                <card.icon className="w-4 h-4 text-primary" />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {card.items.map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-slate-500 font-medium">{item.label}</span>
                  <span className="text-sm text-slate-900 font-bold">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Future Features */}
      <div>
        <h2 className="font-black text-slate-900 text-lg mb-4">Coming Soon</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {futureFeatures.map((feature) => (
            <div
              key={feature.title}
              className="bg-white border border-dashed border-slate-200 rounded-2xl p-6 opacity-60 cursor-not-allowed"
            >
              <feature.icon className="w-8 h-8 text-slate-300 mb-4" />
              <h3 className="font-bold text-slate-600 text-sm mb-1">{feature.title}</h3>
              <p className="text-xs text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
          Settings are read-only in this version • SurgicalStore Admin v1.0
        </p>
      </div>
    </div>
  );
}
