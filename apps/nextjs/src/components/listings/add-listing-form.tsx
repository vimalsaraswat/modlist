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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@acme/ui/form";
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
import { addListingSchema } from "@acme/validators";

import { useTRPC } from "~/trpc/react";
import Combobox from "../common/combobox";
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
      { makeId: Number(makeId) },
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
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="text-accent" />
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
                    className="aspect-square h-32 h-full w-full rounded-lg border border-border object-cover"
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
                <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border transition-colors hover:border-accent">
                  <Upload className="mb-2 text-muted-foreground" size={24} />
                  <span className="text-sm text-muted-foreground">
                    Add Photo
                  </span>
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
            <p className="text-sm text-muted-foreground">
              Add clear photos from multiple angles. First photo will be the
              main image.
            </p>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tag className="text-accent" />
              Basic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="e.g., Garrett GT2860RS Turbo Kit"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String((field.value as number | undefined) ?? "")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isCategoriesLoading
                                ? "Loading..."
                                : "Select category"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={String(cat.id)}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Part Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., GT2860RS-KIT" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Describe the part..."
                      className="min-h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Car Compatibility */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="text-accent" />
              Car Compatibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <FormField
                control={form.control}
                name="makeId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Make *</FormLabel>
                    <Combobox
                      value={String((field.value as number | undefined) ?? "")}
                      onChange={(v) => field.onChange(Number(v))}
                      options={makes.map((m) => ({
                        label: m.name,
                        value: String(m.id),
                      }))}
                      placeholder={
                        isMakesLoading ? "Loading..." : "Select make"
                      }
                    />
                    {/* <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String((field.value as number | undefined) ?? "")}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isMakesLoading ? "Loading..." : "Select make"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="0">Universal Fitment</SelectItem>
                        {makes.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="modelId"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2">
                    <FormLabel>Model</FormLabel>
                    <Combobox
                      value={String((field.value as number | undefined) ?? "")}
                      onChange={(v) => field.onChange(Number(v))}
                      options={models.map((m) => ({
                        label: m.name,
                        value: String(m.id),
                      }))}
                      placeholder={
                        makeId
                          ? isModelsLoading
                            ? "Loading..."
                            : "Select model"
                          : "Select make first"
                      }
                    />
                    {/* <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String((field.value as number | undefined) ?? "")}
                      disabled={!makeId || isModelsLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                      </FormControl>
                      <SelectContent>
                        {models.map((m) => (
                          <SelectItem key={m.id} value={String(m.id)}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select> */}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Price & Location */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="text-accent" />
              {"Price & Location"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (INR) *</FormLabel>
                    <div className="relative">
                      <IndianRupee
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <Input
                        {...field}
                        value={field.value as number}
                        type="number"
                        placeholder="0"
                        className="pl-10"
                        inputMode="numeric"
                      />
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cityId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <div className="relative">
                      <MapPin
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        size={16}
                      />
                      <Select
                        onValueChange={(v) => field.onChange(Number(v))}
                        value={String(
                          (field.value as number | undefined) ?? "",
                        )}
                      >
                        <FormControl>
                          <SelectTrigger className="pl-10">
                            <SelectValue
                              placeholder={
                                isCitiesLoading
                                  ? "Loading..."
                                  : "Select location"
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}

        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? (
            <Loader size="sm" className="mr-2 border-secondary" />
          ) : (
            <>
              <Upload size={16} className="mr-2" />
            </>
          )}{" "}
          Publish Listing
        </Button>
      </form>
    </Form>
  );
}
