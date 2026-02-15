import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Time "mo:core/Time";
import List "mo:core/List";
import Nat8 "mo:core/Nat8";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Nat32 "mo:core/Nat32";
import Char "mo:core/Char";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type and storage
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product-related types and state
  public type Category = {
    id : Text;
    name : Text;
    parentCategory : ?Text;
  };

  public type Product = {
    id : Text;
    name : Text;
    description : Text;
    price : Nat;
    category : Text;
  };

  public type CartItem = {
    productId : Text;
    quantity : Nat;
  };

  // No need for full cart details here, just product variations
  public type Variant = {
    color : ?Text;
    size : ?Text;
  };

  var variantIdCounter = 0;

  public type ProductVar = {
    id : Text;
    productId : Text;
    price : Nat;
    inventory : Nat;
    variant : Variant;
  };

  func createVariantId() : Text {
    variantIdCounter += 1;
    variantIdCounter.toText();
  };

  public type CartItemVar = {
    variantId : Text;
    quantity : Nat;
  };

  public type UserCart = {
    items : [CartItemVar];
  };

  module CartItemVar {
    public func compare(v1 : CartItemVar, v2 : CartItemVar) : Order.Order {
      Nat.compare(v1.quantity, v2.quantity);
    };
  };

  public type Cart = {
    items : [CartItemVar];
  };

  let carts = Map.empty<Principal, Cart>();

  public query ({ caller }) func getCategories() : async [Category] {
    // Public endpoint - no authorization needed
    let categories : [Category] = [
      { id = "1"; name = "Men's Fashion"; parentCategory = null },
      { id = "2"; name = "Women's Fashion"; parentCategory = null },
      { id = "3"; name = "Electronics"; parentCategory = null },
      { id = "4"; name = "Home & Kitchen"; parentCategory = null },
      { id = "5"; name = "Beauty & Personal Care"; parentCategory = null },
      { id = "6"; name = "Sports & Outdoors"; parentCategory = null },
    ];
    categories;
  };

  // Add/Update/Delete Cart Items

  // Add Item to Cart
  public shared ({ caller }) func addItemToCart(variantId : Text, quantity : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add items to cart");
    };

    switch (carts.get(caller)) {
      case (null) {
        let items = [({ variantId; quantity })];
        carts.add(caller, { items });
        true;
      };
      case (?existingCart) {
        let itemsArray = existingCart.items;
        let existingIndex = itemsArray.findIndex(func(item) { item.variantId == variantId });

        switch (existingIndex) {
          case (?idx) {
            let updatedItems = Array.tabulate(
              itemsArray.size(),
              func(i) {
                if (i == idx) {
                  { variantId; quantity = itemsArray[i].quantity + quantity };
                } else { itemsArray[i] };
              },
            );
            carts.add(caller, { items = updatedItems });
          };
          case (null) {
            let updatedItems = itemsArray.concat([({ variantId; quantity })]);
            carts.add(caller, { items = updatedItems });
          };
        };
        true;
      };
    };
  };

  // Update Item in Cart
  public shared ({ caller }) func updateCartItem(variantId : Text, quantity : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update cart items");
    };

    switch (carts.get(caller)) {
      case (null) { false };
      case (?existingCart) {
        let itemsArray = existingCart.items;
        let updatedItems = itemsArray.map(
          func(item) {
            if (item.variantId == variantId) {
              { variantId = item.variantId; quantity };
            } else { item };
          },
        );
        carts.add(caller, { items = updatedItems });
        true;
      };
    };
  };

  // Remove Item from Cart
  public shared ({ caller }) func removeItemFromCart(variantId : Text) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can remove cart items");
    };

    switch (carts.get(caller)) {
      case (null) { false };
      case (?existingCart) {
        let filteredItems = existingCart.items.filter(
          func(item) { item.variantId != variantId },
        );
        carts.add(caller, { items = filteredItems });
        true;
      };
    };
  };

  let products = Map.empty<Text, Product>();
  let variants = Map.empty<Text, ProductVar>();

  public query ({ caller }) func getProductsByCategory(categoryId : Text) : async [Product] {
    // Public endpoint - no authorization needed
    let productsArray = products.values().toArray();
    productsArray.filter<Product>(func(product) { product.category == categoryId });
  };

  public shared ({ caller }) func addProduct(product : Product) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add products");
    };
    products.add(product.id, product);
  };

  public query ({ caller }) func getCallerCartItems() : async [CartItemVar] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view cart");
    };

    switch (carts.get(caller)) {
      case (null) { [] };
      case (?cart) { cart.items };
    };
  };

  let reviews = Map.empty<Text, List.List<Review>>();

  public type Review = {
    productId : Text;
    userId : Text;
    rating : Nat;
    comment : Text;
  };

  public shared ({ caller }) func submitReview(productId : Text, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can submit reviews");
    };

    let review : Review = {
      productId;
      userId = caller.toText();
      rating;
      comment;
    };

    let reviewList = switch (reviews.get(productId)) {
      case (null) { List.empty<Review>() };
      case (?existing) { existing };
    };

    reviewList.add(review);
    reviews.add(productId, reviewList);
  };

  module Review {
    public func compare(r1 : Review, r2 : Review) : Order.Order {
      Nat.compare(r1.rating, r2.rating);
    };
  };

  public query ({ caller }) func getProductReviews(productId : Text) : async [Review] {
    // Public endpoint - no authorization needed
    switch (reviews.get(productId)) {
      case (null) { [] };
      case (?reviewList) {
        let reviewArray = reviewList.toArray();
        reviewArray.sort();
      };
    };
  };

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    // Public endpoint - no authorization needed
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    // Public endpoint for checking session status - no authorization needed
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  // Checkout helper functions

  public shared ({ caller }) func completeCheckoutSuccess(variantId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can complete checkout");
    };

    variantIdCounter := 0;
    switch (carts.get(caller)) {
      case (null) {};
      case (?cart) {
        let itemsArray = cart.items;
        let filteredItems = itemsArray.filter(
          func(item) { item.variantId != variantId },
        );
        carts.add(caller, { items = filteredItems });
      };
    };
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    // Transform function for HTTP outcalls - no authorization needed
    OutCall.transform(input);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  // Product Listing

  public query ({ caller }) func getAllProducts() : async [Product] {
    // Public endpoint - no authorization needed
    products.values().toArray();
  };

  module ProductVar {
    func compareOptionals(t1 : ?Text, t2 : ?Text) : Order.Order {
      switch t1 {
        case (null) { if (t2 == null) { #equal } else { #less } };
        case (?v1) {
          switch t2 {
            case (null) { #greater };
            case (?v2) { Text.compare(v1, v2) };
          };
        };
      };
    };

    public func compare(pv1 : ProductVar, pv2 : ProductVar) : Order.Order {
      let colorComparison = compareOptionals(pv1.variant.color, pv2.variant.color);
      switch colorComparison {
        case (#equal) {
          compareOptionals(pv1.variant.size, pv2.variant.size);
        };
        case (other) { other };
      };
    };
  };

  public query ({ caller }) func getVariantsByProduct(productId : Text) : async [ProductVar] {
    // Public endpoint - no authorization needed
    let variantsArray = variants.values().toArray();
    let filteredVariants = variantsArray.filter(func(variant) { variant.productId == productId });
    filteredVariants.sort();
  };
};
