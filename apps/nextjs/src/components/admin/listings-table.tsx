"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { formatCurrency, formatDateLabel } from "@acme/helpers";
import { Button } from "@acme/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@acme/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@acme/ui/table";

import { useTRPC } from "~/trpc/react";
import ImageCarousel from "../common/image-carousel";
import ListingRow from "./listing-row";

interface ListingItem {
  id: string;
  title: string;
  description: string;
  status:
    | "pending_review"
    | "draft"
    | "active"
    | "sold"
    | "expired"
    | "archived"
    | "rejected"
    | "deleted";
  createdAt: Date;
  price: number;
  make: string | null;
  model: string | null;
  category: string | null;
  city: string | null;
  partNumber: string | null;
  user: {
    id: string;
    name: string;
    image: string | null;
    createdAt: Date;
  } | null;
  images: {
    url: string;
    position: number;
  }[];
}

export function ListingsTable({
  listings,
  offset,
  totalItems,
}: {
  listings: ListingItem[];
  offset: number;
  totalItems: number;
}) {
  const router = useRouter();
  const itemsPerPage = 5;

  function prevPage() {
    router.back();
  }

  function nextPage() {
    router.push(`dashboard/?offset=${offset}`, { scroll: false });
  }

  const trpc = useTRPC();
  const qc = useQueryClient();

  // const [items, setItems] = useState<ListingItem[]>(initialPending ?? []);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<
    "approve" | "reject" | null
  >(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  const [preview, setPreview] = useState<ListingItem | null>(null);

  const updateStatus = useMutation(
    trpc.admin["listings.updateStatus"].mutationOptions(),
  );

  const onAction = (id: string, action: "approve" | "reject") => {
    setSelectedId(id);
    setSelectedAction(action);
    setReason("");
    setConfirmOpen(true);
  };

  const confirm = async () => {
    if (!selectedId || !selectedAction) return;
    setProcessingId(selectedId);
    try {
      const status = selectedAction === "approve" ? "active" : "rejected";
      // setItems((prev) => prev.filter((i) => i.id !== selectedId)); // optimistic remove
      await updateStatus.mutateAsync({ id: selectedId, status, reason });
    } catch (err) {
      await qc.invalidateQueries(trpc.admin.pendingListings.pathFilter());
      console.error(err);
      alert("Failed to perform action. Check console.");
    } finally {
      setProcessingId(null);
      setConfirmOpen(false);
      setSelectedAction(null);
      setSelectedId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Sales
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listings.map((item) => (
                <ListingRow
                  key={item.id}
                  item={item}
                  onAction={onAction}
                  disabled={processingId === item.id}
                  setPreviewId={(id) => {
                    const previewItem = listings.find((it) => it.id === id);
                    if (previewItem) setPreview(previewItem);
                  }}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <form className="flex w-full items-center justify-between">
            <div className="text-xs text-muted-foreground">
              Showing{" "}
              <strong>
                {Math.max(0, Math.min(offset - itemsPerPage, totalItems) + 1)}-
                {offset}
              </strong>{" "}
              of <strong>{totalItems}</strong> products
            </div>
            <div className="flex">
              <Button
                formAction={prevPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={offset === itemsPerPage}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Prev
              </Button>
              <Button
                formAction={nextPage}
                variant="ghost"
                size="sm"
                type="submit"
                disabled={offset + itemsPerPage > totalItems}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </form>
        </CardFooter>
      </Card>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <h3 className="text-lg font-semibold">
            {selectedAction === "approve"
              ? "Approve listing"
              : "Reject listing"}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            This action will change the listing status. Provide an optional
            reason for the seller (recommended for rejection).
          </p>
          {selectedAction === "reject" && (
            <div className="mt-4">
              <Input
                placeholder="Reason for rejection (optional)"
                value={reason}
                onChange={(e) =>
                  setReason((e.target as HTMLInputElement).value)
                }
              />
            </div>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirm} disabled={processingId !== null}>
              {processingId
                ? "Processing..."
                : selectedAction === "approve"
                  ? "Approve"
                  : "Reject"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full preview dialog */}
      <Dialog open={!!preview} onOpenChange={() => setPreview(null)}>
        <DialogContent className="max-w-3xl">
          {preview && (
            <div className="space-y-4">
              <DialogTitle className="text-xl font-bold">
                {preview.title}
              </DialogTitle>

              <div>
                <ImageCarousel images={preview.images.map((img) => img.url)} />
              </div>
              <p className="text-sm text-muted-foreground">
                {preview.description}
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-sm font-medium">Price:</span>{" "}
                  <span className="font-semibold">
                    {formatCurrency(preview.price)}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Make:</span>{" "}
                  <span className="font-semibold">{preview.make}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Model:</span>{" "}
                  <span className="font-semibold">{preview.model}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">Category:</span>{" "}
                  <span className="font-semibold">{preview.category}</span>
                </div>
                <div>
                  <span className="text-sm font-medium">City:</span>{" "}
                  <span className="font-semibold">{preview.city}</span>
                </div>
                {preview.partNumber && (
                  <div>
                    <span className="text-sm font-medium">Part #:</span>{" "}
                    <span className="font-semibold">{preview.partNumber}</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Submitted by {preview.user?.name ?? "Unknown"} on{" "}
                {formatDateLabel(new Date(preview.createdAt))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
