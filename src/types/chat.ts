import type { ProductItem } from './marketplace';

export type OfferStatus = 'pending' | 'countered' | 'accepted' | 'declined';

export interface ChatMessage {
  id: string;
  senderId: 'buyer' | 'seller';
  senderName: string;
  text: string;
  timestamp: string;
  isOfferCard?: boolean;
  offerDetails?: {
    amount: number;
    status: OfferStatus;
    offeredBy: 'buyer' | 'seller';
  };
}

export interface Conversation {
  id: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  product: ProductItem;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  activeOffer?: {
    amount: number;
    status: OfferStatus;
    offeredBy: 'buyer' | 'seller';
  };
  messages: ChatMessage[];
}