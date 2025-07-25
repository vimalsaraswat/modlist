import { Avatar, AvatarFallback, AvatarImage } from "@acme/ui/avatar";

const UserAvatar = ({
  imageUrl,
  name,
  ...props
}: React.ComponentProps<typeof Avatar> & {
  imageUrl?: string | null;
  name: string;
}) => (
  <Avatar {...props} className="">
    {imageUrl ? (
      <AvatarImage alt={name + "image"} src={imageUrl} />
    ) : (
      <AvatarFallback>
        <span className="sr-only">{name}</span>
      </AvatarFallback>
    )}
  </Avatar>
);

export default UserAvatar;
