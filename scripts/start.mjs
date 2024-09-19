// Copyright @ 2018-present x.iejiahe. All rights reserved.
// See https://github.com/xjh22222228/nav

import fs from 'fs'
import path from 'path'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js'
import timezone from 'dayjs/plugin/timezone.js'
import defaultDb from './db.mjs'
import {
  TAG_ID1,
  TAG_ID2,
  TAG_ID3,
  TAG_ID_NAME1,
  TAG_ID_NAME2,
  TAG_ID_NAME3,
  getWebCount,
  setWeb,
  replaceJsdelivrCDN,
} from './util.mjs'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const packagePath = path.join('.', 'package.json')
const packageJson = JSON.parse(fs.readFileSync(packagePath).toString())
const configJson = {
  version: packageJson.version,
  gitRepoUrl: packageJson.gitRepoUrl,
  provider: packageJson.provider,
  branch: packageJson.branch,
  hashMode: packageJson.hashMode,
  address: packageJson.address,
  email: packageJson.email,
  port: packageJson.port,
  datetime: dayjs.tz().format('YYYY-MM-DD HH:mm'),
}
fs.writeFileSync(path.join('.', 'nav.config.json'), JSON.stringify(configJson))

const dbPath = path.join('.', 'data', 'db.json')
const internalPath = path.join('.', 'data', 'internal.json')
const settingsPath = path.join('.', 'data', 'settings.json')
const tagPath = path.join('.', 'data', 'tag.json')
const searchPath = path.join('.', 'data', 'search.json')

let internal = {}
let db = []
let settings = {}
let tags = []
let search = []
try {
  db = JSON.parse(fs.readFileSync(dbPath).toString())
} catch (error) {
  db = defaultDb
}
try {
  internal = JSON.parse(fs.readFileSync(internalPath).toString() || '{}')
  settings = JSON.parse(fs.readFileSync(settingsPath).toString() || '{}')
  tags = JSON.parse(fs.readFileSync(tagPath).toString() || '[]')
  search = JSON.parse(fs.readFileSync(searchPath).toString() || '[]')
} catch (error) {
  console.log('parse JSON: ', error.message)
}

{
  if (!search.length) {
    search = [
      {
        name: '站内',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg',
        placeholder: '站内搜索',
        blocked: false,
        isInner: true,
      },
      {
        name: '百度',
        url: 'https://www.baidu.com/s?wd=',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/baidu.svg',
        placeholder: '百度一下',
        blocked: false,
        isInner: false,
      },
      {
        name: 'Google',
        url: 'https://www.google.com/search?q=',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/google.svg',
        blocked: false,
        isInner: false,
      },
      {
        name: '必应',
        url: 'https://cn.bing.com/search?q=',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/bing.svg',
        blocked: false,
        isInner: false,
      },
      {
        name: 'GitHub',
        url: 'https://github.com/search?q=',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/github.svg',
        placeholder: 'Search GitHub',
        blocked: false,
        isInner: false,
      },
      {
        name: '知乎',
        url: 'https://www.zhihu.com/search?type=content&q=',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/zhihu.svg',
        blocked: false,
        isInner: false,
      },
      {
        name: '豆瓣',
        url: 'https://search.douban.com/book/subject_search?search_text=',
        icon: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/douban.svg',
        placeholder: '书名、作者、ISBN',
        blocked: false,
        isInner: false,
      },
    ]
    fs.writeFileSync(searchPath, JSON.stringify(search), {
      encoding: 'utf-8',
    })
  }
}

{
  const isEn = settings.language === 'en'
  const desc = isEn
    ? 'The system is built-in and cannot be deleted'
    : '系统内置不可删除'
  if (!Array.isArray(tags)) {
    tags = []
  }
  const a = tags.some((item) => item.id === TAG_ID1)
  if (!a) {
    tags.push({
      id: TAG_ID1,
      name: isEn ? 'Chinese' : TAG_ID_NAME1,
      color: '#2db7f5',
      createdAt: '',
      desc,
      isInner: true,
    })
  }
  const b = tags.some((item) => item.id === TAG_ID2)
  if (!b) {
    tags.push({
      id: TAG_ID2,
      name: isEn ? 'English' : TAG_ID_NAME2,
      color: '#f50',
      createdAt: '',
      desc,
      isInner: true,
    })
  }
  const c = tags.some((item) => item.id === TAG_ID3)
  if (!c) {
    tags.push({
      id: TAG_ID3,
      name: TAG_ID_NAME3,
      color: '#108ee9',
      createdAt: '',
      desc,
      isInner: true,
    })
  }
  tags = tags.filter((item) => item.name && item.id)
  fs.writeFileSync(tagPath, JSON.stringify(tags), {
    encoding: 'utf-8',
  })
}

{
  const banner1 =
    'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/banner1.jpg'
  const banner2 =
    'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/banner2.jpg'
  const backgroundImg =
    'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/background.jpg'

  settings.favicon ??=
    'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/nav/logo.svg'
  settings.language ||= 'zh-CN'
  settings.loading ??= 'random'
  settings.runtime ??= dayjs.tz().valueOf()
  settings.allowCollect ??= true
  settings.email ||= configJson.email || ''
  settings.showGithub ??= true
  settings.showLanguage ??= true
  settings.showRate ??= true
  settings.openSearch ??= true
  settings.title ??= '发现导航 - 精选实用导航网站'
  settings.description ??= '发现导航是一个轻量级免费且强大的导航网站'
  settings.keywords ??= '免费导航,开源导航'
  settings.theme ??= 'Light'
  settings.actionUrl ??= ''
  settings.appTheme ??= 'App'
  settings.openSEO ??= !configJson.address
  settings.headerContent ??= ''
  settings.footerContent ??= `
<div>共收录$\{total\}个网站</div>
<div>Copyright © 2018-$\{year} $\{hostname}, All Rights Reserved</div>  
`.trim()
  settings.showThemeToggle ??= true

  settings.lightDocTitle ||= ''
  settings.lightCardStyle ||= 'standard'
  settings.lightOverType ||= 'overflow'
  settings.lightFooterHTML ||= ''
  settings.simThemeImages ||= [
    {
      src: banner1,
      url: '',
    },
    {
      src: banner2,
      url: '',
    },
  ]
  settings.simThemeDesc ??=
    '这里收录多达 <b>${total}</b> 个优质网站， 助您工作、学习和生活'
  settings.simCardStyle ||= 'original'
  settings.simOverType ||= 'overflow'
  settings.simThemeHeight ??= 0
  settings.simThemeAutoplay ??= true
  settings.simDocTitle ||= ''
  settings.simTitle ||= ''
  settings.simFooterHTML ||= ''
  settings.superCardStyle ||= 'column'
  settings.superOverType ||= 'overflow'
  settings.superFooterHTML ||= ''

  settings.superDocTitle ||= ''
  settings.superTitle ||= ''
  const defImgs = [
    //{
      //src: 'https://gcore.jsdelivr.net/gh/xjh22222228/nav-web@image/nav-1717494364392-ad.jpg',
      //url: 'https://haokawx.lot-ml.com/Product/index/454266',
    //},
    //{
      //src: 'https://gcore.jsdelivr.net/gh/xjh22222228/public@gh-pages/img/10.png',
      //url: '',
    //},
  ]
  settings.superImages ??= defImgs
  settings.lightImages ??= defImgs
  if (!Array.isArray(settings.superImages)) {
    settings.superImages = defImgs
  }
  if (!Array.isArray(settings.lightImages)) {
    settings.lightImages = defImgs
  }
  settings.sideTitle ||= ''
  settings.sideDocTitle ||= ''
  settings.sideCardStyle ||= 'example'
  settings.sideFooterHTML ||= ''
  settings.sideThemeHeight ??= 0
  settings.sideThemeAutoplay ??= true
  settings.sideCollapsed ??= false
  settings.sideThemeImages ||= [
    {
      src: banner2,
      url: '',
    },
    {
      src: banner1,
      url: '',
    },
  ]
  settings.shortcutTitle ??= ''
  settings.shortcutDocTitle ||= ''
  settings.shortcutDockCount ??= 6
  settings.shortcutThemeShowWeather ??= true
  settings.shortcutThemeImages ??= [
    {
      src: backgroundImg,
      url: '',
    },
  ]
  settings.checkUrl ??= false
  settings.spiderIcon ??= 'NO'
  settings.spiderDescription ??= 'NO'
  settings.spiderTitle ??= 'NO'
  settings.spiderQty ??= 200
  settings.spiderTimeout ??= 6
  settings.spiderTimeout = Number(settings.spiderTimeout) || 6
  settings.loadingCode ??= ''

  settings.appCardStyle ??= 'retro'
  settings.appDocTitle ||= ''
  settings.gitHubCDN ||= 'gcore.jsdelivr.net'

  // 替换CDN
  search = search.map((item) => {
    item.icon = replaceJsdelivrCDN(item.icon, settings)
    return item
  })
  settings.favicon = replaceJsdelivrCDN(settings.favicon, settings)
  settings.simThemeImages = settings.simThemeImages.map((item) => {
    item.src = replaceJsdelivrCDN(item.src, settings)
    return item
  })
  settings.superImages = settings.superImages.map((item) => {
    item.src = replaceJsdelivrCDN(item.src, settings)
    return item
  })
  settings.lightImages = settings.lightImages.map((item) => {
    item.src = replaceJsdelivrCDN(item.src, settings)
    return item
  })
  settings.sideThemeImages = settings.sideThemeImages.map((item) => {
    item.src = replaceJsdelivrCDN(item.src, settings)
    return item
  })
  settings.shortcutThemeImages = settings.shortcutThemeImages.map((item) => {
    item.src = replaceJsdelivrCDN(item.src, settings)
    return item
  })
  fs.writeFileSync(settingsPath, JSON.stringify(settings), {
    encoding: 'utf-8',
  })
}

const { userViewCount, loginViewCount } = getWebCount(db)
internal.userViewCount = userViewCount < 0 ? loginViewCount : userViewCount
internal.loginViewCount = loginViewCount
fs.writeFileSync(internalPath, JSON.stringify(internal))
fs.writeFileSync(dbPath, JSON.stringify(setWeb(db, settings, tags)))
