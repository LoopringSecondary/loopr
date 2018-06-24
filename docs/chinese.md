## 关于Loopr钱包

Loopr是一款开源的，非托管的以太坊钱包和去中心化交易所。

## 特色
- 路印协议: 网页端的以太坊钱包，同时集成了路印协议。
- 解锁: 可以通过MetaMask,TREZOR,Ledger,Keystore,助记词，私钥，地址（观察模式）
- 资产:可以查看以太坊及token的余额，可以查看以太坊交易的
- 交易: 买卖token
- 空投: 绑定LRN和LRQ的地址
- 支持多种语言

## 技术栈

- React
- React-Router
- Redux
- [Redux-saga]( https://github.com/redux-saga/redux-saga): redux-saga 是一个用于管理应用程序 Side Effect（副作用，例如异步获取数据，访问浏览器缓存等）的 library。
- [Roadhog](https://github.com/sorrycc/roadhog): Roadhog 是一个包含 dev、build 和 test 的命令行工具。
- [Antd](https://github.com/ant-design/ant-design): 一个react 组件库。
- [Dva](https://github.com/dvajs/dva):基于 redux、redux-saga 和 react-router 的轻量级前端框架。

## 编译

```
npm install // 安装项目引用的包
npm start // 以开发模式启动
npm run build //编译构建项目
```

## 部署

1. clone 项目到本地

2. build项目

   ```
   npm run build
   ```

3. [注册](https://firebase.google.com/)firebase account(如果已经有账号，请继续下一步)

4. 安装 firebase-cli  
   ```
   npm install -g firebase-tools
   ```
5. deploy

   ```
   firebase deploy
   ```   
