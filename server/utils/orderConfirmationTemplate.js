const orderConfirmationTemplate = ({
  name,
  orderId,
  items,
  total,
  shippingCost,
  shippingAddress,
  paymentMethod,
}) => {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0;">
        ${item.name || "Product"}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">
        $${item.price.toFixed(2)}
      </td>
      <td style="padding: 8px; border-bottom: 1px solid #e2e8f0; text-align: right;">
        $${(item.price * item.quantity).toFixed(2)}
      </td>
    </tr>
  `,
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: rgb(51, 51, 51);">Order Confirmed - TechShop</h2>
      <p style="color: rgb(51, 51, 51)">Hello ${name},</p>
      <p style="color: rgb(51, 51, 51)">Your payment was successful and your order has been confirmed.</p>

      <p style="color: rgb(51, 51, 51); font-size: 0.875rem;">
        <strong>Order ID:</strong> #${orderId.slice(-8).toUpperCase()}
      </p>

      <p style="color: rgb(51, 51, 51); font-size: 0.875rem;">
        <strong>Payment Method:</strong> ${paymentMethod === "online_payment" ? "Online Payment (Stripe)" : "Cash on Delivery"}
      </p>

      <p style="color: rgb(51, 51, 51); font-size: 0.875rem;">
        <strong>Shipping Address:</strong> ${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state}, ${shippingAddress.country} ${shippingAddress.postal_code}
      </p>

      <table style="width: 100%; border-collapse: collapse; margin: 1rem 0;">
        <thead>
          <tr style="background-color: #f8fafc;">
            <th style="padding: 8px; text-align: left; border-bottom: 2px solid #e2e8f0;">Product</th>
            <th style="padding: 8px; text-align: center; border-bottom: 2px solid #e2e8f0;">Qty</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e2e8f0;">Price</th>
            <th style="padding: 8px; text-align: right; border-bottom: 2px solid #e2e8f0;">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div style="text-align: right; margin-top: 1rem;">
        <p style="color: rgb(51, 51, 51); font-size: 0.875rem;">
          Shipping: <strong>${shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</strong>
        </p>
        <p style="color: rgb(234, 88, 12); font-size: 1.25rem; font-weight: bold;">
          Total: $${total.toFixed(2)}
        </p>
      </div>

      <p style="color: rgb(51, 51, 51); font-size: 0.875rem; margin-top: 1rem;">
        Thank you for shopping with TechShop!
      </p>
    </div>
  `;
};

export default orderConfirmationTemplate;
