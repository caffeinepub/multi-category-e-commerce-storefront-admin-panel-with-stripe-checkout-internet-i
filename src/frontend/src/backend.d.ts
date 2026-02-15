import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Category {
    id: string;
    name: string;
    parentCategory?: string;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export interface CartItemVar {
    variantId: string;
    quantity: bigint;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Variant {
    color?: string;
    size?: string;
}
export interface ProductVar {
    id: string;
    inventory: bigint;
    productId: string;
    price: bigint;
    variant: Variant;
}
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface http_header {
    value: string;
    name: string;
}
export interface ShoppingItem {
    productName: string;
    currency: string;
    quantity: bigint;
    priceInCents: bigint;
    productDescription: string;
}
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export type StripeSessionStatus = {
    __kind__: "completed";
    completed: {
        userPrincipal?: string;
        response: string;
    };
} | {
    __kind__: "failed";
    failed: {
        error: string;
    };
};
export interface StripeConfiguration {
    allowedCountries: Array<string>;
    secretKey: string;
}
export interface Review {
    userId: string;
    productId: string;
    comment: string;
    rating: bigint;
}
export interface Product {
    id: string;
    name: string;
    description: string;
    category: string;
    price: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addItemToCart(variantId: string, quantity: bigint): Promise<boolean>;
    addProduct(product: Product): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeCheckoutSuccess(variantId: string): Promise<void>;
    createCheckoutSession(items: Array<ShoppingItem>, successUrl: string, cancelUrl: string): Promise<string>;
    getAllProducts(): Promise<Array<Product>>;
    getCallerCartItems(): Promise<Array<CartItemVar>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCategories(): Promise<Array<Category>>;
    getProductReviews(productId: string): Promise<Array<Review>>;
    getProductsByCategory(categoryId: string): Promise<Array<Product>>;
    getStripeSessionStatus(sessionId: string): Promise<StripeSessionStatus>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVariantsByProduct(productId: string): Promise<Array<ProductVar>>;
    isCallerAdmin(): Promise<boolean>;
    isStripeConfigured(): Promise<boolean>;
    removeItemFromCart(variantId: string): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    setStripeConfiguration(config: StripeConfiguration): Promise<void>;
    submitReview(productId: string, rating: bigint, comment: string): Promise<void>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
    updateCartItem(variantId: string, quantity: bigint): Promise<boolean>;
}
