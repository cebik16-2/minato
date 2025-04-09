export interface Item {
    id: number
    name: string
    image: string
    price: string
    description: string
    category: string
    brand: string
    rating: number
    numReviews: number
    countInStock: number
  
    isFeatured: boolean
    isNew: boolean
    isOnSale: boolean
    isBestSeller: boolean
    isTopRated: boolean
    isTrending: boolean
    isLimited: boolean
    isExclusive: boolean
    isPopular: boolean
    isRecommended: boolean
    isSpecial: boolean
    isGift: boolean
    isBundle: boolean
    isSubscription: boolean
    isDigital: boolean
    isPhysical: boolean
    isService: boolean
    isMembership: boolean
    isDonation: boolean
    isCharity: boolean
    isFundraiser: boolean
    isCrowdfunding: boolean
    isPreorder: boolean
    isBackorder: boolean
    isOutOfStock: boolean
    isDiscontinued: boolean
    isLimitedEdition: boolean
    isSeasonal: boolean
    isHoliday: boolean
    isEvent: boolean
    isPromotion: boolean
    isSale: boolean
    isClearance: boolean
    isMarkdown: boolean
    isDiscounted: boolean
    isBargain: boolean
    isDeal: boolean
    isOffer: boolean
    isSpecialOffer: boolean
    isFlashSale: boolean
    isLimitedTime: boolean
    isLimitedQuantity: boolean
    isLimitedTimeOffer: boolean
    isLimitedTimeDeal: boolean
    isLimitedTimeSale: boolean
    isLimitedTimePromotion: boolean
    isLimitedTimeDiscount: boolean
    isLimitedTimeOfferDeal: boolean
    isLimitedTimeOfferSale: boolean
    isLimitedTimeOfferPromotion: boolean
    isLimitedTimeOfferDiscount: boolean
    isLimitedTimeOfferBargain: boolean
    isLimitedTimeOfferDealSale: boolean
  }
  
  export interface User {
    name: string
    email: string
    password: string
    address: string
    phone: string
    city: string
    state: string
    country: string
    zip: string
  
    isAdmin: boolean
    isSeller: boolean
    isCustomer: boolean
    isLoggedIn: boolean
    token: string
  
    cart: Item[]
    wishlist: Item[]
    orders: Item[]
    orderHistory: Item[]
    orderStatus: string
    orderDate: string
    orderTotal: number
    orderId: number
    orderItems: Item[]
  
    orderShipping: {
      address: string
      city: string
      state: string
      country: string
      zip: string
      phone: string
    }
  }
    export interface CartItem {
        id: number
        name: string
        image: string
        price: string
        quantity: number
    }

    export interface Order {
        id: number
        items: CartItem[]
        total: number
        shippingAddress: string
        paymentMethod: string
        status: string
        createdAt: string
    }

    export interface Product {
      id: number
      title: string
      price: number
      description: string
      category_id: number
      sku: string
      product_type: string
      category_name: string
      thumbnail_url: string | null
      image_urls: string[]
      created_at: string
      seller: {
        id: number
        email: string
        username?: string
      }
    }