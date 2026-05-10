import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { clearAuthError, loginUser } from '@/features/auth/authSlice';

const initialForm = {
  username: '',
  password: '',
};

export default function AuthPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, isAuthenticated, isLoading, user } = useSelector(
    (state) => state.auth,
  );
  const [form, setForm] = useState(initialForm);

  const redirectPath = useMemo(
    () => location.state?.from || '/chat',
    [location.state],
  );

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
            <div className="flex w-full flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">Admin Portal</Badge>
                {user ? <Badge variant="outline">{user.username}</Badge> : null}
              </div>
              <div className="space-y-1">
                <CardTitle>Login to continue</CardTitle>
                <CardDescription>
                  User accounts are created by administrators. Sign in with your
                  assigned username and initial password.
                </CardDescription>
              </div>
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

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  autoComplete="current-password"
                  id="password"
                  onChange={updateField('password')}
                  placeholder="Enter your password"
                  required
                  type="password"
                  value={form.password}
                />
              </div>

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? 'Please wait...' : 'Login'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
