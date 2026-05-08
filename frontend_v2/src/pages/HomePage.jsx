import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function HomePage() {
  const roles = ['Admin', 'HR User', 'Finance User', 'IT User', 'Employee'];
  const departments = ['HR', 'Finance', 'IT'];

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">MVP</Badge>
            <Badge variant="outline">Phase 1</Badge>
          </div>
          <CardTitle>Enterprise AI Knowledge Assistant</CardTitle>
          <CardDescription>
            Internal AI assistant for secure document upload, permission-aware
            retrieval, and chatbot answers grounded in uploaded enterprise
            knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 lg:grid-cols-3">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Project objective</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Deliver a demo-ready MVP in one month with secure login, document
              ingestion, semantic search, and role-safe AI responses.
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>User roles</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {roles.map((role) => (
                <Badge key={role} variant="outline">
                  {role}
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Initial departments</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {departments.map((department) => (
                <Badge key={department} variant="secondary">
                  {department}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      <Card className="border-border/60 shadow-sm">
        <CardHeader>
          <CardTitle>Phase 1 capabilities</CardTitle>
          <CardDescription>
            Core scope included in this implementation
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
          <div className="rounded-lg bg-muted/30 p-3">
            Secure authentication with JWT and role-based access control
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            Admin upload of PDF, DOCX, and TXT with metadata and allowed roles
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            Document parsing, chunking, embedding generation, and vector search
          </div>
          <div className="rounded-lg bg-muted/30 p-3">
            Chatbot answers from permitted documents only, with basic chat
            logging
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default HomePage;
