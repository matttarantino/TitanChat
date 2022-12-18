# Getting Started with Running TitanChat Locally

## Available Scripts.. We Will Need Yarn installed on your local machine: https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable 

In the root directory of the project, you need to run yarn install

### `yarn install`

Additionally in the ./client, you need to run yarn install

### `yarn install`

Afterwards, in the root directory of the project, start server and client.

### `yarn run dev`


## Environment Setup

For s3 to work on Local Machines, we have to add the following.

### `./client/.env.local`

### `REACT_APP_AWS_ACCESS_KEY = AKIA6ICJUY2LLLVI7QMH,  REACT_APP_AWS_SECRET_KEY = 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`

For Server Authentication to Work, we have to add the rolling

### `./server/.env.local`

### `JWT_SECRET_STRING = somesecretstring`