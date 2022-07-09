const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;


/**
 * 生成 feeds 配置
 * @param {*} name
 * @param {*} uri
 * @param {*} branch
 * @returns
 */
 const GenerateFeedsConfig = (name, uri, branch) => {
  exec(`git clone --depth=1 ${uri} -b ${branch} ${name}`);
  const revision = exec(`cd ${name} && git log -1 --pretty=%H`).toString().trim();
  exec(`cd ..`);
  exec(`rm -rf ${name}`);
  const config = `  - name: ${name}
    uri: ${uri}
    revision: ${revision}`;
  return config;
}

/**
 * 生成 feeds 配置文件
 */
const GenerateYml = () => {
  // 读取 feeds 配置文件
  const feedsPath = path.resolve(process.cwd(), 'scripts', 'feeds.json')
  const feeds = require(feedsPath);
  // 生成 feeds 配置
  const config = feeds.map(item => GenerateFeedsConfig(item.name, item.uri, item.branch)).join('\n');
  // 生成配置文件路径
  const filePath = path.resolve(process.cwd(), 'glinet-ax1800.yml');
  // 写入配置文件
  fs.writeFileSync(filePath, `---
profile: glinet_ax1800
description: Build image for the GL.iNET AX1800
image: bin/targets/ipq807x/ipq60xx/openwrt-ipq807x-glinet_ax1800-squashfs-sysupgrade.tar
feeds:
${config}

include:
  - target_wlan_ap-gl-ax1800-common-5-4

packages:
  # 系统高级设置
  - luci-app-advancedsetting
  # 磁盘管理工具
  - luci-app-diskman
  # clash的图形代理软件
  - luci-app-openclash
  # 阿里云ddns插件
  - luci-app-aliddns
  # 依IP地址限速
  - luci-app-eqos
  # 动态域名 DDNS
  - luci-app-ddns
  # smartdns DNS防污染
  - luci-app-smartdns
  # 修改老竭力主题名
  - luci-theme-argonne
  # argonne主题设置
  - luci-app-argonne-config
  # 解锁网易云音乐
  - luci-app-unblockneteasemusic
  # 终端
  - luci-app-ttyd
  # 文件传输
  - luci-app-filetransfer
  # Turbo ACC 网络加速(支持 Fast Path 或者 硬件 NAT)
  - luci-app-turboacc
  # wol 网络唤醒
  - luci-app-wol
  # ZeroTier内网穿透
  - luci-app-zerotier
  # MWAN3负载均衡
  - luci-app-mwan3
  # MWAN3分流助手
  - luci-app-mwan3helper
  # 释放内存
  - luci-app-ramfree
  # 流量智能队列管理(QOS)
  - luci-app-sqm
  # KMS服务器设置
  - luci-app-vlmcsd
  # 迅雷快鸟
  - luci-app-xlnetacc
  # 实时流量监测
  - luci-app-wrtbwmon
  # 多拨虚拟网卡
  - luci-app-syncdial
  # BT下载工具
  - luci-app-transmission
  # 支持计划重启
  - luci-app-autoreboot
  # 京东签到服务
  - luci-app-jd-dailybonus`);
}

GenerateYml();