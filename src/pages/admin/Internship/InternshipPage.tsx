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
  useGetInternshipStatsQuery,
} from '../../../redux/apiSlices/admin/adminInternshipApi';
import { toast } from 'sonner';
import { useDebounce } from '../../../hooks/useDebounce';

type View = 'list' | 'create' | 'edit';

const InternshipPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
  // ─── Auth / Role ─────────────────────────────────────────────────────────
  const { data, isLoading: profileLoading } = useGetprofileQuery({});
  const user = data?.data?.data ?? data?.data ?? data;
  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';

  // ─── RTK Query ────────────────────────────────────────────────────────────
  const debouncedSearch = useDebounce(search, 500);
  const { data: internshipsResponse, isLoading: fetchLoading, refetch } =
    useGetAllInternshipsQuery({ page: page, limit: 10, searchTerm: debouncedSearch, sortBy, sortOrder });
  const { data: internshipStatsRes, isLoading: statsLoading, refetch: statsRefetch } = useGetInternshipStatsQuery({});
  // console.log(internshipStatsRes)

  const [createInternship] = useCreateInternshipMutation();
  const [updateInternship] = useUpdateInternshipMutation();
  const [deleteInternship] = useDeleteInternshipMutation();

  const rawRecords = internshipsResponse?.data || [];
  const records: InternshipRecord[] = rawRecords.map((item: any) => ({
    ...item,
    id: item._id || item.id,
  }));
  const pagination = internshipsResponse?.pagination
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
      toast.promise(deleteInternship({ id }).unwrap(), {
        loading: "Deleting internship profile...",
        success: (res) => {
          refetch();
          return res?.message || "Internship profile deleted successfully!";
        },
        error: (err) => {
          return err?.message || "Failed to delete internship profile!";
        },
      });
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
            statsRefetch()
            setView('list');
            setEditingRecord(null);
            return res?.message || "Internship created successfully!";

          },
          error: (err) => {
            // console.log(err)
            // Enhanced error handling for validation errors
            // if (err?.data?.errorMessages?.length > 0) {
            //   const errorList = err.data.errorMessages
            //     .map((e: any) => e.message)
            //     .join("\n");

            //   return `${err.data.message || "Validation Error"}\n${errorList}`;
            // }

            if (err?.data?.message) {
              return err.data.message;
            }

            return "Failed to create internship!";
          },
        });
      }
      else if (view === 'edit' && editingRecord) {
        toast.promise(updateInternship({
          id: editingRecord.id || editingRecord._id || '',
          data: formData
        }).unwrap(), {
          loading: "Updating internship...",
          success: (res) => {
            statsRefetch()
            refetch();
            setView('list');
            setEditingRecord(null);
            return res?.message || "Internship updated successfully!";

          },
          error: (err) => {
            if (err?.errorMessages?.length > 0) {
              const errorList = err.errorMessages
                .map((e: any) => e.message)
                .join("\n");

              return `${err.message || "Validation Error"}\n${errorList}`;
            }

            if (err?.message) {
              return err.message;
            }

            // return "Failed to update internship!";
          },
        });
      }
    } catch (err) {
      console.error('Submit failed:', err);
      toast.error("An unexpected error occurred");
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
        setPage={setPage}
        setSearch={setSearch}
        search={search}
        records={records}
        isAdmin={isAdmin}
        loading={fetchLoading || profileLoading || statsLoading}
        onCreateNew={handleCreate}
        onEdit={handleEdit}
        onView={handleView}
        onDelete={handleDelete}
        stats={internshipStatsRes?.data}
        pagination={pagination}
        sortBy={sortBy}
        sortOrder={sortOrder}
        setSortBy={setSortBy}
        setSortOrder={setSortOrder}
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
