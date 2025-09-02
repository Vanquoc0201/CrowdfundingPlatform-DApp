"use client";

import * as React from "react";
import { Abi, Address, formatEther, parseEther } from "viem";
import { CampaignData, RequestData } from "@/types/campaign";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CircleCheck, HandCoins, Loader2, Frown, Plus } from "lucide-react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContracts } from "wagmi";
import campaignabi from "@/abis/Campaign.json";
import { mapRequest } from "@/lib/mappers";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type RequestRawResult = [string, bigint, Address, bigint, boolean];

interface FundRequestsSectionProps {
  campaign: CampaignData;
}

export function FundRequestsSection({ campaign }: FundRequestsSectionProps) {
  const { address: userAddress, isConnected } = useAccount();

  const requestReadConfigs = React.useMemo(() => {
    if (!campaign || campaign.requestCount === BigInt(0)) return [];
    return Array.from({ length: Number(campaign.requestCount) }, (_, i) => ({
      address: campaign.id,
      abi: campaignabi.abi as Abi,
      functionName: "getRequest",
      args: [BigInt(i)],
    }));
  }, [campaign]);

  const { data: rawRequestsData, isLoading: requestsLoading, error: requestsError, refetch: refetchRequests } =
    useReadContracts({
      contracts: requestReadConfigs,
      query: { enabled: requestReadConfigs.length > 0 },
    });

  // ---- Fetch hasApproved ----
  const hasApprovedReadConfigs = React.useMemo(() => {
    if (!campaign || campaign.requestCount === BigInt(0) || !userAddress) return [];
    return Array.from({ length: Number(campaign.requestCount) }, (_, i) => ({
      address: campaign.id,
      abi: campaignabi.abi as Abi,
      functionName: "hasApproved",
      args: [BigInt(i), userAddress],
    }));
  }, [campaign, userAddress]);

  const { data: hasApprovedData, isLoading: hasApprovedLoading, error: hasApprovedError, refetch: refetchHasApproved } =
    useReadContracts({
      contracts: hasApprovedReadConfigs,
      query: { enabled: hasApprovedReadConfigs.length > 0 },
    });

  // ---- Map dữ liệu ----
  const requests: RequestData[] = React.useMemo(() => {
    if (!rawRequestsData || !hasApprovedData) return [];
    return rawRequestsData
      .map((res, i) => {
        if (res.status === "failure" || !res.result) return null;
        const raw = res.result as RequestRawResult;
        const hasApproved = hasApprovedData[i]?.status === "success" ? (hasApprovedData[i]?.result as boolean) : false;
        return mapRequest(raw, i, campaign.totalRaised, hasApproved);
      })
      .filter(Boolean) as RequestData[];
  }, [rawRequestsData, hasApprovedData, campaign]);

  // ---- Hooks cho approve / finalize / create ----
  const { writeContract: approveWrite, data: approveHash, isPending: isApproving, error: approveError } = useWriteContract();
  const { isLoading: isApproveConfirming, isSuccess: isApproveConfirmed, error: approveConfirmError } =
    useWaitForTransactionReceipt({ hash: approveHash });

  const { writeContract: finalizeWrite, data: finalizeHash, isPending: isFinalizing, error: finalizeError } = useWriteContract();
  const { isLoading: isFinalizeConfirming, isSuccess: isFinalizeConfirmed, error: finalizeConfirmError } =
    useWaitForTransactionReceipt({ hash: finalizeHash });

  const { writeContract: createRequestWrite, data: createRequestHash, isPending: isCreatingRequest, error: createRequestError } =
    useWriteContract();
  const { isLoading: isCreateRequestConfirming, isSuccess: isCreateRequestConfirmed, error: createRequestConfirmError } =
    useWaitForTransactionReceipt({ hash: createRequestHash });

  // ---- Handlers ----
  const handleApproveRequest = (id: number) => {
    if (!isConnected) return toast.error("Connect wallet to approve");
    approveWrite({ address: campaign.id, abi: campaignabi.abi, functionName: "approveRequest", args: [BigInt(id)] });
  };

  const handleFinalizeRequest = (id: number) => {
    if (!isConnected) return toast.error("Connect wallet to finalize");
    finalizeWrite({ address: campaign.id, abi: campaignabi.abi, functionName: "finalizeRequest", args: [BigInt(id)] });
  };

  const handleCreateRequest = () => {
    if (!isConnected) return toast.error("Connect wallet to create request");
    if (userAddress !== campaign.owner) return toast.error("Only owner can create request");
    createRequestWrite({
      address: campaign.id,
      abi: campaignabi.abi,
      functionName: "createRequest",
      args: ["Server costs", parseEther("0.5"), userAddress],
    });
  };

  // ---- Toasts ----
  React.useEffect(() => {
    if (isApproveConfirmed) { toast.success("Request approved!"); refetchRequests(); refetchHasApproved(); }
    if (approveError || approveConfirmError) toast.error("Approve failed");
    if (isFinalizeConfirmed) { toast.success("Request finalized!"); refetchRequests(); }
    if (finalizeError || finalizeConfirmError) toast.error("Finalize failed");
    if (isCreateRequestConfirmed) { toast.success("Request created!"); refetchRequests(); }
    if (createRequestError || createRequestConfirmError) toast.error("Create request failed");
  }, [isApproveConfirmed, approveError, approveConfirmError, isFinalizeConfirmed, finalizeError, finalizeConfirmError, isCreateRequestConfirmed, createRequestError, createRequestConfirmError]);

  const overallLoading = requestsLoading || hasApprovedLoading;
  const overallError = requestsError?.message || hasApprovedError?.message || null;

  // ---- Render ----
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fund Release Requests ({Number(campaign.requestCount)})</CardTitle>
        <CardDescription>
          {campaign.owner === userAddress ? (
            <Button size="sm" onClick={handleCreateRequest} disabled={isCreatingRequest || isCreateRequestConfirming}>
              {isCreatingRequest || isCreateRequestConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Create New Request
            </Button>
          ) : (
            <p>Contributors can approve fund requests.</p>
          )}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {overallLoading && <Loader2 className="h-4 w-4 animate-spin text-primary" />}
        {overallError && (
          <Alert variant="destructive">
            <Frown className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{overallError}</AlertDescription>
          </Alert>
        )}

        {!overallLoading && !overallError && requests.length === 0 && <p className="text-muted-foreground">No requests yet.</p>}

        {!overallLoading && !overallError && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="border p-4 rounded-lg flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatEther(r.amount)} ETH → {r.recipient.slice(0, 6)}...{r.recipient.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">Approvals: {String(r.approvalCount)}</p>
                </div>
                {r.complete ? (
                  <Badge>Finalized</Badge>
                ) : (
                  <div className="flex gap-2">
                    {!r.hasApproved && (
                      <Button size="sm" onClick={() => handleApproveRequest(r.id)} disabled={isApproving || isApproveConfirming}>
                        {isApproving || isApproveConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <CircleCheck className="h-4 w-4" />}
                        Approve
                      </Button>
                    )}
                    {campaign.owner === userAddress && (
                      <Button size="sm" onClick={() => handleFinalizeRequest(r.id)} disabled={isFinalizing || isFinalizeConfirming}>
                        {isFinalizing || isFinalizeConfirming ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandCoins className="h-4 w-4" />}
                        Finalize
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
