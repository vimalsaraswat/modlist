import { useState } from "react";

import { toast } from "@acme/ui/toast";

interface MediaUploaderOptions {
  maxFiles?: number;
  maxFileSizeMB?: number;
  allowedTypes?: string[];
  getPresignedUrl: (params: {
    fileName: string;
    fileSize: number;
    mimeType: string;
  }) => Promise<{ presignedUrl: string }>;
}

export function useMediaUploader({
  maxFiles = 5,
  maxFileSizeMB = 2,
  allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
  getPresignedUrl,
}: MediaUploaderOptions) {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    const validFiles: File[] = [];
    const validPreviews: string[] = [];

    newFiles.forEach((file) => {
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast.error(`"${file.name}" is too large (max ${maxFileSizeMB}MB).`);
        return;
      }
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          `${file.name} is invalid. Allowed: ${allowedTypes
            .map((t) => t.split("/")[1])
            .join(", ")}`,
        );
        return;
      }
      validFiles.push(file);
      validPreviews.push(URL.createObjectURL(file));
    });

    setFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles));
    setPreviews((prev) => [...prev, ...validPreviews].slice(0, maxFiles));

    // reset input
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };
  const removeAll = () => {
    setFiles([]);
    setPreviews([]);
  };

  const uploadAll = async () => {
    setIsUploading(true);
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const { presignedUrl } = await getPresignedUrl({
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
          });

          await fetch(presignedUrl, {
            method: "PUT",
            body: file,
            headers: { "Content-Type": file.type },
          });

          return presignedUrl.split("?")[0]; // public URL
        }),
      );
      return urls;
    } catch (err) {
      toast.error("Failed to upload files");
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    files,
    previews,
    isUploading,
    handleFileChange,
    removeFile,
    uploadAll,
    removeAll,
  };
}
