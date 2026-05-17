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
import { seedAdmin } from '@/services/authApi';

const seedSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  seedKey: z.string().min(4, 'Seed key is required')
});

type SeedForm = z.infer<typeof seedSchema>;

export function SeedAdminPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<SeedForm>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      seedKey: ''
    },
    resolver: zodResolver(seedSchema)
  });

  const mutation = useMutation({
    mutationFn: seedAdmin,
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
        <Alert title="Admin seed failed" description={errorMessage} tone="danger" />
      ) : null}
      <Input
        label="Admin name"
        placeholder="Admin User"
        error={errors.name?.message}
        {...register('name')}
      />
      <Input
        label="Admin email"
        placeholder="admin@company.com"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        type="password"
        label="Password"
        placeholder="Create a strong password"
        error={errors.password?.message}
        {...register('password')}
      />
      <Input
        type="password"
        label="Admin seed key"
        placeholder="Enter ADMIN_SEED_KEY"
        error={errors.seedKey?.message}
        {...register('seedKey')}
      />
      <Button
        className="w-full"
        size="lg"
        type="submit"
        disabled={isSubmitting || mutation.isPending}
      >
        {mutation.isPending ? 'Seeding admin...' : 'Seed admin account'}
      </Button>
    </form>
  );
}
