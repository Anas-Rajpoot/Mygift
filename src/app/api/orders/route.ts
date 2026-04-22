import { NextResponse } from 'next/server';
import { wooCommerce } from '@/lib/woocommerce';
import type { WCAddress } from '@/types/woocommerce';

interface OrderRequestBody {
  billing: WCAddress;
  shipping: WCAddress;
  line_items: Array<{
    product_id: number;
    variation_id?: number;
    quantity: number;
  }>;
  fee_lines?: Array<{
    name: string;
    total: string;
  }>;
  shipping_lines?: Array<{
    method_id: string;
    method_title: string;
    total: string;
  }>;
  customer_note?: string;
  create_account?: boolean;
  password?: string;
  payment_method?: 'cod' | 'card';
}

export async function POST(request: Request) {
  try {
    const body: OrderRequestBody = await request.json();

    // Validate required fields
    const hasLineItems = !!body.line_items?.length;
    const hasFeeLines = !!body.fee_lines?.length;
    if (!body.billing || (!hasLineItems && !hasFeeLines)) {
      return NextResponse.json(
        { message: 'At least one product or custom item is required' },
        { status: 400 }
      );
    }

    // If user wants to create an account, create customer first
    let customerId = 0;
    if (body.create_account && body.password && body.billing.email) {
      try {
        const customer = await wooCommerce.customers.create({
          email: body.billing.email,
          first_name: body.billing.first_name,
          last_name: body.billing.last_name,
          password: body.password,
          billing: body.billing,
          shipping: body.shipping,
        });
        customerId = customer.id;
      } catch (err) {
        // If customer already exists, try to find them
        const existingCustomer = await wooCommerce.customers.getByEmail(body.billing.email);
        if (existingCustomer) {
          customerId = existingCustomer.id;
        }
        // If customer creation fails for other reasons, continue without customer ID
        console.error('Customer creation error:', err);
      }
    }

    // Create the order
    const order = await wooCommerce.orders.create({
      payment_method: body.payment_method === 'card' ? 'card' : 'cod',
      payment_method_title: body.payment_method === 'card' ? 'Card / Online' : 'Cash on Delivery',
      set_paid: false,
      billing: body.billing,
      shipping: body.shipping,
      line_items: body.line_items,
      fee_lines: body.fee_lines,
      shipping_lines: body.shipping_lines,
      customer_id: customerId || undefined,
      customer_note: body.customer_note,
    });

    return NextResponse.json({
      id: order.id,
      number: order.number,
      status: order.status,
      total: order.total,
    });
  } catch (error) {
    console.error('Order creation error:', error);

    const message = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json({ message }, { status: 500 });
  }
}
