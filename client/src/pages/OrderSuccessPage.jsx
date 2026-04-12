import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useConfirmStripeOrderMutation } from "@store/api/apiSlice";
import { useDispatch } from "react-redux";
import { clearCartState } from "@store/slices/cartSlice";
import { PageLoader } from "@components";

const OrderSuccessPage = () => {
  // Read session_id from URL query params set by Stripe after successful payment
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  // Send actions to update Redux store
  const dispatch = useDispatch();
  const [confirmStripeOrder] = useConfirmStripeOrderMutation();
  // Show loader while confirming Stripe order
  const [loading, setLoading] = useState(!!sessionId);
  // Prevent duplicate confirmation attempts in StrictMode
  const isConfirmed = useRef(false);

  useEffect(() => {
    // Only confirm Stripe order if session_id is present in the URL
    // Cash on delivery orders don't have a session_id
    if (sessionId && !isConfirmed.current) {
      isConfirmed.current = true;
      confirmStripeOrder({ sessionId })
        .unwrap()
        .then(() => {
          // Clear cart from Redux and localStorage after successful payment
          dispatch(clearCartState());
          toast.success("Payment successful!");
        })
        .catch(() => {
          toast.error("Error confirming order. Please contact support.");
        })
        .finally(() => setLoading(false));
    }
  }, [sessionId, confirmStripeOrder, dispatch]);

  // Show loader while confirming Stripe order
  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <PageLoader />
      </div>
    );
  }

  return (
    <>
      {/* Meta tags  */}
      <Helmet>
        <title>Order Confirmed - TechShop</title>
      </Helmet>
      
      <section className="max-w-md mx-auto py-20 flex flex-col items-center justify-center text-center">
        <div className="flex items-center justify-center w-20 h-20 mb-6 bg-green-100 rounded-full">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className=" mb-3 text-3xl font-extrabold text-gray-800">
          Order Confirmed!
        </h1>
        <p className="mb-8 text-slate-500">
          Your order has been placed successfully. You will receive a
          confirmation email shortly.
        </p>
        <Link
          to="/"
          className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 hover:scale-105 transition-all duration-300 ease-in-out tracking-wide"
        >
          Back to Home
        </Link>
      </section>
    </>
  );
};

export default OrderSuccessPage;
