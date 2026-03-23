import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { MapPin, Plus, Trash2, CreditCard, Truck } from "lucide-react";
import {
  useGetAddressesQuery,
  useAddAddressMutation,
  useDeleteAddressMutation,
  useCreateOrderMutation,
  useCreateCheckoutSessionMutation,
} from "@store/api/apiSlice";
import { Button, Input, PageLoader, Loader } from "@components";
import { clearCartState } from "@store/slices/cartSlice";
import useCartActions from "@hooks/useCartActions";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cartItems } = useCartActions();

  // Get user email from Redux store to pre-fill Stripe checkout
  const userState = useSelector((state) => state.user);

  // Selected address state
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  // Toggle new address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  // New address form data
  const [addressForm, setAddressForm] = useState({
    address: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });

  // RTK Query hooks
  const { data: addresses = [], isLoading: loadingAddresses } =
    useGetAddressesQuery();
  const [addAddress, { isLoading: addingAddress }] = useAddAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [createOrder, { isLoading: creatingOrder }] = useCreateOrderMutation();
  const [createCheckoutSession, { isLoading: creatingSession }] =
    useCreateCheckoutSessionMutation();

  // Calculate subtotal and total including shipping
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const shippingCost = subtotal >= 200 ? 0 : 10;
  const total = subtotal + shippingCost;

  // Selected address object
  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);

  // Order data to send to backend
  const orderData = {
    items: cartItems.map((item) => ({
      productId: item._id,
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      price: item.price,
    })),
    total,
    shippingAddress: selectedAddress,
    paymentMethod,
    email: userState.email, // Pre-fill email in Stripe checkout
  };

  const handleAddressFormChange = (e) => {
    setAddressForm({ ...addressForm, [e.target.name]: e.target.value });
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await addAddress(addressForm).unwrap();
      toast.success("Address added successfully");
      setAddressForm({
        address: "",
        city: "",
        state: "",
        country: "",
        postal_code: "",
      });
      setShowAddressForm(false);
    } catch (error) {
      toast.error(error.data?.message || "Error adding address");
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress({ _id: id }).unwrap();
      toast.success("Address deleted successfully");
      if (selectedAddressId === id) setSelectedAddressId(null);
    } catch (error) {
      toast.error(error.data?.message || "Error deleting address");
    }
  };

  const handleCashOnDelivery = async () => {
    try {
      await createOrder(orderData).unwrap();
      // Clear cart from Redux and localStorage after successful order
      dispatch(clearCartState());
      toast.success("Order placed successfully!");
      navigate("/order-success");
    } catch (error) {
      toast.error(error.data?.message || "Error placing order");
    }
  };

  const handleOnlinePayment = async () => {
    try {
      // Create Stripe checkout session and redirect to Stripe
      const res = await createCheckoutSession(orderData).unwrap();
      // Redirect to Stripe hosted checkout page
      window.location.href = res.data.url;
    } catch (error) {
      toast.error(error.data?.message || "Error creating checkout session");
    }
  };

  // Validate before placing order
  const canPlaceOrder = selectedAddressId && cartItems.length > 0;

  if (loadingAddresses) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <h1 className="mb-8 mt-4 text-3xl md:text-4xl font-extrabold text-slate-800">
        Checkout
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* Left column - Shipping Address + Payment */}
        <div className="flex flex-col gap-6">
          {/* Shipping Address Section */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-5">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                <MapPin size={20} className="text-orange-500" />
                Shipping Address
              </h2>
              <Button
                onClick={() => setShowAddressForm(!showAddressForm)}
                icon={Plus}
                iconSize={16}
                className="w-full sm:w-auto justify-center bg-orange-500 text-white hover:bg-orange-600 text-sm"
              >
                Add New
              </Button>
            </div>

            {/* New address form */}
            {showAddressForm && (
              <form
                onSubmit={handleAddAddress}
                className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-200"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <Input
                    label="Address"
                    name="address"
                    value={addressForm.address}
                    onChange={handleAddressFormChange}
                    placeholder="Street address"
                  />
                  <Input
                    label="City"
                    name="city"
                    value={addressForm.city}
                    onChange={handleAddressFormChange}
                    placeholder="City"
                  />
                  <Input
                    label="State"
                    name="state"
                    value={addressForm.state}
                    onChange={handleAddressFormChange}
                    placeholder="State"
                  />
                  <Input
                    label="Country"
                    name="country"
                    value={addressForm.country}
                    onChange={handleAddressFormChange}
                    placeholder="Country"
                  />
                  <Input
                    label="Postal Code"
                    name="postal_code"
                    value={addressForm.postal_code}
                    onChange={handleAddressFormChange}
                    placeholder="Postal code"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    disabled={addingAddress}
                    className={`bg-orange-500 text-white hover:bg-orange-600 ${addingAddress ? "opacity-85 px-10" : ""}`}
                  >
                    {addingAddress ? <Loader /> : "Save Address"}
                  </Button>
                  <Button
                    onClick={() => setShowAddressForm(false)}
                    className="bg-slate-200 text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Saved addresses list */}
            {addresses.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-4">
                No saved addresses. Add one above.
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    onClick={() => setSelectedAddressId(addr._id)}
                    className={`flex items-start justify-between p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                      selectedAddressId === addr._id
                        ? "border-orange-500 bg-orange-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div>
                      <p className="font-semibold text-slate-800">
                        {addr.address}
                      </p>
                      <p className="text-sm text-slate-500">
                        {addr.city}, {addr.state}, {addr.country}{" "}
                        {addr.postal_code}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addr._id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Method Section */}
          <div className="p-6 bg-white border border-slate-200 rounded-xl">
            <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-5">
              <CreditCard size={20} className="text-orange-500" />
              Payment Method
            </h2>

            <div className="flex flex-col gap-3">
              {/* Cash on Delivery option */}
              <div
                onClick={() => setPaymentMethod("cash_on_delivery")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === "cash_on_delivery"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <Truck size={20} className="text-slate-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">
                    Cash on Delivery
                  </p>
                  <p className="text-xs text-slate-500">
                    Pay when your order arrives
                  </p>
                </div>
              </div>

              {/* Online Payment option */}
              <div
                onClick={() => setPaymentMethod("online_payment")}
                className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  paymentMethod === "online_payment"
                    ? "border-orange-500 bg-orange-50"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <CreditCard size={20} className="text-slate-600 shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800">Online Payment</p>
                  <p className="text-xs text-slate-500">
                    Pay securely with Stripe
                  </p>
                </div>
              </div>
            </div>

            {/* Action button */}
            <div className="mt-5">
              {paymentMethod === "cash_on_delivery" ? (
                <Button
                  onClick={handleCashOnDelivery}
                  disabled={!canPlaceOrder || creatingOrder}
                  className={`w-full justify-center bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed ${creatingOrder ? "opacity-85 px-10" : ""}`}
                >
                  {creatingOrder ? <Loader /> : "Place Order"}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleOnlinePayment}
                    disabled={!canPlaceOrder || creatingSession}
                    className={`w-full justify-center bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed ${creatingSession ? "opacity-85 px-10" : ""}`}
                  >
                    {creatingSession ? <Loader /> : "Pay with Stripe"}
                  </Button>
                  {/* Test mode hint for Stripe */}
                  <p className="text-xs text-slate-400 mt-2 text-center">
                    Test mode: use card{" "}
                    <span className="font-bold text-slate-500">
                      4242 4242 4242 4242
                    </span>
                    , any future date and any 3-digit CVC
                  </p>
                </>
              )}

              {/* Warning if no address selected */}
              {!selectedAddressId && (
                <p className="text-xs text-red-500 mt-3 text-center">
                  Please select a shipping address to continue
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Order Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="p-6 bg-white border border-slate-200 rounded-xl">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              Order Summary
            </h2>

            {/* Cart items list */}
            <div className="flex flex-col gap-4 mb-6">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-slate-200">
                    {item.image?.[0] && (
                      <img
                        src={item.image[0]}
                        alt={item.name}
                        className="w-full h-full object-fill"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-sm font-bold text-orange-600">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-slate-200 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Subtotal</span>
                <span className="text-sm font-semibold text-slate-800">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-slate-500">Shipping</span>
                <span className="text-sm font-semibold text-green-600">
                  {shippingCost === 0 ? "FREE" : "$10.00"}
                </span>
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-black text-orange-600">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckoutPage;
