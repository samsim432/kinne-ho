import type { ProductItem } from './marketplace';

export type FulfillmentType = 'pickup' | 'delivery';
export type SellerDeliveryMethod = 'seller_p2p' | 'partner_courier';
export type EscrowStatus = 
  | 'escrow_locked'
  | 'awaiting_handover'
  | 'in_transit'
  | 'delivered_pending_review'
  | 'disputed'
  | 'completed_released';

export interface EscrowOrder {
  id: string;
  product: ProductItem;
  buyerName: string;
  sellerName: string;
  itemPrice: number;
  deliveryFee: number;
  totalAmount: number;
  fulfillmentType: FulfillmentType;
  sellerDeliveryMethod?: SellerDeliveryMethod;
  deliveryAddress?: string;
  handshakePin: string; // 6-digit PIN
  waybillNumber?: string;
  courierName?: string;
  status: EscrowStatus;
  createdAt: string;
  reviewDeadline: string; // 48h countdown
  disputeReason?: string;
}