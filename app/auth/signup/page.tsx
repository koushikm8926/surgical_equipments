'use client';

import Link from 'next/link';
import Image from 'next/image';
import { signup } from '../actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useActionState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GoogleSignInButton } from '@/components/auth/google-sign-in';
import { Stethoscope, ArrowLeft, ShieldCheck, HeartPulse, UserPlus } from 'lucide-react';

export default function SignupPage() {
  const [state, formAction, isPending] = useActionState(signup, null);

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-slate-950">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/medical_hero_banner.png"
          alt="Medical Facility"
          fill
          className="object-cover opacity-20"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-tl from-slate-950 via-slate-950/80 to-primary/20" />
      </div>

      {/* Decorative Blur Orbs */}
      <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] z-0 animate-pulse" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] z-0" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="bg-primary p-2.5 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
              <Stethoscope className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              Surgical<span className="text-primary">Equip</span>
            </span>
          </Link>
        </div>

        <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-2xl rounded-[2rem] overflow-hidden">
          <form action={formAction}>
            <CardHeader className="pt-8 pb-4 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-white">Create Account</CardTitle>
              <CardDescription className="text-slate-400 mt-2">
                Join our medical equipment network
                {state?.error && (
                  <div className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive-foreground animate-in fade-in zoom-in duration-300">
                    {state.error}
                  </div>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 px-8">
              <div className="grid gap-1.5">
                <Label htmlFor="full_name" className="text-slate-200 ml-1">
                  Full Name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  placeholder="John Doe"
                  required
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="email" className="text-slate-200 ml-1">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@hospital.com"
                  required
                  className="h-11 bg-white/5 border-white/10 text-white placeholder:text-slate-500 rounded-xl focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="password" className="text-slate-200 ml-1">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  className="h-11 bg-white/5 border-white/10 text-white rounded-xl focus:ring-primary/50 focus:border-primary transition-all"
                />
                <p className="text-[10px] text-slate-500 ml-1">Minimum 6 characters required</p>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base font-bold rounded-xl shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] mt-2"
                disabled={isPending}
              >
                {isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
                  <span className="bg-[#0b1120] px-3 text-slate-500">Or continue with</span>
                </div>
              </div>

              <GoogleSignInButton />
            </CardContent>
            <CardFooter className="pb-8 pt-2 flex flex-col gap-5">
              <div className="text-sm text-slate-400 text-center">
                Already have an account?{' '}
                <Link
                  href="/auth/login"
                  className="text-primary font-bold hover:underline underline-offset-4"
                >
                  Sign In
                </Link>
              </div>

              <div className="flex justify-center gap-6 pt-2 border-t border-white/5 w-full">
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  <ShieldCheck className="w-2.5 h-2.5 text-primary/60" />
                  Secure
                </div>
                <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-slate-500">
                  <HeartPulse className="w-2.5 h-2.5 text-primary/60" />
                  Trusted
                </div>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
