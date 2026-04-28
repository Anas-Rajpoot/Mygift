# WordPress/WooCommerce Setup for MyGift.pk Orders

## Overview

The MyGift.pk order management system works with WooCommerce to sync orders and maintain data consistency. All orders are stored in our JSON database (`data/orders.json`) and automatically synced to WooCommerce for backup and reporting.

## How Orders Flow

1. **Customer Places Order** on Next.js frontend (GiftLab, Send to Pakistan, or Standard)
2. **Order Saved** to `/data/orders.json` with full details (gift message, recipient, items, etc.)
3. **WooCommerce Sync** - Order is automatically created in WooCommerce via REST API
4. **Admin Dashboard** - View and manage all orders in `/admin/orders`
5. **Status Updates** - When admin updates status, it syncs back to WooCommerce

## Installation & Configuration

### 1. Install Required WooCommerce Plugins

#### Essential Plugins:
- **WooCommerce** (already installed)
- **WooCommerce REST API** (built-in to WooCommerce 3.0+)

#### Optional but Recommended:
- **Advanced Custom Fields (ACF)** - Display gift details in WC order screen
- **WooCommerce Print Invoice & Delivery Note** - Print order slips

**Installation:**
```
WordPress Admin > Plugins > Add New
Search for each plugin, click Install, then Activate
```

### 2. Enable REST API

The REST API must be enabled to sync orders.

**Check Status:**
```
WordPress Admin > Settings > Permalinks
Make sure "Post name" or custom structure is selected (not Plain)
```

**Generate REST API Credentials:**
```
WordPress Admin > WooCommerce > Settings > Advanced > REST API
Click "Create an API key"
- Description: MyGift.pk Frontend
- Read/Write: YES
- Save
Copy Key and Secret to your .env file:
  WC_CONSUMER_KEY=ck_...
  WC_CONSUMER_SECRET=cs_...
```

### 3. Configure Payment Methods

Your WooCommerce must have these payment methods available:

```
WordPress Admin > WooCommerce > Settings > Payments
```

Enable or configure:
- ✅ **Cash on Delivery** (built-in)
- ✅ **Credit/Debit Card** (Stripe/PayPal recommended)
- ⚠️ **JazzCash** (if available plugin)
- ⚠️ **EasyPaisa** (if available plugin)

### 4. Set Up Shipping

Since all orders are shipped from Pakistan, configure flat-rate shipping:

```
WordPress Admin > WooCommerce > Settings > Shipping
```

**Add Shipping Zone:**
- Zone Name: Pakistan
- Zone Regions: Pakistan (PK)
- Shipping Method: Flat Rate
  - Cost: 299 (PKR)
  - Title: Standard Delivery

### 5. Configure Tax Settings (Optional)

```
WordPress Admin > WooCommerce > Settings > Tax
```

- Disable tax rates or configure per-item taxes if needed
- Most Pakistani shops don't apply tax to the order total

## Understanding Order Meta Data

When orders are synced to WooCommerce, all gift details are stored as "meta data" (custom fields):

### GiftLab Meta Fields:
```
_mygift_order_id          - Our internal order ID
_mygift_order_type        - 'giftlab'
_giftlab_occasion         - e.g., "Birthday"
_giftlab_box              - Box name
_giftlab_message          - Gift message
_giftlab_ribbon           - Ribbon color
_giftlab_data             - Full JSON object with all details
```

### Send to Pakistan Meta Fields:
```
_recipient_name           - Recipient's full name
_recipient_phone          - Recipient's phone
_recipient_city           - City in Pakistan
_recipient_relation       - Relation to buyer
_gift_message             - The gift message
_sender_name              - Who's sending the gift
_buyer_currency           - Currency used by buyer (USD, GBP, etc.)
_foreign_total            - Total in foreign currency
_diaspora_data            - Full JSON object
```

### View Meta Data in WordPress

**Admin Method 1 - Custom Fields Plugin:**
```
WordPress Admin > WooCommerce > Orders > [Order]
If ACF is installed, meta data displays in readable format
```

**Admin Method 2 - Direct View:**
```
WordPress Admin > WooCommerce > Orders > [Order]
Scroll down to "Custom Fields" section
Shows all _prefixed fields and their values
```

## COD (Cash on Delivery) Workflow

### Order Status Flow:
```
Pending (customer places order)
  ↓
Confirmed (admin confirms order is valid)
  ↓
Packed (admin marks as packed in warehouse)
  ↓
Dispatched (handed to courier)
  ↓
Delivered (reached customer, cash collected)
  ↓
Payment Received (cash confirmed in system)
```

### In WooCommerce:
- Pending → `pending` status
- Confirmed → `processing` status
- Packed → `processing` status
- Dispatched → `on-hold` status
- Payment Received → `completed` status
- Delivered → `completed` status

## Admin Panel Features

### Orders List (`/admin/orders`)
- View all orders with filtering by status, type, date
- See stats: Today's orders, pending COD, ready to pack, revenue
- Search by order number, customer name, phone
- Quick actions: View details, Print slip

### Order Details (`/admin/orders/[id]`)

**Left Side - Order Information:**
- Customer details (name, phone, email)
- Full order breakdown (items, add-ons, pricing)
- Gift message (if GiftLab or Send to Pakistan)
- Recipient details (for Send to Pakistan orders)
- Delivery address
- Admin notes section

**Right Side - Actions:**
- **Update Status** - Change order status + add note
- **Payment Info** - Payment method and status
- **Status History** - Timeline of all status changes
- **Quick Actions**:
  - Print Order Slip
  - Copy Order Details to clipboard
  - Open in WooCommerce (if synced)

## Environment Variables Required

Add these to your `.env.local`:

```env
# WooCommerce API (from REST API key)
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Admin WhatsApp Notifications (optional)
ADMIN_WHATSAPP_NUMBER=923001234567

# WordPress URL
NEXT_PUBLIC_WORDPRESS_URL=https://mygift.pk
```

## Testing the System

### Test Order Creation:

1. **Navigate to GiftLab** → `/giftlab/step-1`
2. **Complete all steps** through step-5
3. **Fill in customer details** (name, phone, email)
4. **Select payment method** (e.g., Cash on Delivery)
5. **Click "Place Order"**
6. **Confirm order appears** in `/admin/orders`

### Check WooCommerce Sync:

```
WordPress Admin > WooCommerce > Orders
Should see the order with:
- Correct amount
- Correct payment method
- Order notes with gift details
- Custom fields with metadata
```

### Verify Meta Data:

```
Click on synced order
Scroll to bottom
Find "Custom Fields" section
Verify _giftlab_* or _diaspora_* fields are populated
```

## Troubleshooting

### Orders Not Syncing to WooCommerce

**Check:**
1. REST API credentials are correct in `.env.local`
2. REST API is enabled in WordPress
3. Check server logs: `tail -f /var/log/php-errors.log`

**Debug:**
```bash
# Test REST API connection
curl -u "key:secret" https://mygift.pk/wp-json/wc/v3/orders

# Should return JSON with existing orders (or empty array)
```

### Status Updates Not Syncing

**Possible Issues:**
- Order not fully synced (missing wcOrderId)
- WooCommerce status mapping doesn't match

**Solution:**
- Check `src/app/api/orders/[id]/status/route.ts` for status mapping
- Manually update order status in WordPress if needed

### Meta Data Not Showing

**If using basic WordPress:**
- Install "ACF" plugin to display nicely
- Or check "Custom Fields" section in order details

**If Fields Hidden:**
```
WordPress Admin > Screen Options (top right of order page)
Ensure "Custom Fields" checkbox is checked
```

## Advanced: Customizing Order Sync

To modify how orders sync to WooCommerce, edit:

**File:** `src/app/api/orders/create/route.ts`

**Functions to Customize:**
- `syncToWooCommerce()` - Main sync logic
- `buildCustomerNote()` - What gets displayed in WC order notes
- `buildMetaData()` - What meta fields are created

## Security Notes

⚠️ **Important:**
- Never commit `.env.local` to GitHub
- REST API credentials in `.env.local` are server-side only
- WooCommerce passwords and API keys must be strong
- Regularly rotate API credentials

## Support & Documentation

- WooCommerce REST API: https://woocommerce.github.io/woocommerce-rest-api-docs/
- WooCommerce Settings: WordPress Admin > WooCommerce > Settings
- ACF Documentation: https://www.advancedcustomfields.com/

## FAQ

**Q: Can I use the system without WooCommerce?**
A: Yes! Orders still save to `data/orders.json`. WooCommerce sync is optional for backup/reporting.

**Q: What if WooCommerce is down?**
A: Orders still save locally. Sync will retry when WooCommerce comes back online.

**Q: Can I manually create orders in WooCommerce?**
A: Yes, but they won't appear in our admin panel. It's one-way sync (Next.js → WooCommerce).

**Q: How do I bulk export orders?**
A: Go to `/admin/orders`, use filters, then export from WooCommerce Admin.

**Q: Can customers see their order status?**
A: Yes! Create a `/account/orders` page that displays from `data/orders.json`.
