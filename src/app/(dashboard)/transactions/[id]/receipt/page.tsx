"use client";

import { useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Button } from "@/components/ui/Button";
import { TransactionReceipt } from "@/components/transactions/TransactionReceipt";
import { TransactionReceiptAlt } from "@/components/transactions/TransactionReceipttwo";
import { useAuth } from "@/hooks/useAuth";
import { companiesApi } from "@/lib/api/companies";
import { transactionsApi } from "@/lib/api/transactions";

export default function TransactionReceiptPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const transactionId = params.id as string;
  const companyId = searchParams.get("companyId") ?? "";
  const receiptRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const {
    data: transaction,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["transaction", companyId, transactionId],
    queryFn: () => transactionsApi.get(companyId, transactionId),
    enabled: !!companyId && !!transactionId,
  });

  const { data: receiverCompany } = useQuery({
    queryKey: ["company", companyId],
    queryFn: () => companiesApi.get(companyId),
    enabled: !!companyId,
  });

  const formatCurrency = (amount: string, currency: string) => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleDownloadPdf = async () => {
    if (!receiptRef.current || !transaction) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imageData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 12;
    const imageWidth = pageWidth - margin * 2;
    const imageHeight = (canvas.height * imageWidth) / canvas.width;

    pdf.addImage(imageData, "PNG", margin, 12, imageWidth, imageHeight);
    pdf.save(
      `transaction-receipt-${transaction.transactionReference || transaction.id}.pdf`,
    );
  };

  if (!companyId) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-slate-400">Company ID is required.</p>
        <Link href="/transactions">
          <Button type="button" variant="secondary">
            Back to transactions
          </Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-slate-400">Loading receipt...</p>
      </div>
    );
  }

  if (isError || !transaction) {
    return (
      <div className="max-w-2xl space-y-4">
        <p className="text-slate-400">Transaction not found.</p>
        <Link href={`/transactions?companyId=${companyId}`}>
          <Button type="button" variant="secondary">
            Back to transactions
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <Link
          href={`/transactions/${transactionId}?companyId=${companyId}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-slate-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to transaction
        </Link>

        <Button type="button" onClick={handleDownloadPdf}>
          Download PDF
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-[860px]">
          <TransactionReceiptAlt
            ref={receiptRef}
            transaction={transaction}
            user={user}
            hostCompany={user?.company}
            receiverCompany={receiverCompany}
            formatCurrency={formatCurrency}
            formatDate={formatDate}
          />
        </div>
      </div>
    </div>
  );
}
