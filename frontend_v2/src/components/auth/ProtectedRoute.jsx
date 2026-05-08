import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to="/auth" />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] w-full max-w-3xl items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Access denied</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertTitle>Unauthorized</AlertTitle>
              <AlertDescription>
                This page is restricted to users with the {requiredRole} role.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  return children;
}
