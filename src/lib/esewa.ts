import CryptoJS from 'crypto-js';

export interface EsewaPaymentPayload {
  amount: number;
  taxAmount?: number;
  serviceCharge?: number;
  deliveryCharge?: number;
  transactionUuid: string;
  productCode?: string;
  successUrl: string;
  failureUrl: string;
}

const ESEWA_SECRET_KEY = '8gBm/:&EnhH.1/q'; // Official eSewa Sandbox Secret Key
const ESEWA_TEST_GATEWAY_URL = 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

export const initiateEsewaPayment = (payload: EsewaPaymentPayload) => {
  const totalAmount = payload.amount + (payload.taxAmount || 0) + (payload.serviceCharge || 0) + (payload.deliveryCharge || 0);
  const productCode = payload.productCode || import.meta.env.VITE_ESEWA_MERCHANT_CODE || 'EPAYTEST';
  
  // Signature Format: total_amount=...,transaction_uuid=...,product_code=...
  const signatureString = `total_amount=${totalAmount},transaction_uuid=${payload.transactionUuid},product_code=${productCode}`;
  const hash = CryptoJS.HmacSHA256(signatureString, ESEWA_SECRET_KEY);
  const signatureBase64 = CryptoJS.enc.Base64.stringify(hash);

  // Dynamically construct and submit the standard POST form to eSewa
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', ESEWA_TEST_GATEWAY_URL);

  const fields: Record<string, string> = {
    amount: payload.amount.toString(),
    tax_amount: (payload.taxAmount || 0).toString(),
    total_amount: totalAmount.toString(),
    transaction_uuid: payload.transactionUuid,
    product_code: productCode,
    product_service_charge: (payload.serviceCharge || 0).toString(),
    product_delivery_charge: (payload.deliveryCharge || 0).toString(),
    success_url: payload.successUrl,
    failure_url: payload.failureUrl,
    signed_field_names: 'total_amount,transaction_uuid,product_code',
    signature: signatureBase64,
  };

  Object.entries(fields).forEach(([key, val]) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', key);
    input.setAttribute('value', val);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};