import ColorService from '../../public/javascript/colorService'

const appColorTone = 'teal'
const appColors = ColorService(appColorTone, 'nfc')

const state = {
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false
  },
  appColorTone: appColorTone,
  appColors: appColors,
  pageColor: {
    highlight: appColors.lightAccent().color,
    offset: '#777777',
    background: '#86939d'
  },
  parchmentColorArray: ['#A1887F', '#FFD9A0', '#A1887F', '#A1887F', '#FFD9A0', '#A1887F'],
  avatarColorArray: ['#FFFFFF', '#777777'],
  recording: true,
  activeTag: false,
  tags: JSON.parse(localStorage.getItem('tags')),
  debug: {
    showTagHeader: true
  }
}
export default state
