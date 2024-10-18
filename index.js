require('dotenv').config()
const express = require('express')
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const app = express()

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    res.render('index.ejs')
})

app.post('/checkout', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Node.js and Express book'
                        },
                        unit_amount: 50 * 100
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.BASE_URL}/complete`,
            cancel_url: `${process.env.BASE_URL}/cancel`
        })
        res.redirect(303, session.url)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).send('An error occurred')
    }
})

app.get('/complete', (req, res) => {
    res.render('confirmation')
})

app.get('/cancel', (req, res) => {
    res.redirect('back')
})

app.listen(3000, () => console.log('Server started on http://localhost:3000'))