import type { Conversation } from '../types/chat';
import { MOCK_PRODUCTS } from './mockData';

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv-1',
    participantName: 'Samir Simkhada',
    participantAvatar: 'SS',
    participantRating: 4.8,
    product: MOCK_PRODUCTS[0], // iPhone 13
    lastMessage: 'Seller countered with Rs. 46,000',
    lastMessageTime: '10 min ago',
    unreadCount: 1,
    currentOffer: {
      amount: 46000,
      offeredBy: 'Samir Simkhada',
      status: 'countered',
    },
    messages: [
      {
        id: 'm1',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hi Samir, is the battery health still at 87%?',
        timestamp: '11:15 AM',
      },
      {
        id: 'm2',
        senderId: 'seller',
        senderName: 'Samir Simkhada',
        text: 'Yes! Fully tested, original battery with no service warning.',
        timestamp: '11:18 AM',
      },
      {
        id: 'm3',
        senderId: 'buyer',
        senderName: 'You',
        text: 'I made an offer of Rs. 44,000.',
        timestamp: '11:20 AM',
        isSystemEvent: true,
        offerEvent: {
          amount: 44000,
          status: 'pending',
        },
      },
      {
        id: 'm4',
        senderId: 'seller',
        senderName: 'Samir Simkhada',
        text: 'I can do Rs. 46,000 if we can meet around New Road today.',
        timestamp: '11:25 AM',
        isSystemEvent: true,
        offerEvent: {
          amount: 46000,
          status: 'countered',
        },
      },
    ],
  },
  {
    id: 'conv-2',
    participantName: 'Shruti',
    participantAvatar: 'SH',
    participantRating: 4.9,
    product: MOCK_PRODUCTS[1], // Levi's Denim Jacket
    lastMessage: 'Sure, Baneshwor chowk works great for pickup.',
    lastMessageTime: '2 hours ago',
    unreadCount: 0,
    messages: [
      {
        id: 'm10',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Hi Shruti, does this fit true to size Medium?',
        timestamp: 'Yesterday',
      },
      {
        id: 'm11',
        senderId: 'seller',
        senderName: 'Shruti',
        text: 'Yes, standard regular fit. Perfect for layering.',
        timestamp: 'Yesterday',
      },
      {
        id: 'm12',
        senderId: 'seller',
        senderName: 'Shruti',
        text: 'Sure, Baneshwor chowk works great for pickup.',
        timestamp: '9:00 AM',
      },
    ],
  },
  {
    id: 'conv-3',
    participantName: 'Bibek',
    participantAvatar: 'BK',
    participantRating: 4.6,
    product: MOCK_PRODUCTS[3], // Retro Handheld Console
    lastMessage: 'Offer accepted for Rs. 5,000',
    lastMessageTime: '1 day ago',
    unreadCount: 0,
    currentOffer: {
      amount: 5000,
      offeredBy: 'You',
      status: 'accepted',
    },
    messages: [
      {
        id: 'm20',
        senderId: 'buyer',
        senderName: 'You',
        text: 'Offered Rs. 5,000 for the handheld console.',
        timestamp: 'Yesterday',
        isSystemEvent: true,
        offerEvent: {
          amount: 5000,
          status: 'accepted',
        },
      },
    ],
  },
];