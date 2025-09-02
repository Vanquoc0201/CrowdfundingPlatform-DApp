"use client"

import { useCampaigns } from '@/hooks/useCampaigns'
import { CampaignCard } from '@/components/custom/campaign/CampaignCard'
import { Skeleton } from '@/components/ui/skeleton'
import CampaignFilters from '@/components/custom/campaigns-list/CampaignFilters'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Frown, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useMemo } from 'react'

export default function CampaignsPage() {
  const { data: campaigns = [], isLoading, isError, error } = useCampaigns()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<string>("newest")

  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = [...campaigns]

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      const targetStatus = statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)
      filtered = filtered.filter((c) => c.status === targetStatus)
    }

    switch (sortOrder) {
      case "newest":
        filtered.sort((a, b) => Number(b.deadline - a.deadline))
        break
      case "ending_soon":
        filtered.sort((a, b) => Number(a.deadline - b.deadline))
        break
      case "most_funded":
        filtered.sort((a, b) => Number(b.totalRaised - a.totalRaised))
        break
    }

    return filtered
  }, [campaigns, searchTerm, statusFilter, sortOrder])

  return (
    <section className='container py-16 md:py-20'>
      <h1 className='text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-12'>
        Explore Campaigns
      </h1>

      <CampaignFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />

      {isLoading && (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-80 w-full' />
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive" className='mt-8'>
          <Frown className='h-4 w-4' />
          <AlertTitle>Error fetching campaigns!</AlertTitle>
          <AlertDescription>
            {error instanceof Error ? error.message : "Unknown error"}. Please ensure your wallet is connected to the correct network and try again
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && filteredAndSortedCampaigns.length === 0 && (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground mb-4">
            No campaigns found matching your criteria.
          </p>
          <Button asChild size="lg">
            <Link href="/create">
              <PlusCircle className="mr-2 h-5 w-5" /> Be the first to launch a campaign!
            </Link>
          </Button>
        </div>
      )}

      {!isLoading && !isError && filteredAndSortedCampaigns.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredAndSortedCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      )}
    </section>
  )
}
