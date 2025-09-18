"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@acme/ui/dialog";

import { useTRPC } from "~/trpc/react";

type UserAvatarProps = React.ComponentProps<typeof Avatar> & {
  imageUrl?: string | null;
  name: string;
  userId?: string;
};

const UserAvatar = ({ imageUrl, name, userId, ...props }: UserAvatarProps) => {
  const [open, setOpen] = useState(false);

  const trpc = useTRPC();

  const {
    data: garage,
    isLoading,
    isError,
  } = useQuery(
    trpc.garage.carsByUser.queryOptions(
      {
        userId: userId ?? "",
      },
      {
        enabled: open && !!userId,
      },
    ),
  );

  const handleClick = () => {
    if (userId) setOpen(true);
  };

  return (
    <>
      <Avatar
        {...props}
        onClick={handleClick}
        className={userId ? "cursor-pointer" : ""}
      >
        {imageUrl ? (
          <AvatarImage alt={`${name} image`} src={imageUrl} />
        ) : (
          <AvatarFallback>
            <span className="sr-only">{name}</span>
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      {userId && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="h-96">
            <DialogHeader>
              <DialogTitle>{name}’s Garage</DialogTitle>
            </DialogHeader>

            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : isError ? (
              <p className="text-center text-sm text-red-500">
                Failed to load garage details.
              </p>
            ) : garage && garage.length > 0 ? (
              <ul className="no-scrollbar space-y-4 overflow-auto">
                {garage.map((car) => (
                  <li
                    key={car.id}
                    className="space-y-2 rounded-lg border p-3 shadow-sm"
                  >
                    <p className="font-medium">
                      {car.make} {car.model} ({car.year})
                    </p>
                    {car.name && (
                      <p className="text-sm text-muted-foreground">
                        {car.name}
                      </p>
                    )}
                    {car.images.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {car.images.map((img, i) => (
                          <img
                            key={i}
                            src={img}
                            alt={`${car.make} ${car.model}`}
                            className="h-20 w-28 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-muted-foreground">
                No cars in garage.
              </p>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default UserAvatar;
