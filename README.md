# Norima-ship

A "Battleship"-style game where we can explore libraries we've been dying to try while doing something during this pandemic!

## Setup

Currently this thing doesn't do much and, as a result, doesn't require much setup. All you have to do is:

- clone
- `npm ci`
- and run via `node index.js`

You now have a server humming away in the back that you should be able to hit at `http://localhost:3000`.

## AWS

Yes! We have a free-tier server for fun times. Ask me for the key/creds so that you can work with the AWS infrastructure.

We have no CI/CD capability right now (that could change) so we're literally throwing the following files over:

- `index.js` -> `/home/ec2-user/norimaship/index.js`
- `package-lock.json` -> `/home/ec2-user/norimaship/package-lock.json`
- `package.json` -> `/home/ec2-user/norimaship/package.json`

Then using a tool called pm2 to manage the daemon process. You can start it up with `pm2 start index.js`.

You should be able to hit the server's heartbeat at: `http://ec2-3-21-164-80.us-east-2.compute.amazonaws.com:3000/heartbeat`