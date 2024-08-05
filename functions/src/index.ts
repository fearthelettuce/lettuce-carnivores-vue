import admin from 'firebase-admin'
admin.initializeApp()
import stripeCheckoutController from './stripeCheckoutController'
import stripeWebhookController from './stripeWebhookController'

exports.stripeCheckoutController = stripeCheckoutController
exports.stripeWebhookController = stripeWebhookController
