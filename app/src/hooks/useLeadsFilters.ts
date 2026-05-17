import { useEffect, useMemo, useState } from 'react';

import type { LeadFilters, LeadSource, LeadStatus } from '@/types/lead';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

export function useLeadsFilters() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<LeadStatus | ''>('');
  const [source, setSource] = useState<LeadSource | ''>('');
  const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    setPage(1);
  }, [status, source, sort, debouncedSearch]);

  const filters: LeadFilters = useMemo(
    () => ({
      status: status || undefined,
      source: source || undefined,
      search: debouncedSearch || undefined,
      sort,
      page
    }),
    [status, source, debouncedSearch, sort, page]
  );

  const resetFilters = () => {
    setSearch('');
    setStatus('');
    setSource('');
    setSort('latest');
    setPage(1);
  };

  return {
    search,
    setSearch,
    status,
    setStatus,
    source,
    setSource,
    sort,
    setSort,
    page,
    setPage,
    filters,
    resetFilters
  };
}
