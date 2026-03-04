'use client';

import { useActionState } from 'react';
import { submitContactForm, type ContactState } from '@/app/contact/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, null);

  useEffect(() => {
    if (state?.success) {
      toast.success('Your enquiry has been sent successfully!');
      const form = document.querySelector('form') as HTMLFormElement;
      form?.reset();
    } else if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="John Doe"
            className="h-12 bg-slate-50 border-slate-200"
            required
          />
          {state?.fieldErrors?.name && (
            <p className="text-xs text-destructive font-medium">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            className="h-12 bg-slate-50 border-slate-200"
            required
          />
          {state?.fieldErrors?.email && (
            <p className="text-xs text-destructive font-medium">{state.fieldErrors.email[0]}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            placeholder="+91 98765 43210"
            className="h-12 bg-slate-50 border-slate-200"
            required
          />
          {state?.fieldErrors?.phone && (
            <p className="text-xs text-destructive font-medium">{state.fieldErrors.phone[0]}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            name="subject"
            placeholder="Bulk Quote Requirement"
            className="h-12 bg-slate-50 border-slate-200"
            required
          />
          {state?.fieldErrors?.subject && (
            <p className="text-xs text-destructive font-medium">{state.fieldErrors.subject[0]}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us more about your requirement..."
          className="min-h-[150px] bg-slate-50 border-slate-200 p-4"
          required
        />
        {state?.fieldErrors?.message && (
          <p className="text-xs text-destructive font-medium">{state.fieldErrors.message[0]}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-14 rounded-2xl text-lg font-bold"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Send Enquiry
          </>
        )}
      </Button>
    </form>
  );
}
