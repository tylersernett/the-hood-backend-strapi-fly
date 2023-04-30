'use strict';
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)
//const { serv_config } = require("../../../../constants");

/**
 * order controller
 */

const baseURL = serv_config.url.BASE_URL;
const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({ //access values within strapi
    async create(ctx) {
        //sent from Checkout.jsx
        const { products, userName, email } = ctx.request.body;
        try {
            // retrieve item information -- grab from server so client cannot manipulate
            const lineItems = await Promise.all(
                products.map(async (product) => {
                    const item = await strapi
                        .service("api::item.item")
                        .findOne(product.id);

                    return {
                        price_data: {
                            currency: "usd",
                            product_data: {
                                name: item.name,
                            },
                            unit_amount: item.price * 100,
                        },
                        quantity: product.count,
                    };
                })
            );

            // create a stripe session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ["card"],
                customer_email: email,
                mode: "payment",
                success_url: `https://tylersernett.github.io/react-ecommerce/checkout/success`,
                cancel_url: `https://tylersernett.github.io/react-ecommerce`,
                line_items: lineItems,
            });

            // create the item
            await strapi
                .service("api::order.order")
                .create({ data: { userName, products, stripeSessionId: session.id } });

            // return the session id
            return { id: session.id };
        } catch (error) {
            ctx.response.status = 500;
            return { error: { message: "There was a problem creating the charge" } };
        }
    }
}));
