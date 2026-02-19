import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import { Filter, Loader2, type LucideIcon, Settings2 } from 'lucide-react';
import { type ReactNode, useCallback, useRef } from 'react';
import {
  Button,
  CardContent,
  CardDescription,
  CardTitle,
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import { EmptyState } from './empty-state';
import { LoadingState } from './loading-state';

type ColumnOption = {
  id: string;
  label: string;
};

type DataTableViewProps<TData> = {
  title: string;
  description: string;
  columns: ColumnDef<TData, unknown>[];
  columnOptions?: ColumnOption[];
  columnVisibility?: VisibilityState;
  onColumnVisibilityChange?: (updater: (prev: VisibilityState) => VisibilityState) => void;

  items: TData[];
  total: number;
  fetching: boolean;
  isFetchingMore: boolean;
  error: unknown;
  hasNextPage: boolean;
  onFetchNextPage: () => void;
  onRowClick?: (item: TData) => void;

  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDescription: string;

  filters?: ReactNode;
  headerActions?: ReactNode;
};

const ColumnVisibilityDropdown = ({
  options,
  visibility,
  onChange,
}: {
  options: ColumnOption[];
  visibility: VisibilityState;
  onChange: (updater: (prev: VisibilityState) => VisibilityState) => void;
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="icon" className="shrink-0">
        <Settings2 className="size-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuLabel>Columns</DropdownMenuLabel>
      <DropdownMenuSeparator />
      {options.map((column) => (
        <DropdownMenuCheckboxItem
          key={column.id}
          checked={visibility[column.id] !== false}
          onCheckedChange={(checked) => onChange((prev) => ({ ...prev, [column.id]: checked }))}
        >
          {column.label}
        </DropdownMenuCheckboxItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export const DataTableView = <TData,>({
  title,
  description,
  columns,
  columnOptions,
  columnVisibility,
  onColumnVisibilityChange,
  items,
  total,
  fetching,
  isFetchingMore,
  error,
  hasNextPage,
  onFetchNextPage,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  filters,
  headerActions,
  onRowClick,
}: DataTableViewProps<TData>) => {
  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { columnVisibility },
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  const onFetchNextPageRef = useRef(onFetchNextPage);
  onFetchNextPageRef.current = onFetchNextPage;

  const hasNextPageRef = useRef(hasNextPage);
  hasNextPageRef.current = hasNextPage;

  const isFetchingMoreRef = useRef(isFetchingMore);
  isFetchingMoreRef.current = isFetchingMore;

  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPageRef.current && !isFetchingMoreRef.current) {
          onFetchNextPageRef.current();
        }
      },
      { root: scrollContainer, rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const isInitialLoading = fetching && items.length === 0;
  const hasData = items.length > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="bg-card text-card-foreground rounded-xl border shadow-sm flex min-h-0 flex-1 flex-col overflow-hidden pt-6">
        <div className="grid auto-rows-min grid-rows-[auto_auto] items-start px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] border-b pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="mb-2">{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {headerActions}
              {filters && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="shrink-0">
                      <Filter className="size-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-auto">
                    {filters}
                  </PopoverContent>
                </Popover>
              )}
              {columnOptions && columnVisibility && onColumnVisibilityChange && (
                <ColumnVisibilityDropdown
                  options={columnOptions}
                  visibility={columnVisibility}
                  onChange={onColumnVisibilityChange}
                />
              )}
            </div>
          </div>
        </div>
        <CardContent ref={scrollRef} className="min-h-0 flex-1 overflow-auto scrollbar-none p-0">
          {isInitialLoading && <LoadingState />}
          {!isInitialLoading && !!error && !hasData && (
            <div className="py-8 text-center text-destructive text-sm">
              Failed to load data. Please try again.
            </div>
          )}
          {!isInitialLoading && !error && !hasData && (
            <EmptyState icon={emptyIcon} title={emptyTitle} description={emptyDescription} />
          )}
          {hasData && (
            <>
              <table className="w-full caption-bottom text-sm">
                <TableHeader className="sticky top-0 z-10 bg-card">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="font-bold first:pl-6 last:pr-6">
                          {header.isPlaceholder
                            ? null
                            : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      className={onRowClick ? 'cursor-pointer' : undefined}
                      onClick={() => onRowClick?.(row.original)}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="first:pl-6 last:pr-6">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </table>
              <div ref={sentinelRef} className="h-1" />
              {isFetchingMore && (
                <div className="flex justify-center py-4">
                  <Loader2 className="size-5 animate-spin text-muted-foreground" />
                </div>
              )}
            </>
          )}
        </CardContent>

        {hasData && (
          <div className="border-t px-3 py-2 text-sm text-muted-foreground">
            Showing {items.length} of {total}
          </div>
        )}
      </div>
    </div>
  );
};
