import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  deleteDocument,
  fetchDocuments,
} from '@/features/documents/documentsSlice';

export default function AdminDocumentsPage() {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.auth.user?.role);
  const canDeleteDocuments = userRole === 'Admin';
  const {
    items: documents,
    isLoading,
    loadError,
    deletingId,
    deleteError,
  } = useSelector((state) => state.documents);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const rows = useMemo(
    () =>
      [...documents].sort((a, b) => {
        const aTime = new Date(a.createdAt || a.uploadedAt || 0).getTime();
        const bTime = new Date(b.createdAt || b.uploadedAt || 0).getTime();
        return bTime - aTime;
      }),
    [documents],
  );

  const askDeleteConfirmation = (doc) => {
    if (!canDeleteDocuments) {
      return;
    }

    setSelectedDoc(doc);
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDoc) {
      return;
    }

    if (!canDeleteDocuments) {
      return;
    }

    const result = await dispatch(deleteDocument(selectedDoc.id));

    if (deleteDocument.fulfilled.match(result)) {
      setConfirmOpen(false);
      setSelectedDoc(null);
    }
  };

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
          {loadError ? (
            <Alert className="mb-4" variant="destructive">
              <AlertTitle>Could not load documents</AlertTitle>
              <AlertDescription>{loadError}</AlertDescription>
            </Alert>
          ) : null}

          {deleteError ? (
            <Alert className="mb-4" variant="destructive">
              <AlertTitle>Delete failed</AlertTitle>
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              Loading documents...
            </div>
          ) : null}

          {!isLoading && rows.length === 0 ? (
            <div className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
              No documents uploaded yet.
            </div>
          ) : null}

          {!isLoading && rows.length > 0 ? (
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
                          {(doc.allowedRoles || doc.allowed_roles || [])
                            .length > 0
                            ? (doc.allowedRoles || doc.allowed_roles || []).map(
                                (role) => (
                                  <Badge
                                    key={`${doc.id}-${role}`}
                                    variant="secondary"
                                  >
                                    {role}
                                  </Badge>
                                ),
                              )
                            : '-'}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {doc.fileName || doc.filename || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            type="button"
                            variant="destructive"
                            onClick={() => askDeleteConfirmation(doc)}
                            disabled={
                              deletingId === doc.id || !canDeleteDocuments
                            }
                          >
                            {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this document?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently remove
              {selectedDoc?.title
                ? ` "${selectedDoc.title}"`
                : ' this document'}
              . This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="button"
              variant="destructive"
              onClick={confirmDelete}
              disabled={
                !selectedDoc ||
                deletingId === selectedDoc.id ||
                !canDeleteDocuments
              }
            >
              {deletingId === selectedDoc?.id ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
