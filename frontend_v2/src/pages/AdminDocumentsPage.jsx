import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { deleteDocument } from '@/features/documents/documentsSlice';

export default function AdminDocumentsPage() {
  const dispatch = useDispatch();
  const documents = useSelector((state) => state.documents.items);

  const rows = useMemo(
    () =>
      [...documents].sort((a, b) => {
        const aTime = new Date(a.createdAt || a.uploadedAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.uploadedAt || 0).getTime();
        return bTime - aTime;
      }),
    [documents],
  );

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary">Admin Only</Badge>
              <CardTitle>Uploaded Documents</CardTitle>
              <CardDescription>
                View all uploaded documents with metadata and allowed role
                access.
              </CardDescription>
            </div>
            <Badge variant="outline">Total: {rows.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {rows.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border">
              <table className="w-full min-w-245 text-sm">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Title</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left font-medium">Section</th>
                    <th className="px-4 py-3 text-left font-medium">Tags</th>
                    <th className="px-4 py-3 text-left font-medium">
                      Allowed Roles
                    </th>
                    <th className="px-4 py-3 text-left font-medium">File</th>
                    <th className="px-4 py-3 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((doc) => (
                    <tr key={doc.id} className="border-t align-top">
                      <td className="px-4 py-3 font-medium">
                        {doc.title || '-'}
                      </td>
                      <td className="px-4 py-3">{doc.department || '-'}</td>
                      <td className="px-4 py-3">{doc.section || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(doc.tags || []).length > 0
                            ? doc.tags.map((tag) => (
                                <Badge
                                  key={`${doc.id}-${tag}`}
                                  variant="outline"
                                >
                                  {tag}
                                </Badge>
                              ))
                            : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {(doc.allowedRoles || []).length > 0
                            ? doc.allowedRoles.map((role) => (
                                <Badge
                                  key={`${doc.id}-${role}`}
                                  variant="secondary"
                                >
                                  {role}
                                </Badge>
                              ))
                            : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {doc.fileName || doc.filename || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button size="sm" type="button" variant="outline">
                            Edit (soon)
                          </Button>
                          <Button
                            size="sm"
                            type="button"
                            variant="destructive"
                            onClick={() => dispatch(deleteDocument(doc.id))}
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
