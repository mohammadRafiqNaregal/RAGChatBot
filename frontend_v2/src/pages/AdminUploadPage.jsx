import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  clearUploadState,
  DOCUMENT_DEPARTMENT_OPTIONS,
  DOCUMENT_ROLE_OPTIONS,
  uploadDocument,
} from '@/features/documents/documentsSlice';

const initialForm = {
  title: '',
  department: 'HR',
  section: '',
  tags: '',
};

export default function AdminUploadPage() {
  const dispatch = useDispatch();
  const { isUploading, uploadError, lastUploaded } = useSelector(
    (state) => state.documents,
  );
  const [file, setFile] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [allowedRoles, setAllowedRoles] = useState(['Employee']);

  const parsedTags = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags],
  );

  const toggleRole = (role) => {
    setAllowedRoles((current) =>
      current.includes(role)
        ? current.filter((item) => item !== role)
        : [...current, role],
    );
  };

  const updateField = (field) => (event) => {
    setForm((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const resetForm = () => {
    setFile(null);
    setForm(initialForm);
    setAllowedRoles(['Employee']);
    dispatch(clearUploadState());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || allowedRoles.length === 0) {
      return;
    }

    const result = await dispatch(
      uploadDocument({
        id: crypto.randomUUID(),
        file,
        fileName: file.name,
        fileType: file.type,
        uploadedAt: new Date().toISOString(),
        title: form.title,
        department: form.department,
        section: form.section,
        tags: parsedTags,
        allowedRoles,
      }),
    );

    if (uploadDocument.fulfilled.match(result)) {
      resetForm();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8">
      <Card className="border-border/60 shadow-sm">
        <CardHeader className="border-b">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <Badge variant="secondary">Admin Only</Badge>
              <CardTitle>Upload knowledge documents</CardTitle>
              <CardDescription>
                Admin users can upload PDF, DOCX, and TXT files and control
                access with metadata and role restrictions.
              </CardDescription>
            </div>
            <div className="grid gap-2 rounded-xl border bg-muted/30 p-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">
                  Supported files:
                </span>{' '}
                PDF, DOCX, TXT
              </p>
              <p>
                <span className="font-medium text-foreground">Metadata:</span>{' '}
                title, department, section, tags, allowed roles
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {uploadError ? (
              <Alert variant="destructive">
                <AlertTitle>Upload failed</AlertTitle>
                <AlertDescription>{uploadError}</AlertDescription>
              </Alert>
            ) : null}

            {lastUploaded ? (
              <Alert>
                <AlertTitle>Upload successful</AlertTitle>
                <AlertDescription>
                  {lastUploaded.title || form.title} has been uploaded
                  successfully.
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="document-file">Document file</Label>
                <Input
                  accept=".pdf,.doc,.docx,.txt"
                  id="document-file"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  required
                  type="file"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="document-title">Title</Label>
                <Input
                  id="document-title"
                  onChange={updateField('title')}
                  placeholder="Employee handbook"
                  required
                  value={form.title}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  onValueChange={(value) =>
                    setForm((current) => ({ ...current, department: value }))
                  }
                  value={form.department}
                >
                  <SelectTrigger className="w-full" id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_DEPARTMENT_OPTIONS.map((department) => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section</Label>
                <Input
                  id="section"
                  onChange={updateField('section')}
                  placeholder="Policies / Security / Onboarding"
                  required
                  value={form.section}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                onChange={updateField('tags')}
                placeholder="policy, handbook, onboarding"
                value={form.tags}
              />
              <p className="text-xs text-muted-foreground">
                Use commas to separate tags.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Allowed Roles</Label>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {DOCUMENT_ROLE_OPTIONS.map((role) => (
                  <label
                    key={role}
                    className="flex items-center gap-3 rounded-xl border p-3 text-sm capitalize"
                  >
                    <Checkbox
                      checked={allowedRoles.includes(role)}
                      onCheckedChange={() => toggleRole(role)}
                    />
                    <span>{role}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button onClick={resetForm} type="button" variant="outline">
                Reset
              </Button>
              <Button
                disabled={
                  isUploading ||
                  !file ||
                  !form.title ||
                  !form.section ||
                  allowedRoles.length === 0
                }
                type="submit"
              >
                {isUploading ? 'Uploading...' : 'Upload document'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
