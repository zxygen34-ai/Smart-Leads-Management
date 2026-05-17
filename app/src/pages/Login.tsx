import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/context/AuthContext';
import { getErrorMessage } from '@/lib/errors';
import { login } from '@/services/authApi';

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(loginSchema)
  });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (auth) => {
      setAuth(auth);
      navigate('/leads', { replace: true });
    }
  });

  const onSubmit = handleSubmit(async (values) => {
    await mutation.mutateAsync(values);
  });

  const errorMessage = mutation.isError ? getErrorMessage(mutation.error) : null;

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      {errorMessage ? (
        <Alert title="Login failed" description={errorMessage} tone="danger" />
      ) : null}
      <Input
        label="Email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <Input
        type="password"
        label="Password"
        placeholder="********"
        error={errors.password?.message}
        {...register('password', { required: 'Password is required' })}
      />
      <Button
        className="w-full"
        size="lg"
        type="submit"
        disabled={isSubmitting || mutation.isPending}
      >
        {mutation.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
