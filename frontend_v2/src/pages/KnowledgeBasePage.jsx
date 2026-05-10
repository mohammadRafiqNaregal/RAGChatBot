import { NavLink, Outlet } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { CardTitle } from '@/components/ui/card';

const subNavClass = ({ isActive }) =>
  [
    'rounded-md px-3 py-1.5 text-sm font-medium transition',
    isActive
      ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
      : 'text-muted-foreground hover:bg-background/70 hover:text-foreground',
  ].join(' ');

export default function KnowledgeBasePage() {
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 pt-6">
        <div className="space-y-2">
          <Badge variant="secondary">Admin Only</Badge>
          <CardTitle>Knowledge Base</CardTitle>
        </div>
        <nav className="flex flex-wrap items-center gap-1 rounded-xl border border-border/70 bg-muted/40 p-1">
          <NavLink className={subNavClass} to="upload">
            Upload Documents
          </NavLink>
          <NavLink className={subNavClass} to="documents">
            Documents List
          </NavLink>
        </nav>
      </div>
      <Outlet />
    </div>
  );
}
