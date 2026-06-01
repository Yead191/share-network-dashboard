import React, { useState } from 'react';
import { useInternshipStore } from '../../../hooks/useInternshipStore';
import { InternshipListPage } from './components/InternshipListPage';
import { InternshipFormPage } from './components/InternshipFormPage';
import { InternshipDetailDrawer } from './components/InternshipDetailDrawer';
import { useGetprofileQuery } from '../../../redux/apiSlices/students/overview.slice';
import { InternshipFormValues, InternshipRecord } from '../../../types/internship.types';

type View = 'list' | 'create' | 'edit';

const InternshipPage: React.FC = () => {
  // ─── Auth / Role ─────────────────────────────────────────────────────────
  const { data, isLoading: profileLoading } = useGetprofileQuery({});
  const user = data?.data?.data ?? data?.data ?? data;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // ─── Store ────────────────────────────────────────────────────────────────
  const { records, loading, createInternship, updateInternship, deleteInternship } =
    useInternshipStore();

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
    await deleteInternship(id);
  };

  const handleSubmit = async (
    values: InternshipFormValues,
    studentName: string,
    studentAvatar?: string
  ) => {
    setSubmitting(true);
    try {
      if (view === 'create') {
        await createInternship(values, studentName, studentAvatar);
      } else if (view === 'edit' && editingRecord) {
        await updateInternship(editingRecord.id, values);
      }
      setView('list');
      setEditingRecord(null);
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
        loading={loading || profileLoading}
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
