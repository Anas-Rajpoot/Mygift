import fs from 'fs'
import path from 'path'

const dataDir = path.join(process.cwd(), 'data')
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })

const seed: Record<string, unknown> = {
  'giftlab-boxes.json': [
    { id: 'box-sm', name: 'Small Box', size: 'small', basePrice: 1200, maxItems: 4, dimensions: '20x20cm', weight: '200g', imageUrl: '', description: 'Perfect for small gifts', isActive: true, sortOrder: 1, features: ['Ribbon included', 'Message card'] },
    { id: 'box-md', name: 'Medium Box', size: 'medium', basePrice: 1800, maxItems: 8, dimensions: '30x30cm', weight: '400g', imageUrl: '', description: 'Our most popular size', isActive: true, sortOrder: 2, features: ['Premium ribbon', 'Message card', 'Tissue paper'] },
    { id: 'box-lg', name: 'Large Box', size: 'large', basePrice: 2500, maxItems: 12, dimensions: '40x40cm', weight: '600g', imageUrl: '', description: 'For generous gifting', isActive: true, sortOrder: 3, features: ['Luxury ribbon', 'Message card', 'Tissue', 'Filler'] },
    { id: 'box-xl', name: 'XL Hamper', size: 'xl', basePrice: 3500, maxItems: 18, dimensions: '50x40cm', weight: '1kg', imageUrl: '', description: 'The ultimate gift experience', isActive: true, sortOrder: 4, features: ['Premium ribbon', 'Card', 'Tissue', 'Filler', 'Shredded paper'] },
  ],
  'giftlab-addons.json': [
    { id: 'addon-card', name: 'Greeting Card', price: 500, lucideIcon: 'PackageOpen', isActive: true, sortOrder: 1, category: 'card' },
    { id: 'addon-wrap', name: 'Premium Wrapping', price: 800, lucideIcon: 'Gift', isActive: true, sortOrder: 2, category: 'decoration' },
    { id: 'addon-candle', name: 'Candle', price: 300, lucideIcon: 'Flame', isActive: true, sortOrder: 3, category: 'decoration' },
    { id: 'addon-balloons', name: 'Balloon Bunch', price: 400, lucideIcon: 'Smile', isActive: true, sortOrder: 4, category: 'decoration' },
  ],
  'announcements.json': [
    { id: 'ann-1', text: 'Same-day delivery in Karachi, Lahore & Islamabad', isActive: true, sortOrder: 1 },
    { id: 'ann-2', text: 'International orders welcome — JazzCash · EasyPaisa · Cards', isActive: true, sortOrder: 2 },
    { id: 'ann-3', text: 'Free delivery on orders above Rs5,000', isActive: true, sortOrder: 3 },
  ],
  'header-links.json': [
    { id: 'nav-shop', label: 'Shop', href: '/shop', hasDropdown: true, showInDesktop: true, showInMobile: true, isActive: true, sortOrder: 1 },
    { id: 'nav-occasions', label: 'Occasions', href: '/occasions', hasDropdown: false, showInDesktop: true, showInMobile: true, isActive: true, sortOrder: 2 },
    { id: 'nav-giftlab', label: 'GiftLab', href: '/giftlab', hasDropdown: false, showInDesktop: true, showInMobile: true, isActive: true, sortOrder: 3 },
    { id: 'nav-send-pk', label: 'Send to Pakistan', href: '/send-to-pakistan', hasDropdown: false, showInDesktop: true, showInMobile: true, isActive: true, sortOrder: 4 },
    { id: 'nav-about', label: 'About', href: '/about', hasDropdown: false, showInDesktop: true, showInMobile: true, isActive: true, sortOrder: 5 },
  ],
  'footer-links.json': [
    { id: 'footer-shop-all', section: 'shop', name: 'All Products', href: '/shop', isActive: true, sortOrder: 1 },
    { id: 'footer-shop-delivery', section: 'shop', name: 'Delivery', href: '/delivery', isActive: true, sortOrder: 2 },
    { id: 'footer-shop-returns', section: 'shop', name: 'Returns', href: '/returns', isActive: true, sortOrder: 3 },
    { id: 'footer-company-about', section: 'company', name: 'About Us', href: '/about', isActive: true, sortOrder: 1 },
    { id: 'footer-company-privacy', section: 'company', name: 'Privacy Policy', href: '/privacy-policy', isActive: true, sortOrder: 2 },
    { id: 'footer-company-terms', section: 'company', name: 'Terms of Service', href: '/terms', isActive: true, sortOrder: 3 },
  ],
  'footer-payments.json': [
    { id: 'pay-jazzcash', name: 'JazzCash', isActive: true, sortOrder: 1 },
    { id: 'pay-easypaisa', name: 'EasyPaisa', isActive: true, sortOrder: 2 },
    { id: 'pay-visa', name: 'Visa', isActive: true, sortOrder: 3 },
    { id: 'pay-mastercard', name: 'Mastercard', isActive: true, sortOrder: 4 },
  ],
  'home-image-banners.json': [],
  'site-settings.json': [
    {
      id: 'main',
      storeName: 'MyGift.pk',
      storeTagline: 'The art of gifting, perfected',
      whatsappNumber: '923001282333',
      whatsappNumber2: '923084410261',
      supportEmail: 'support@mygift.pk',
      supportPhone: '0300-1282333',
      supportPhone2: '',
      address: 'Gulghast, Chungi No.6, Multan',
      city: 'Multan',
      social: {
        facebook: 'https://www.facebook.com/profile.php?id=61580985345163',
        instagram: 'https://www.instagram.com/my_gift_pk/',
        tiktok: 'https://www.tiktok.com/@mygift.pk',
        pinterest: 'https://www.pinterest.com/mygiftspk/',
        twitter: '',
      },
      seo: { defaultTitle: 'MyGift.pk', titleSuffix: ' | MyGift.pk', defaultDescription: 'Luxury gifting in Pakistan', defaultOgImage: '', googleAnalyticsId: '', facebookPixelId: '' },
      delivery: { freeDeliveryThreshold: 5000, defaultSameDayPrice: 299, defaultNextDayPrice: 199, defaultStandardPrice: 0, codAvailable: true, codFee: 0 },
      tax: { enabled: false, ratePercent: 0, applyToShipping: false },
      maintenance: { maintenanceMode: false, maintenanceMessage: 'We are updating our store. Back soon!' },
      homeLinks: {
        shopAllLink: '/shop',
        saleLink: '/shop?on_sale=true',
        sendToPakistanLink: '/send-to-pakistan',
        bestsellersLink: '/shop?best_sellers=true',
        categoryLinkTemplate: '/shop?category={slug}',
        occasionLinkTemplate: '/occasions?occasion={slug}',
      },
      domainPayments: {
        managePaymentsInAdmin: false,
        primaryDomain: 'mygift.pk',
        adminDomain: 'admin.mygift.pk',
        enforceHttps: true,
        sslEnabled: true,
        lockAdminByIp: false,
        adminAllowedIp: '',
        webhookSecret: '',
        apiSecretKey: '',
        stripeEnabled: false,
        stripePublishableKey: '',
        stripeSecretKey: '',
        paypalEnabled: false,
        paypalClientId: '',
        paypalClientSecret: '',
        wiseEmail: '',
      },
    },
  ],
}

Object.entries(seed).forEach(([file, data]) => {
  fs.writeFileSync(path.join(dataDir, file), JSON.stringify(data, null, 2), 'utf-8')
})

console.log('Seed complete')
