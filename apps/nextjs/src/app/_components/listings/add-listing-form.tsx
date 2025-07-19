"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import {
  Car,
  ImageIcon,
  IndianRupee,
  MapPin,
  Tag,
  Upload,
  X,
} from "lucide-react";
import { z } from "zod/v4";

import { Button } from "@acme/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@acme/ui/card";
import { Form, FormField, FormMessage, useForm } from "@acme/ui/form";
import { Input } from "@acme/ui/input";
import { Label } from "@acme/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@acme/ui/select";
import { Textarea } from "@acme/ui/textarea";
import { toast } from "@acme/ui/toast";
import { addListingSchema } from "@acme/validators";

import { useTRPC } from "~/trpc/react";
import Loader from "../loader";

export default function AddListingForm() {
  const trpc = useTRPC();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Form Setup
  const form = useForm({
    schema: addListingSchema,
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      makeId: undefined,
      modelId: undefined,
      categoryId: undefined,
      cityId: undefined,
      latitude: undefined,
      longitude: undefined,
    },
  });
  const queryClient = useQueryClient();
  // Mutations
  const createListing = useMutation(
    trpc.listing.create.mutationOptions({
      onSuccess: async () => {
        form.reset();
        await queryClient.invalidateQueries(trpc.listing.list.pathFilter());
        router.push("/listings");
      },
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to post"
            : "Failed to create post",
        );
      },
    }),
  );

  const getPresignedUrl = useMutation(
    trpc.uploader.getPreSignedUrl.mutationOptions({
      onError: (err) => {
        toast.error(
          err.data?.code === "UNAUTHORIZED"
            ? "You must be logged in to post"
            : "Failed to upload images",
        );
      },
    }),
  );

  // Queries
  const { data: categories = [], isFetching: isCategoriesLoading } =
    useSuspenseQuery(trpc.listing.categoryList.queryOptions());

  const { data: makes = [], isFetching: isMakesLoading } = useSuspenseQuery(
    trpc.listing.makeList.queryOptions(),
  );

  const { data: cities = [], isFetching: isCitiesLoading } = useSuspenseQuery(
    trpc.listing.cityList.queryOptions(),
  );

  const makeId = form.watch("makeId");
  const { data: models = [], isLoading: isModelsLoading } = useQuery(
    trpc.listing.modelListByMake.queryOptions(
      { makeId },
      { enabled: !!makeId },
    ),
  );

  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  // Handlers
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newUrls = Array.from(files)
      .slice(0, 5)
      .map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...newUrls].slice(0, 5));
    setImageFiles((prev) => [...prev, ...Array.from(files)].slice(0, 5));
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUploadImages = () => {
    return Promise.all(
      imageFiles.map(async (file) => {
        const res = await getPresignedUrl.mutateAsync({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
        });
        await fetch(res.presignedUrl, {
          method: "PUT",
          body: file,
          headers: {
            "Content-Type": file.type,
          },
        });
        return res.presignedUrl.split("?")[0];
      }),
    );
  };

  const onSubmit = async (data: z.infer<typeof addListingSchema>) => {
    try {
      if (imageFiles.length === 0) {
        toast.error("Please upload at least one image.");
        return;
      }

      setIsLoading(true);
      const imageUrls = await handleUploadImages();
      await createListing.mutateAsync({
        ...data,
        imageUrls: imageUrls.filter((url): url is string => !!url),
      });
    } catch (err) {
      toast.error("Something went wrong, please try again!");
      console.log("Error creating listing: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Images Section */}
        <Card className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <ImageIcon size={24} className="text-orange-400" />
              Photos (Up to 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-5">
              {images.map((src, idx) => (
                <div key={idx} className="group relative">
                  <img
                    src={src}
                    alt={`Preview ${idx + 1}`}
                    className="h-32 w-full rounded-lg border-2 border-zinc-600 object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => removeImage(idx)}
                    className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X size={12} />
                  </Button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-600 transition-colors hover:border-orange-400">
                  <Upload
                    className="mb-2 text-zinc-400 hover:text-orange-400"
                    size={24}
                  />
                  <span className="text-sm text-zinc-400">Add Photo</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-zinc-400">
              Add clear photos from multiple angles. First photo will be the
              main image.
            </p>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Tag size={24} className="text-orange-400" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              name="title"
              render={({ field }) => (
                <div>
                  <Label htmlFor="title" className="text-white">
                    Title *
                  </Label>
                  <Input
                    {...field}
                    id="title"
                    placeholder="e.g., Garrett GT2860RS Turbo Kit"
                    className="border-zinc-600 bg-zinc-700/50 text-white"
                  />
                  <FormMessage />
                </div>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="categoryId"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Category *</Label>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value ?? "")}
                    >
                      <SelectTrigger className="border-zinc-600 bg-zinc-700/50 text-white">
                        <SelectValue
                          placeholder={
                            isCategoriesLoading
                              ? "Loading..."
                              : "Select category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800">
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                name="brand"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Brand</Label>
                    <Input
                      {...field}
                      placeholder="e.g., Garrett"
                      className="border-zinc-600 bg-zinc-700/50 text-white"
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>

            <FormField
              name="description"
              render={({ field }) => (
                <div>
                  <Label className="text-white">Description *</Label>
                  <Textarea
                    {...field}
                    placeholder="Describe the part..."
                    className="min-h-32 border-zinc-600 bg-zinc-700/50 text-white"
                  />
                  <FormMessage />
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* Car Compatibility */}
        <Card className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Car size={24} className="text-orange-400" />
              Car Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                name="makeId"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Make *</Label>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value ?? "")}
                    >
                      <SelectTrigger className="border-zinc-600 bg-zinc-700/50 text-white">
                        <SelectValue
                          placeholder={
                            isMakesLoading ? "Loading..." : "Select make"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800">
                        <SelectItem value="0">Universal Fitment</SelectItem>
                        {makes.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                name="modelId"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Model</Label>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value ?? "")}
                      disabled={!makeId || isModelsLoading}
                    >
                      <SelectTrigger className="border-zinc-600 bg-zinc-700/50 text-white">
                        <SelectValue
                          placeholder={
                            makeId
                              ? isModelsLoading
                                ? "Loading..."
                                : "Select model"
                              : "Select make first"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="border-zinc-700 bg-zinc-800">
                        {models.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                name="partNumber"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Part Number</Label>
                    <Input
                      {...field}
                      placeholder="e.g., GT2860RS-KIT"
                      className="border-zinc-600 bg-zinc-700/50 text-white"
                    />
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Price & Location */}
        <Card className="border-zinc-700/50 bg-zinc-800/50 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <IndianRupee size={24} className="text-orange-400" />
              Price & Location
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                name="price"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Price (INR) *</Label>
                    <div className="relative">
                      <IndianRupee
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-zinc-400"
                        size={16}
                      />
                      <Input
                        {...field}
                        type="number"
                        placeholder="0"
                        className="border-zinc-600 bg-zinc-700/50 pl-10 text-white"
                      />
                    </div>
                    <FormMessage />
                  </div>
                )}
              />

              <FormField
                name="cityId"
                render={({ field }) => (
                  <div>
                    <Label className="text-white">Location *</Label>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 transform text-zinc-400"
                        size={16}
                      />
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(field.value ?? "")}
                      >
                        <SelectTrigger className="border-zinc-600 bg-zinc-700/50 pl-10 text-white">
                          <SelectValue
                            placeholder={
                              isCitiesLoading ? "Loading..." : "Select location"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="border-zinc-700 bg-zinc-800">
                          {cities.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </div>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col justify-end gap-4 sm:flex-row">
          {/* <Button
            variant="outline"
            type="button"
            className="border-zinc-600 text-white hover:bg-zinc-800"
          >
            Save as Draft
          </Button> */}
          <Button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-orange-500 px-12 text-white hover:bg-orange-600"
          >
            {isLoading ? (
              <Loader size="sm" className="border-secondary" />
            ) : (
              <Upload size={16} />
            )}
            Publish Listing
          </Button>
        </div>
      </form>
    </Form>
  );
}
