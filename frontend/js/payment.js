// Simulated payment processing
const PaymentSimulation = {
    processPayment(amount, cardDetails) {
        return new Promise((resolve) => {
            // Simulate API call delay
            setTimeout(() => {
                // Simulate successful payment 90% of the time
                const isSuccessful = Math.random() < 0.9;

                if (isSuccessful) {
                    resolve({
                        success: true,
                        transactionId: 'sim_' + Math.random().toString(36).substr(2, 9),
                        message: 'Payment processed successfully'
                    });
                } else {
                    resolve({
                        success: false,
                        message: 'Payment failed. Please try again.'
                    });
                }
            }, 1500);
        });
    },

    validateCard(number, expiry, cvv) {
        const errors = {};

        // Basic card number validation
        if (!/^\d{16}$/.test(number.replace(/\s/g, ''))) {
            errors.number = 'Invalid card number';
        }

        // Basic expiry validation (MM/YY)
        if (!/^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(expiry)) {
            errors.expiry = 'Invalid expiry date';
        } else {
            const [month, year] = expiry.split('/');
            const expDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
            if (expDate < new Date()) {
                errors.expiry = 'Card has expired';
            }
        }

        // Basic CVV validation
        if (!/^\d{3,4}$/.test(cvv)) {
            errors.cvv = 'Invalid CVV';
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    }
};

// Card input formatting
function formatCardNumber(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    input.value = value;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

// Initialize payment form
document.addEventListener('DOMContentLoaded', () => {
    const paymentForm = document.getElementById('payment-form');
    if (!paymentForm) return;

    const cardNumber = document.getElementById('card-number');
    const cardExpiry = document.getElementById('card-expiry');
    const cardCvv = document.getElementById('card-cvv');
    const submitButton = document.getElementById('submit-payment');
    const paymentStatus = document.getElementById('payment-status');

    // Add input formatting
    cardNumber?.addEventListener('input', () => formatCardNumber(cardNumber));
    cardExpiry?.addEventListener('input', () => formatExpiry(cardExpiry));

    paymentForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (!cardNumber || !cardExpiry || !cardCvv || !submitButton || !paymentStatus) return;

        // Reset status
        paymentStatus.textContent = '';
        paymentStatus.className = 'payment-status';

        // Validate card details
        const validation = PaymentSimulation.validateCard(
            cardNumber.value,
            cardExpiry.value,
            cardCvv.value
        );

        if (!validation.isValid) {
            const errorMessage = Object.values(validation.errors)[0];
            paymentStatus.textContent = errorMessage;
            paymentStatus.className = 'payment-status error';
            return;
        }

        // Disable form during processing
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';

        try {
            // Get cart total
            const cartTotal = calculateTotal(); // From shoppingCart.js

            // Process payment
            const result = await PaymentSimulation.processPayment(cartTotal, {
                number: cardNumber.value,
                expiry: cardExpiry.value,
                cvv: cardCvv.value
            });

            if (result.success) {
                paymentStatus.textContent = 'Payment successful!';
                paymentStatus.className = 'payment-status success';

                // Clear cart
                cartItems = [];
                saveCart();
                updateCartDisplay();

                // Redirect to success page after 2 seconds
                setTimeout(() => {
                    window.location.href = '../templates/order-success.html';
                }, 2000);
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            paymentStatus.textContent = error.message;
            paymentStatus.className = 'payment-status error';
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Pay Now';
        }
    });
});