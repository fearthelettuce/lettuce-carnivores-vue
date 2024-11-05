Debug
firebase emulators:start --inspect-functions
Start debug in VS Code

Run Locally

npm run serve
In the vue app, edit stripe.ts to uncomment the line with connectFunctionsEmulator(functions,'127.0.0.1', 5001), then run that locally
