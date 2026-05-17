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
import { register as registerUser } from '@/services/authApi';

const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<RegisterForm>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    },
    resolver: zodResolver(registerSchema)
  });

  const mutation = useMutation({
    mutationFn: registerUser,
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
        <Alert title="Registration failed" description={errorMessage} tone="danger" />
      ) : null}
      <Input
        label="Full name"
        placeholder="Riya Sharma"
        error={errors.name?.message}
        {...register('name', { required: 'Name is required' })}
      />
      <Input
        label="Work email"
        placeholder="you@company.com"
        error={errors.email?.message}
        {...register('email', { required: 'Email is required' })}
      />
      <Input
        type="password"
        label="Password"
        placeholder="Create a strong password"
        error={errors.password?.message}
        {...register('password', { required: 'Password is required', minLength: 8 })}
      />
      <Button
        className="w-full"
        size="lg"
        type="submit"
        disabled={isSubmitting || mutation.isPending}
      >
        {mutation.isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  );
}
