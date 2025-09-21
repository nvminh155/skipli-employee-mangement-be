## PROJECT STRUCTURE

config: config of the app
constants: some variables to strict hard code
controllers: containing logic handle the requests
firebase: config firebase
lib: some custom library or library
middlewares: to check & handle jwt, auth, role
models: business logic
routes: defined the route of the endpoint
services: some another service through third party
sockets: handle socket channel (namespace)
utils: some utilities
.env.example: guid env


## HOW TO RUN
```bash
First, git clone it
Second, cd into the folder 

Then run:
npm i (to install the packages)

Finally,
npm start
# or
yarn start
# or
pnpm start
# or
bun start
```

Open [http://localhost:3005](http://localhost:3005) with your browser to see the result.
