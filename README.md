# NFC Notes web application
Raspberry Pi app for interactive note taking during meetings. Start recording the meeting on the /record page. Then scan an NFC object any time in the meeting to create a bookmark for fast playback of what was just discussed. Adjust the audio clip length and supply notes on the /review page

## Quick start

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
