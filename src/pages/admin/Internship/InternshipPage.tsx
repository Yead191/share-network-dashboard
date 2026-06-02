import React, { useState } from 'react';
import { InternshipListPage } from './components/InternshipListPage';
import { InternshipFormPage } from './components/InternshipFormPage';
import { InternshipDetailDrawer } from './components/InternshipDetailDrawer';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import { InternshipRecord } from '../../../types/internship.types';
import {
  useGetAllInternshipsQuery,
  useCreateInternshipMutation,
  useUpdateInternshipMutation,
  useDeleteInternshipMutation,
} from '../../../redux/apiSlices/admin/adminInternshipApi';
import { toast } from 'sonner';

type View = 'list' | 'create' | 'edit';

const InternshipPage: React.FC = () => {
  // ─── Auth / Role ─────────────────────────────────────────────────────────
  const { data, isLoading: profileLoading } = useGetprofileQuery({});
  const user = data?.data?.data ?? data?.data ?? data;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // ─── RTK Query ────────────────────────────────────────────────────────────
  const { data: internshipsResponse, isLoading: fetchLoading, refetch } =
    useGetAllInternshipsQuery({ page: 1, limit: 100, searchTerm: '' });

  const [createInternship] = useCreateInternshipMutation();
  const [updateInternship] = useUpdateInternshipMutation();
  const [deleteInternship] = useDeleteInternshipMutation();

  const rawRecords = internshipsResponse?.data || [];
  const records: InternshipRecord[] = rawRecords.map((item: any) => ({
    ...item,
    id: item._id || item.id,
  }));

  // ─── UI State ─────────────────────────────────────────────────────────────
  const [view, setView] = useState<View>('list');
  const [editingRecord, setEditingRecord] = useState<InternshipRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<InternshipRecord | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // ─── Handlers ─────────────────────────────────────────────────────────────
  const handleCreate = () => {
    if (!isAdmin) return;
    setEditingRecord(null);
    setView('create');
  };

  const handleEdit = (record: InternshipRecord) => {
    if (!isAdmin) return;
    setEditingRecord(record);
    setView('edit');
  };

  const handleView = (record: InternshipRecord) => {
    setViewingRecord(record);
    setDrawerOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    try {
      await deleteInternship({ id }).unwrap();
      refetch();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitting(true);
    try {
      if (view === 'create') {
        toast.promise(createInternship(formData).unwrap(), {
          loading: "Creating internship...",
          success: (res) => {
            refetch();
            setView('list');
            setEditingRecord(null);
            return res?.message || "Internship created successfully!";
          },
          error: (err) => {
            return err?.message || "Failed to create internship!";
          },
        })
      } else if (view === 'edit' && editingRecord) {
        toast.promise(updateInternship({ id: editingRecord.id || editingRecord._id || '', data: formData }).unwrap(), {
          loading: "Updating internship...",
          success: (res) => {
            refetch();
            setView('list');
            setEditingRecord(null);
            return res?.message || "Internship updated successfully!";
          },
          error: "Failed to update internship!",
        })
      }
    } catch (err) {
      console.error('Submit failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    setView('list');
    setEditingRecord(null);
  };

  const handleDrawerEdit = () => {
    if (viewingRecord && isAdmin) {
      setDrawerOpen(false);
      handleEdit(viewingRecord);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (view === 'create' || view === 'edit') {
    return (
      <InternshipFormPage
        mode={view}
        initialData={editingRecord ?? undefined}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitting={submitting}
      />
    );
  }

  return (
    <>
      <InternshipListPage
        records={records}
        isAdmin={isAdmin}
        loading={fetchLoading || profileLoading}
        onCreateNew={handleCreate}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
      />

      <InternshipDetailDrawer
        record={viewingRecord}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onEdit={handleDrawerEdit}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default InternshipPage;
