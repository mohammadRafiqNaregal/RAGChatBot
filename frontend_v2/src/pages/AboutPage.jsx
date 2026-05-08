import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const inScope = [
  'Secure login with JWT and role-based access control',
  'Admin upload with metadata and allowed role restrictions',
  'Document extraction, chunking, embeddings, and semantic search',
  'Role-aware chatbot answers sourced from uploaded docs only',
  'Document listing page and basic chat history logging',
];

const outOfScope = [
  'OCR for scanned files',
  'Voice chatbot and multilingual support',
  'Cloud deployment, Docker, and Kubernetes',
  'Analytics dashboards and external integrations',
  'Advanced memory, multi-tenant, and approval workflows',
];

const techStack = [
  ['Language', 'Python'],
  ['Backend', 'FastAPI'],
  ['Authentication', 'JWT'],
  ['Database', 'SQLite + SQLAlchemy'],
  ['RAG Stack', 'LangChain + FAISS'],
  ['Embeddings', 'OpenAI or HuggingFace'],
  ['Parsing', 'PyPDF2 and python-docx'],
  ['Frontend', 'React UI'],
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Phase 1</Badge>
            <Badge variant="outline">Enterprise AI Knowledge Assistant</Badge>
          </div>
          <CardTitle>Project scope and architecture</CardTitle>
          <CardDescription>
            This MVP focuses on secure access, admin-managed documents, and
            role-aware AI responses over internal knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 pt-6 lg:grid-cols-2">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Included in Phase 1</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {inScope.map((item) => (
                  <li key={item} className="rounded-md bg-muted/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle>Out of scope</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {outOfScope.map((item) => (
                  <li key={item} className="rounded-md bg-muted/30 px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-border/60 lg:col-span-2">
            <CardHeader>
              <CardTitle>Core tech stack</CardTitle>
              <CardDescription>Phase 1 implementation baseline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto rounded-xl border">
                <table className="w-full min-w-140 text-sm">
                  <thead className="bg-muted/40">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium">Layer</th>
                      <th className="px-4 py-3 text-left font-medium">
                        Technology
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {techStack.map(([layer, value]) => (
                      <tr key={layer} className="border-t">
                        <td className="px-4 py-3 font-medium">{layer}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}
