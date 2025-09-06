"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { ImageIcon, MapPin, Upload, User as UserIcon, X } from "lucide-react";
import { z } from "zod";

import { Button } from "@acme/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@acme/ui/dialog";
import { Input } from "@acme/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";

import { useTRPC } from "~/trpc/react";

const profileSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(100, "Name cannot exceed 100 characters"),
  bio: z.string().max(280, "Bio cannot exceed 280 characters").optional(),
});

export default function ProfileEditDialog({
  user,
}: {
  user: {
    city: string;
    bio: string | null;
    id: string;
    name: string | null;
    image: string | null;
    email: string;
    createdAt: Date;
    cityId: number | null;
  };
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const [uploading, setUploading] = useState(false);

  // Queries for cities
  const { data: cities = [], isFetching: isCitiesLoading } = useSuspenseQuery(
    trpc.listing.cityList.queryOptions(),
  );

  const [form, setForm] = useState({
    name: user.name ?? null,
    bio: user.bio ?? null,
    cityId: user.cityId ?? null,
    image: user.image ?? null,
  });

  const [preview, setPreview] = useState<string | null>(user.image ?? null);
  const [file, setFile] = useState<File | null>(null);

  const updateProfile = useMutation(
    trpc.auth.updateUserProfile.mutationOptions({
      onSuccess: async () => {
        toast.success("Profile updated successfully");
        await queryClient.invalidateQueries(
          trpc.auth.getUserProfile.pathFilter(),
        );
        setOpen(false);
      },
      onError: () => {
        toast.error("Failed to update profile");
      },
    }),
  );

  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: () => {
        toast.error("Failed to upload image");
      },
    }),
  );

  // Upload to S3 via presigned URL
  const handleImageUpload = async (): Promise<string | null> => {
    if (!file) return form.image;

    setUploading(true);
    const res = await getPresignedUrl.mutateAsync({
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    });

    await fetch(res.presignedUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    setUploading(false);

    return res.presignedUrl.split("?")[0] ?? null;
  };

  const onSubmit = async () => {
    try {
      const parsed = profileSchema.safeParse(form);
      if (!parsed.success) {
        toast.error("Invalid form input");
        console.log("err", parsed.error, form);
        return;
      }

      let imageUrl = form.image;
      if (file) {
        imageUrl = (await handleImageUpload()) ?? form.image;
      }

      await updateProfile.mutateAsync({
        name: form.name?.trim() ? form.name.trim() : undefined,
        bio: form.bio?.trim() ? form.bio.trim() : undefined,
        cityId: form.cityId && form.cityId > 0 ? form.cityId : undefined,
        image: imageUrl?.trim() ? imageUrl : undefined,
      });
    } catch (err) {
      console.log("Error updating user profile: ", err);
      toast.error("An unexpected error occurred while updating profile.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2 MB

    if (!allowedTypes.includes(f.type)) {
      toast.error(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.",
      );
      e.target.value = ""; // Clear the input
      return;
    }

    if (f.size > maxSize) {
      toast.error("File size too large. Maximum size is 2MB.");
      e.target.value = ""; // Clear the input
      return;
    }

    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Profile image */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <ImageIcon size={16} /> Profile Picture
            </label>
            <div className="flex items-center gap-4">
              {preview ? (
                <div className="relative">
                  <img
                    src={preview}
                    alt="Preview"
                    className="h-20 w-20 rounded-full border object-cover"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="destructive"
                    className="absolute -right-2 -top-2 h-6 w-6"
                    onClick={() => {
                      setPreview(null);
                      setFile(null);
                      setForm({ ...form, image: "" });
                    }}
                  >
                    <X size={12} />
                  </Button>
                </div>
              ) : (
                <label className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-dashed">
                  <Upload size={20} />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <UserIcon size={16} /> Name
            </label>
            <Input
              placeholder="Your name"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              placeholder="Short bio"
              value={form.bio ?? ""}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />
          </div>

          {/* City */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <MapPin size={16} /> City
            </label>
            <Select
              onValueChange={(v) => setForm({ ...form, cityId: Number(v) })}
              value={form.cityId ? String(form.cityId) : ""}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={isCitiesLoading ? "Loading..." : "Select city"}
                />
              </SelectTrigger>
              <SelectContent>
                {cities.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={onSubmit}
              disabled={uploading || updateProfile.isPending}
            >
              {uploading || updateProfile.isPending ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
