import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Route, Routes } from 'react-router-dom';
import { SparklesIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { logout } from './features/auth/authSlice';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RAGChatBot from './pages/RAGChatBot';
import AuthPage from './pages/AuthPage';
import AdminUploadPage from './pages/AdminUploadPage';
import AdminDocumentsPage from './pages/AdminDocumentsPage';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = user?.role === 'Admin';

  const navLinkClass = ({ isActive }) =>
    [
      'rounded-md px-3 py-1.5 text-sm font-medium color-black/80 transition',
      isActive
        ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
        : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
    ].join(' ');

  return (
    <div className="app-shell">
      <header className="topbar sticky top-0 z-30 border-b border-border/70 bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/70">
        <div className="mx-auto flex w-full flex-wrap items-center justify-between gap-3 px-1">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/10 p-1.5 text-primary">
              <SparklesIcon className="size-4" />
            </div>
            <h1 className="text-base font-semibold tracking-tight">
              RAG Chat Bot Services
            </h1>
          </div>

          <nav className="flex flex-wrap items-center gap-1 rounded-xl border border-border/70 bg-muted/40 p-1">
            <NavLink className={navLinkClass} to="/" end>
              Home
            </NavLink>
            {/* {isAuthenticated ? ( */}
            <NavLink className={navLinkClass} to="/chat">
              Chat
            </NavLink>
            {/* ) : null} */}
            {/* {isAdmin ? ( */}
            <NavLink className={navLinkClass} to="/admin/upload">
              Upload Docs
            </NavLink>
            {/* ) : null} */}
            {/* {isAdmin ? ( */}
            <NavLink className={navLinkClass} to="/admin/documents">
              View Docs
            </NavLink>
            {/* ) : null} */}
            <NavLink className={navLinkClass} to="/about">
              About
            </NavLink>
            {!isAuthenticated ? (
              <NavLink className={navLinkClass} to="/auth">
                Login
              </NavLink>
            ) : null}
          </nav>

          <div className="flex items-center gap-2">
            {/* {user ? ( */}
            <Badge variant="outline">
              {user?.username} ({user?.role}){' '}
              {user?.username ? user?.username : 'Guest'}
            </Badge>
            {/* ) : null} */}
            {/* {isAuthenticated ? ( */}
            <Button
              onClick={() => dispatch(logout())}
              size="sm"
              type="button"
              variant="outline"
            >
              Logout
            </Button>
            {/* ) : null} */}
          </div>
        </div>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route
            path="/chat"
            element={
              // <ProtectedRoute>
              <RAGChatBot />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin/upload"
            element={
              // <ProtectedRoute requiredRole="Admin">
              <AdminUploadPage />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/admin/documents"
            element={
              // <ProtectedRoute requiredRole="Admin">
              <AdminDocumentsPage />
              // </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
