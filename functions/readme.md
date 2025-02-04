Debug
Run in terminal:
firebase emulators:start --inspect-functions

Start debug attach in VS Code with this configuration:
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach",
      "port": 9229,
      "restart": true,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}

Run Locally
npm run serve
In the vue app, edit stripe.ts to uncomment the line with connectFunctionsEmulator(functions,'127.0.0.1', 5001), then run that locally

Deploy one function:
firebase deploy --only functions:stripeWebhookController
