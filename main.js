const {
  app,
  BrowserWindow,
  ipcMain
} = require('electron')

const common = require('./src/model/common');

// const {lowdb}   = require('lowdb')
let win

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600
  })
  win.loadFile('index.html')
  win.webContents.openDevTools()  // 主窗口打开调试
  win.on('closed', () => {
    win = null
  })
}



ipcMain.on('viewChange', (event, arg) => {
  win.loadFile(arg)
  // win.webContents.send("ok")
})

ipcMain.on('sendCMD', function (event, arg) {
  win.send('CmdList', arg)
})

ipcMain.on('backHome', (event, arg) => {
  win.loadFile('index.html')
})

let driver
ipcMain.on('openBrowser', function (event, arg) { //打开浏览器的方法，arg控制状态及地址
  let start_type = arg.type
  var html = "./src/view/webDriver.html"
  driver = new BrowserWindow({
    width: 1000,
    height: 800,
    fullscreenable: true,
    contextIsolation: true,
    webPreferences: {
      webSecurity: false
    }
  })
  // driver.openDevTools() // 附加浏览器调试
  driver.webContents.on('did-attach-webview', () => {
    driver.webContents.send('openURL', arg.url)
    console.log("start_type ",start_type)
    if (start_type == common.START_TYPE.RUNCASE) {
      console.log("send cmdLIst")
      driver.webContents.send('CMDLIST', arg)
    }
  })
  var path = require("path")
  var url = require("url")
  win.send('showURL', url.format({
    pathname: path.join(__dirname, html),
    protocol: 'file:',
    slashes: true
  }))
  driver.loadURL(
    url.format({
      pathname: path.join(__dirname, html),
      protocol: 'file:',
      slashes: true
    })
  )
  driver.setMenu(null) // 隐藏菜单栏

  driver.on('closed', (event, arg) => { //录制完毕，存储用例
    driver = null
    win.send('BrowserClosed', start_type)
  })
})


ipcMain.on('packtest', (event, arg) => {
  var webDriver = new BrowserWindow({
    width: 800,
    height: 600
  })
  //webDriver.webContents.openDevTools() //开启调试
  webDriver.loadFile(arg)
  webDriver.on('closed', () => {
    webDriver = null
  })
  // win.webContents.send("ok")
})

app.on('ready', createWindow)
// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})