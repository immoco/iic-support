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
  const [resendCooldown, setResendCooldown] = useState(0);
  const { user, signInWithOTP, verifyOTP, role } = useAuth();
  const navigate = useNavigate();

  // Cooldown timer for OTP resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    // Only redirect once we have both user and role resolved
    if (user && role) {
      console.log(user)
      console.log(role)
      if (role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, role, navigate]);

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email address');

    setIsLoading(true);
    const { error } = await signInWithOTP(email);
    setIsLoading(false);

    if (error) return toast.error(error.message || 'Failed to send OTP');
    toast.success('OTP sent to your email!');
    setIsOtpSent(true);
    setResendCooldown(60); // Start 60s cooldown
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return toast.error('Please enter the 6-digit OTP');

    setIsLoading(true);
    const { error } = await verifyOTP(email, otp);
    setIsLoading(false);

    if (error) return toast.error(error.message || 'Invalid OTP');
    toast.success('Successfully signed in!');
  };

  const handleResendOTP = async () => {
    if (resendCooldown > 0) return; // Prevent resend during cooldown
    
    setIsLoading(true);
    const { error } = await signInWithOTP(email);
    setIsLoading(false);
    
    if (error) {
      toast.error('Failed to resend OTP');
    } else {
      toast.success('OTP resent!');
      setResendCooldown(60); // Start 60s cooldown
    }
    error ? toast.error('Failed to resend OTP') : toast.success('OTP resent!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{isOtpSent ? 'Verify OTP' : 'Sign In'}</CardTitle>
          <CardDescription>
            {isOtpSent ? `Enter the 6-digit code sent to ${email}` : 'Enter your email to receive a one-time password'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isOtpSent ? (
            <form onSubmit={handleSendOTP} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>{isLoading ? 'Sending...' : 'Send OTP'}</Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div className="flex justify-center">
                <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isLoading}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} /><InputOTPSlot index={1} /><InputOTPSlot index={2} />
                    <InputOTPSlot index={3} /><InputOTPSlot index={4} /><InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || otp.length !== 6}>{isLoading ? 'Verifying...' : 'Verify OTP'}</Button>
              <div className="flex flex-col gap-2 text-center text-sm text-muted-foreground">
                <button 
                  type="button" 
                  onClick={handleResendOTP} 
                  className="hover:text-primary underline disabled:opacity-50 disabled:cursor-not-allowed" 
                  disabled={isLoading || resendCooldown > 0}
                >
                  {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
                </button>
                <button type="button" onClick={() => { setIsOtpSent(false); setOtp(''); }} className="hover:text-primary underline">Use different email</button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
