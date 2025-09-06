"use client";

import Image from "next/image";

import { formatCurrency } from "@acme/helpers";
import { Badge } from "@acme/ui/badge";
import { Button } from "@acme/ui/button";
import { TableCell, TableRow } from "@acme/ui/table";

export default function ListingRow({
  item,
  disabled,
  onAction,
  setPreviewId,
}: {
  item: {
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
  };
  disabled: boolean;
  setPreviewId: (id: string) => void;
  onAction: (id: string, action: "approve" | "reject") => void;
}) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        {item.images[0]?.url && (
          <Image
            alt="Product image"
            className="aspect-square rounded-md object-cover"
            height="64"
            src={item.images[0].url}
            width="64"
          />
        )}
      </TableCell>
      <TableCell className="font-medium">{item.title}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {item.status.replace("_", " ")}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">
        {formatCurrency(item.price)}
      </TableCell>
      <TableCell className="hidden md:table-cell">{item.title}</TableCell>
      <TableCell className="hidden md:table-cell">
        {'product.availableAt.toLocaleDateString("en-US")'}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewId(item.id)}
          >
            Preview
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onAction(item.id, "reject")}
            disabled={disabled}
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => onAction(item.id, "approve")}
            disabled={disabled}
          >
            Approve
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
