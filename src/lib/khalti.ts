export interface KhaltiPaymentPayload {
  amountInRs: number;
  purchaseOrderId: string;
  purchaseOrderName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

export interface KhaltiVerifyResponse {
  pidx: string;
  total_amount: number;
  status: 'Completed' | 'Pending' | 'User canceled';
  transaction_id: string;
  fee: number;
}

const KHALTI_DEV_URL = 'https://dev.khalti.com/api/v2/epayment/initiate/';

/**
 * Converts Nepalese Rupees to Paisa (1 NPR = 100 Paisa)
 */
export const toPaisa = (npr: number): number => Math.round(npr * 100);

/**
 * Initiates payment with Khalti sandbox
 */
export const initiateKhaltiPayment = async (
  payload: KhaltiPaymentPayload
): Promise<{ success: boolean; pidx?: string; payment_url?: string; error?: string }> => {
  const publicKey = import.meta.env.VITE_KHALTI_PUBLIC_KEY || 'test_public_key_dc74e0fd57cb46cd93832aee0a505e44';

  try {
    const res = await fetch(KHALTI_DEV_URL, {
      method: 'POST',
      headers: {
        'Authorization': `key ${publicKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        return_url: `${window.location.origin}/order/${payload.purchaseOrderId}?gateway=khalti`,
        website_url: window.location.origin,
        amount: toPaisa(payload.amountInRs),
        purchase_order_id: payload.purchaseOrderId,
        purchase_order_name: payload.purchaseOrderName,
        customer_info: {
          name: payload.customerName || 'Kinne Ho Buyer',
          email: payload.customerEmail || 'buyer@kinneho.com',
          phone: payload.customerPhone || '9800000001',
        },
      }),
    });

    const data = await res.json();
    if (data.payment_url) {
      return { success: true, pidx: data.pidx, payment_url: data.payment_url };
    }
    return { success: false, error: data.detail || 'Khalti initiate failed' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error connecting to Khalti' };
  }
};