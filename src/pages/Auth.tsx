import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user, signInWithOTP } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    const valid = email.toString().includes("study.iitm.ac.in");

    if (valid) {
      setIsLoading(true);
      const { error } = await signInWithOTP(email);
      setIsLoading(false);
      if (error) return toast.error(error.message || 'Failed to send One time Login Link');
      toast.success('One Time Login link is sent!');
      setIsOtpSent(true);
    }

  };

  // const handleVerifyOTP = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (otp.length !== 6) return toast.error('Please enter the 6-digit OTP');

  //   setIsLoading(true);
  //   const { error } = await verifyOTP(email, otp);
  //   setIsLoading(false);

  //   if (error) return toast.error(error.message || 'Invalid OTP');
  //   toast.success('Successfully signed in!');
  //   navigate('/');
  // };

  // const handleResendOTP = async () => {
  //   setIsLoading(true);
  //   const { error } = await signInWithOTP(email);
  //   setIsLoading(false);
  //   error ? toast.error('Failed to resend OTP') : toast.success('OTP resent!');
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{isOtpSent ? 'Check your mail Inbox' : 'Sign In'}</CardTitle>
          <CardDescription>
            {isOtpSent ? `One-Time Login Link is sent to ${email}. Kindly check it.` : 'Enter your email to receive a one-time password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send One-Time Login Link'}</Button>
            </form>
          ) : (
            <div>
              <Button className='w-full' onClick={() => window.open('https://mail.google.com', '_blank')}>Open Gmail</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
