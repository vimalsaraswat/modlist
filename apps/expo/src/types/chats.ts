export interface ChatRow {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  participantUser: {
    name: string | null;
    email: string | null;
    image: string | null;
  } | null;
  lastMessage: {
    id: string;
    text: string | null;
    type: string;
    createdAt: Date;
  } | null;
}

export interface Message {
  id: string;
  createdAt: Date;
  updatedAt: Date | null;
  metadata:
    | {
        listingId: string;
        title: string;
        image: string;
        description: string;
      }
    | {
        image: string;
        alt?: string;
      }
    | null;
  type: "text" | "system" | "product" | "media" | "order";
  chatId: string;
  senderId: string | null;
  text: string | null;
}

export interface ProductMetadata {
  listingId: string;
  title: string;
  image: string;
  description: string;
}
