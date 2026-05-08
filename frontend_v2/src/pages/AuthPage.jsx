import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  clearAuthError,
  loginUser,
  registerUser,
} from '@/features/auth/authSlice';

const initialForm = {
  username: '',
  email: '',
  password: '',
};

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth,
  );
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);

  const redirectPath = useMemo(
    () => location.state?.from || '/chat',
    [location.state],
  );
  const isRegisterMode = mode === 'register';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, navigate, redirectPath]);

  useEffect(
    () => () => {
      dispatch(clearAuthError());
    },
    [dispatch],
  );

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthError());

    if (isRegisterMode) {
      await dispatch(
        registerUser({
          username: form.username,
          email: form.email,
          password: form.password,
        }),
      );
      return;
    }

    await dispatch(
      loginUser({
        username: form.username,
        password: form.password,
      }),
    );
  };

  return (
    <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-5xl items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="w-full border-border/60 shadow-sm">
          <CardHeader className="w-full border-b">
            <div className="flex w-full items-start justify-between gap-3">
              <div className="space-y-1">
                <CardTitle>
                  {isRegisterMode ? 'Create your account' : 'Login to continue'}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {isRegisterMode
                    ? 'Username, email and password are required for new users.'
                    : 'Use your username and password to sign in.'}
                </p>
              </div>
              {isRegisterMode && (
                <button
                  className={`rounded-md px-3 py-1.5 text-sm transition ${!isRegisterMode ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                  onClick={() => setMode('login')}
                  type="button"
                >
                  Login
                </button>
              )}
              {!isRegisterMode && (
                <button
                  className={`rounded-md px-3 py-1.5 text-sm transition ${isRegisterMode ? 'bg-background shadow-sm' : 'text-muted-foreground'}`}
                  onClick={() => setMode('register')}
                  type="button"
                >
                  Register
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              {error ? (
                <Alert variant="destructive">
                  <AlertTitle>Authentication failed</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  autoComplete="username"
                  id="username"
                  onChange={updateField('username')}
                  placeholder="Enter your username"
                  required
                  value={form.username}
                />
              </div>
              {isRegisterMode ? (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    autoComplete="email"
                    id="email"
                    onChange={updateField('email')}
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={form.email}
                  />
                </div>
              ) : null}

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  autoComplete={
                    isRegisterMode ? 'new-password' : 'current-password'
                  }
                  id="password"
                  onChange={updateField('password')}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={form.password}
                />
              </div>

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading
                  ? 'Please wait...'
                  : isRegisterMode
                    ? 'Create account'
                    : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
