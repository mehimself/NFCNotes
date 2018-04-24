# NFC Notes web application
our web presence in the making

## Quick start


- *Make sure you have Node version >= 6.0 and NPM >= 3*
- *upgrade babel to 7 https://github.com/babel/babel-upgrade*
- *install vuetify https://vuetifyjs.com/en/getting-started/quick-start*
- *install css-loader https://github.com/webpack-contrib/css-loader*

```bash
# Clone project code 
git clone https://github.com/mehimself/NFCNotes.git

# goto dir
cd NFCNotes

# install with npm or yarn
npm install

# start the develop server
npm start

# install as service

# pull and update production server
sudo systemctl stop NFCNotes --now
git pull
npm run deploy:prod
sudo systemctl start NFCNotes --now
```
