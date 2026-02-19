import type { ColumnDef } from '@tanstack/react-table';
import { Info } from 'lucide-react';
import { useMemo } from 'react';
import { DataTableView } from '@/components/common/data-table';
import { CopyTextButton } from '@/components/common/value/copy-text-button';
import { config } from '@/lib/constants';

type ConfigEntry = {
  name: string;
  value: string;
};

const columns: ColumnDef<ConfigEntry, unknown>[] = [
  { accessorKey: 'name', header: 'Name' },
  {
    accessorKey: 'value',
    header: 'Value',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <span className="truncate">{row.original.value}</span>
        <CopyTextButton value={row.original.value} />
      </div>
    ),
  },
];

export const BuildInfoCard = () => {
  const items = useMemo(
    () =>
      Object.entries(config).map(([name, value]) => ({
        name,
        value: value == null ? 'null' : String(value),
      })),
    []
  );

  return (
    <DataTableView
      title="Build Info"
      description="Application configuration and build constants"
      columns={columns}
      items={items}
      total={items.length}
      fetching={false}
      isFetchingMore={false}
      error={null}
      hasNextPage={false}
      onFetchNextPage={() => {}}
      emptyIcon={Info}
      emptyTitle="No configuration"
      emptyDescription="No configuration entries found"
    />
  );
};
