import React from 'react'
import { Input } from '@/components/ui/input';
import { Select, SelectContent,SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
type CampaignFiltersProps = {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
};
export default function CampaignFilters({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortOrder,
  setSortOrder
}: CampaignFiltersProps) {


  return (
    <div className='flex flex-col md:flex-row gap-4 mb-8'>
      <div className='relative flex-1'>
        <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
        <Input 
            placeholder='Search campaigns by title or description...'
            className='pl-10 w-full'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        {/* Status Filter */}
      <Select
        value={statusFilter}
        onValueChange={(value) => setStatusFilter(value)}
        >
        <SelectTrigger className='w-full md:w-[180px]'>
            <SelectValue placeholder='Filter by status' />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="ongoing">Ongoing</SelectItem>
            <SelectItem value="successful">Successful</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
        </SelectContent>
      </Select>
        {/* Category Filter */}
      <Select
        value={sortOrder}
        onValueChange={(value) => setSortOrder(value)}
        >
        <SelectTrigger className='w-full md:w-[180px]'>
            <SelectValue placeholder='Filter by category' />
        </SelectTrigger>
        <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="ending_soon">Ending Soon</SelectItem>
            <SelectItem value="most_funded">Most Funded</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
