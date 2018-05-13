export default {
  global: {
    all: '全部',
    market: '市场',
    options: '操作',
    amount: "{amount,number}",
    no_data: "暂时没有数据",
    comingsoon: "即将到来",
    wallet: "钱包",
    price:'价格',
    yes:"是",
    no:"否",
    amount_label:'数量',
    total:'总计',
    time:'时间',
    custom:'自定义',
    gas:'油费',
  },
  userguide:{
    title:'新手指引',
    visibe:true,
  },
  testtips:{
      title:'正在测试中',
      description:`
    <div className="fs12 text-nowrap">
        1. 交易模式与传统交易所显著不同
    </div>
    <div className="fs12">
        2. 当前版本的内容仅供参考
    </div>
    <div className="fs12">
        3. 正式版本发布后可正常使用
    </div>
  `,
  tradetips_title:"交易提示（Beta3期间）",
  tradetips_description:`
    1. 交易地址上必须持有1000+LRC（仅限于公测期间）
    <br />
    2. 每个订单的成交额不能低于500元（仅限于公测期间）
  `,
  trades_faq:'交易FAQ',
  trades_faq_arr:[
    {
        category:'费用',
        title:'交易过程中哪些操作需要花钱？哪些操作不需要花钱？',
        content:`
            下单时：无需支付任何费用，也不冻结任何资产
        <br />
        订单成交后：需要支付订单金额，由智能合约在订单成交以后从用户地址里自动扣除对。
        <br />
        订单成交后：可能需要支付交易撮合费（LRC）给矿工, 由智能合约在订单成交以后从用户地址里自动扣除LRC。
        <br />
        订单成交后：可能不需要支付交易撮合费，同时还能获得部分交易撮合奖励（交易分润）
        <br />
        订单未成交：无需支付任何费用
        <br />
        订单自动取消：无需支付任何费用（订单过期之后会自动取消）
        <br />
        订单手动取消：需支付的 ETH 油费
        <br />
        <span class="color-black-1 font-weight-bold">与传统交易所相比，路印协议的交易费用方面：</span>
        <br />
        无平台手续费：去中心化交易，没有平台手续费，路印基金也不收取任何费用。
        <br />
        无充值油费：路印协议无需充值，无需消耗充值的油费
        <br />
        无提现手续费：路印协议无需提现，无需支付提现的手续费
        <br />
        可能有交易额外收益：部分情况下，交易双方可能获得撮合奖励(LRC)
        <br />
        可能有矿工撮合费：订单成交需要向矿工支付交易撮合费（LRC）
        `,
    },
    {
        category:'费用',
        title:'为什么我的订单成交价比我的卖价更高？或者比我的买价更低？',
        content:`
            B用户想要以 $1 价格出售LRC
            <br />
            A用户想要以 $1.2 价格购买LRC
            <br />
            成交价格可能是: $1.16 （根据矿工和交易双方的交易高级设置动态计算出来）
            <br />
            交易的结果是：三方获利。
            <br />
            A用户的实际购买价格更低，
            <br />
            B用户的实际出售价格更高，
            <br />
            矿工获得了一定的撮合分润，
            <br />
            所有的奖励都是从订单价差里得来的。
        `,
    },
    {
        category:'费用',
        title:'怎么更合理的设置交易撮合费(LRC)？',
        content:`
            即将发布
        `,
    },
    {
        category:'速度',
        title:'为什么我的订单一直没有成交或者成交速度很慢？',
        content:`
            可能原因1：您的订单没有与之价格匹配或者接近的买单/卖单
            <br />
            可能原因2：您的订单的 LRC 交易撮合费 过小：矿工的撮合收益（LRC撮合费为主）小于 撮合成本（以太交易的油费）, 导致矿工不撮合您的订单。
            <br />
            可能原因3：您的订单已经被撮合了，并且已经被提交到以太网络，但是以太网络非常拥堵，导致交易无法确认（几分钟到几十分钟不等，甚至更长时间）
        `,
    },
    {
        category:'速度',
        title:'从下单到交易成交需要多长时间？',
        content:`
            从下单到成交的时间由两部分组成：
           <br />
           交易撮合时间（矿工挖掘环路）：如果存在匹配的买单和卖单，并且矿工有撮合收益（订单撮合费 > 矿工撮合成本），你的订单很快就会被矿工撮合（几秒以内）。
           <br />
           交易提交时间（矿工提交环路）：矿工会把撮合成功的交易提交到以太网络，提交时间受以太网络拥堵情况的限制，从十几秒到几十分钟不等。
           <br />
           结论：交易完成的时间最快十几秒，慢则几十分钟甚至更长（以太网络的拥堵情况起着决定性的因素）
        `,
    },
    {
        category:'速度',
        title:'如何比其他人更快地抢到订单？',
        content:`
            矿工优先选择撮合收益最大的订单进行撮合交易。
            <br />
            矿工撮合收益 = 交易撮合费（LRC Fee） +  交易分润（订单价差）
            <br />
            当出现匹配的订单时，矿工会优先选择 LRC Fee 更高的订单进行撮合（价格相同或者接近情况下）。
            <br />
            所以：适当提高 撮合费（LRC Fee）会帮助您更快的抢到订单。
        `,
    },
    {
        category:'深度',
        title:'为什么我的订单没有出现在深度里？',
        content:`
            可能原因1：您的订单和其他用户的订单价格相同，进行了深度合并。
            <br />
            可能原因2：你的订单金额 大于 您的账户余额（您无法支付订单金额）
            <br />
            可能原因3：你的订单已经过期或者接近过期
            <br />
            可能原因4：你的订单剩余的金额已经很少（尾单/灰尘单）
        `,
    },
    {
        category:'深度',
        title:'为什么交易深度中出现买价比卖价更高的订单？',
        content:`
            即将发布
        `,
    },
    {
        category:'资产',
        title:'交易后我的资产如何提取？',
        content:`
            路印协议不托管你的任何数字资产，交易前无需充值，交易后无需提现。
            <br />
            交易过程中，您的所有的以太数字资产一直在您的以太地址里。
            <br />
            交易完成之后，智能合约会自动把交易的资产打入您的以太地址里。
            <br />
            任何时候，您可以通过任意的第三方钱包查看和管理您的数字资产。
        `,
    },
  ],
},

  version: {
    label: 'Beta3',
    title: 'Beta3（仅对超前的测试者开放）',
    description: 'Loopr是开源的，非托管的以太坊钱包。请谨慎的测试，路印基金会不会承担您任何数字资产的损失。',
    extra: '体验版在持续优化完善，更新发布比较频繁，遇到各种问题，请大家体谅',
    feedback: '问题反馈',
    feedback_submit: '提交问题',
    roadmap_label: '了解详情',
    roadmap_title: '路印钱包开发路线图',
    version: '当前版本',
    update_time: '最近更新',
  },
  feedback: {
    email_to: "help@loopring.org",
    email_subject: "路印网页钱包问题反馈",
    email_body: `
## 我有一个问题\n
问题名称：（必填）\n
问题分类：○ 解锁钱包 ○ 生成钱包 ○ 空投绑定 ○ 转账收款 ○ 买卖交易 ○ 订单成交 ○ 其他 （单选）\n
如何重新你的问题：第1步：      第2步：      第3步： \n
你想得到的结果是：\n
实际得到的结果是：\n
附件上传：\n

## 我有一个优化建议\n
建议名称：（必填）\n
建议分类：○ 解锁钱包 ○ 生成钱包 ○ 空投绑定 ○ 转账收款 ○ 买卖交易 ○ 订单成交 ○ 其他 （单选）\n
你希望得到的结果是：\n
你实际得到的结果是：\n
你认为你遇到问题是：\n
你解决问题的建议是：（选填）\n
附件上传：\n


## 测试环境信息\n
钱包类型：{wallet}\n
钱包地址：{address}\n
电脑系统：{os}\n
浏览器：{browser}\n
`
  },
  navbar: {
    home: "首页",
    trade: "交易",
    dex: "去中心交易",
    wallet: "钱包",
    settings: "设置",
    portfolio: "投资组合",
    account: "账户",
    subs: {
      copy: '复制',
      copy_success: '复制地址成功',
      copy_failed: '复制地址失败',
      unlock: '解锁钱包',
      generate: '生成钱包',
      export: "导出Keystore",
      help: '帮助',
      tools: '工具',
      qrcode: '二维码',
      receive: '收款',
      send: '转账',
      trade: '交易',
      airdrop: '空投',
      quit: '退出',
      address: '地址',
      feedback: '问题反馈',
    },
    refresh_page_tip_title: "为什么刷新/关闭页面后需要重新解锁钱包？",
    refresh_page_tip_description: "出于安全的考虑，钱包不会存储你的任何的安全信息，所以刷新或者关闭页面后，需要您重新解锁。",
  },
  order: {
    buy: '买',
    sell: '卖',
    receive: '接收',
    convert: "转换",
    buying: "您正在购买",
    selling: "您正在出售",
    lrcfee: "订单交易费",
    margin: "分润比例",
    since: "订单生效时间",
    till: "订单失效时间",
    sign: "签名信息",
    raw: "未签名的订单",
    signed: "签名的订单",
    place_tip: "提交订单是免费的，不需要消耗gas",
    placing_order: "下单结果",
    place_success: "下单成功!",
    place_success_tip: '恭喜, 您的订单已经可以等待交易',
    place_warn: '您的订单只能被部分撮合',
    submit: "提交订单",
    confirm_cancel_order: "您确定要取消该笔订单？",
    confirm_cancel_all: "您确定要取消全部 {pair} 订单？",
    cancel_order_success: "取消订单成功",
    cancel_order_failed: "取消订单失败",
    cancel_all_success: "取消全部{pair}订单成功",
    cancel_all_failed: "取消全部{pair}订单失败",
    yes: "确认",
    no: "取消",
    cancel_all: "取消全部",
    refresh: "刷新",
    buy_token: "买 {token}",
    receive_token: "接收 {token}",
    convert_token: "转换 {token}",
    why_buy_price_avaliable_but_could_not_deal:`
    <div class="p5">
        <div class="fs14 lh25"> 订单深度提示 </div>
        <div class="fs12"> 1、该深度可能正在撮合中：矿工需要一些时间提交以太坊交易  </div>
        <div class="fs12"> 2、该深度可能已不被撮合：矿工获得的撮合收益（LRC Fee）小于撮合成本（以太交易油费）  </div>
    </div>
    `
  },
  ticker: {
    last: '最新价',
    change: '涨跌',
    low: '最低价',
    high: '最高价',
    vol: '成交量',
    market: '市场',
    favorites: '自选',
    select_a_market:'选择交易市场',
    back_to_wallet:'返回钱包',
  },
  exchanges: {
    loopr: '路印DEX 市场行情',
    binance: '币安 市场行情',
    okex: 'Okex 市场行情',
    huobi: '火币 市场行情',
  },
  home: {
    title: '路印钱包',
    subtitle: '不托管资金的以太钱包和去中心化交易所',
    beta_notification_title: '想尽早体验Loopr?',
    beta_notifycation_content: '目前Loopr钱包还未正式发布，当前版本仅供尝鲜体验'
  },
  buttons: {
    unlock_wallet: '解锁钱包',
    generate_wallet: '生成钱包',
    try_demo: '演示钱包',
  },
  tabs: {
    my_open_orders: '当前订单',
    my_recent_trades: '历史成交',
    my_portfolio: '投资分析',
    my_assets: '我的资产',
    my_orders: '我的订单',
    my_trades: '历史成交',
  },
  txs: {
    title: '交易',
    status: '状态',
    status_pending: '处理中',
    status_success: '成功',
    status_failed: '失败',
    type: '类型',
    type_transfer: '转账',
    type_convert: '转换',
    type_convert_title_eth: 'ETH 转换为 WETH',
    type_convert_title_weth: 'WETH 转换为 ETH',
    type_receive: '收款',
    type_others: '其他',
    type_lrc_fee: 'LRC撮合费',
    type_lrc_reward: 'LRC撮合奖励',
    type_sell: '卖出',
    type_buy: '买入',
    buy: "购买",
    type_enable: '授权',
    type_enable_title: "授权 {symbol} 进行撮合交易",
    type_transfer_title: "转出 {symbol}",
    type_receive_title: "接收 {symbol}",
    type_buy_title:"买入 {symbol}",
    type_sell_title:"卖出 {symbol}",
    cancel_order: '取消订单',
    cancel_all: '取消全部订单',
    cancel_pair_order: "取消{pair}订单",
    others: "其他",
    balance_not_enough_title:"您的{token}余额不足!",
    balance_not_enough: "您的余额是{balance}{token}，但是您的订单全部成交需要{needed}{token}，否则只能部分成交",
    open_orders: "进行中订单",
    value: "金额",
    tx_hash: "交易Hash",
    block_num: "块高度",
    to: "接收地址",
    confirm_time: "确认时间",
    tx_detail: "交易详情",
    success: "成功",
    failed: "失败",
    pending: "进行中",
    no_txs: '暂无交易',
    resend: "重发",
    resend_tips: "如果希望尽快确认，建议您提高Gas价格重新发送该交易。两笔交易只有一笔会被最终确认，只会有一笔交易会被收取矿工费。",
    not_resend_tips: "该交易已经被确认，无需重新发送",
    resend_success: "重新发送交易成功",
    resend_failed: "重新发送交易失败",
    can_not_resend: "无法发送",
    not_detail: "无法获得该交易的详细信息",
    resend_title:"该交易长时间未被确认",
    margin_split:"分润",
    fill_buy:"买入",
    fill_sell:"卖出",
    miner_pay:"矿工支付了这个交易的油费哦"
  },
  orders: {
    order: "订单",
    time: "时间",
    market: '市场',
    status: '状态',
    status_opened: '进行中',
    status_completed: '已成交',
    status_canceled: '已取消',
    status_expired: '已过期',
    side: '方向',
    side_sell: '卖',
    side_buy: '买',
    create_time: '提交时间',
    update_time: '更新时间',
    amount: '数量',
    price: '价格',
    total: '金额',
    LrcFee: 'LRC撮合费',
    LrcReward:"LRC撮合奖励",
    filled: '成交率',
    options: "动作",
    balance_not_enough: "{token} 余额不足!",
    balance: "余额",
    required: "要求",
    lacked: "缺少",
    receive: "接收 {token}",
    buy: "买 {token}",
    convert: "转ETH到WETH",
    token_not_enough: "代币数量不足",
    already_add: "您已经添加过该代币!",
    sell_amount: '卖出数量',
    buy_amount: '买入数量',
    order_detail: "订单详情",
    basic_detail: "基础详情",
    fill_detail: "撮合详情",
    cancel_cost_gas:"取消订单会消耗Gas",
    auto_cancel_not_cost_gas:"订单自动失效不会消耗ETH Gas",
    manual_cancel_cost_gas:"手动取消订单会消耗ETH Gas",
    cancel_order:"取消订单",
    canceling:"取消中",
    order_canceling:"订单取消中",
    order_validity:"订单有效期",
    wait_expire:"等待订单自动失效",
    confirm_to_cancel:"确认取消订单",
    order_will_expire:"距离订单自动失效还有",
    expire_duration:"{days,plural,=0{} other {# 天}} {hours,plural,=0{} other {# 小时}} {minutes,plural,=1{1 分钟} other {# 分钟}}",
    open_order_list:"进行中订单"
  },
  settings: {
    preference: "偏好",
    trade: "交易",
    relay: "中继",
    language: "语言",
    currency: "货币",
    timezone: "时区",
    reset: "重置",
    contract: "合约版本",
    ttl: "有效期",
    ttl_tip: "请输入合法的整数",
    lrcfee: "LRC 手续费",
    margin: "分润比例",
    gasPrice: "Gas价格",
    slow: "慢",
    fast: "快",
    edit: "编辑",
    save: "保存",
    delete: "删除",
    addRelay: "添加中继",
    editRelay: "编辑中继",
    chooseRelay: "选择中继",
    relayName: "中继名称",
    relayUrl: "中继URL地址",
    relayName_tip: "请输入合法，不同的中继名称",
    relayUrl_tip: "请输入合法的URL地址"
  },
  trade: {
    order_book:'最新挂单',
    trade_history:'最新成交',
    orderForm: "订单信息",
    sell: "卖出",
    buy: "买入",
    balance: "余额",
    price: "单价",
    price_verification_message: "请输入合法的单价",
    amount: "数量",
    amount_verification_message: "请输入合法的数量",
    available_amount: "有效数量",
    available: "可用",
    total: "总计",
    advanced: "高级选项",
    time_to_live: "有效时间",
    time_to_live_advance:'有效时间',
    more: "更多",
    popular_option: "常用选项",
    integer_verification_message: "请输入数字类型",
    second: "秒",
    minute: "分钟",
    hour: "小时",
    day: "天",
    week: "周",
    month: "月",
    lrc_fee: "撮合费",
    margin_split: "分润比例",
    place_order: "提交订单",
    unlock_your_wallet: "解锁你的钱包",
    to_trade: "去交易",
    lrcFee_increased: "通过您的设定，您当前订单需要支付的LRC Fee 是 {userSet}LRC, 我们自动增加至下单允许最小的值: {increased}LRC, 您是否继续下单?",
    notice: "请注意",
    placing_order: '订单提交结果',
    place_order_failed: "订单提交失败 !",
    sign_order_failed:"订单签名失败！",
    not_inWhiteList: "您不在白名单中",
    not_allow: "路印钱包仍在内测阶段,请耐心等待正式版本发布!",
    you_should_do_things: "你可以按以下提示尝试",
    failed_reasons: "失败原因如下：",
    why: "为什么",
    balance_not_enough: '{token} 余额不足, 还需要 {required}',
    receive: '去收款',
    to_buy: '去购买',
    time_to_live_input_place_holder: '订单有效时间是多久？',
    ring: "环路",
    tips_time_to_live: "您希望提交的订单有效时间是多久？</br>设置较长的有效时间，可以给矿工足够时间寻找可匹配订单，提高撮合成功率。</br>如果设置的有效时间很短，您的订单有可能无法完成撮合。</br>推荐您将有效时间设置为大于1小时。",
    tips_lrc_fee: "LRC Fee是订单撮合成功后您愿意支付矿工的gas，费用按订单金额的千分比计算。</br>矿工撮合订单需要花费gas，所以只有当您设置的撮合费用合理时，矿工才会愿意帮您撮合订单。</br>我们不推荐您修改这个值，除非您已经充分理解它的含义。",
    tips_margin_split: "当您没有足够的LRC支付撮合手续费时，可以设置分润比例来支付手续费。</br>分润和LRC手续费只能取其一，所以不用担心会支付两次手续费。</br>我们不推荐您修改这个值，除非您已经充分理解它的含义。",
    confirm_warn_ledger: "请在您的Ledger设备上确认签名信息, 之后再回来提交订单",
    confirm_warn_trezor: "请在您的Trezor设备上确认签名信息, 之后再回来提交订单",
    confirm_warn_metamask: "您的MetaMask浏览器插件上会提示您签名, 请确认后再回来提交订单",
    place_order_trezor_unsupport: '无法下单',
    place_order_trezor_unsupport_tips: '在您下单时我们会将您的订单信息签名后发送给中继服务, 但Trezor暂时不支持签名操作, 所以在您用Trezor解锁钱包时无法下单，但作为钱包的功能（转账等）不受影响',
    place_order_watch_only_tips: '您当前使用地址解锁钱包，无法签名交易, 您可以切换其他方式解锁钱包后下单',
    custom_time_to_live: '设置本次有效的过期时间',
    custom_option_fee: '设置本次有效的值',
    custom_lrc_fee_title: '设置本次生效的LRC撮合费',
    custom_time_to_live_title: '设置本次生效的有效时间',
    send_failed: '下单失败 !',
    failed_fetch_data: '从服务器获取数据失败, 请稍后在尝试',
    eth_is_required: '由于需要支付ETH油费, 根据您当前订单需要发送的以太坊交易计算，还需要 {required} ETH',
    lrcfee_is_required: '由于需要支付LRC油费, 汇总您历史订单所需LRC，还需要 {required} LRC',
    not_supported_token_to_trade_title: '我们暂时未支持{token}交易',
    not_supported_token_to_trade_content: '敬请期待我们开放更多市场',
    not_supported_market_title: "不支持的市场",
    not_supported_market_content: "我们暂未支持市场 {market}",
    not_allowed_place_order_worth_title: '订单金额过小',
    not_allowed_place_order_worth_content: '由于您当前订单总价值小于{worth}, 无法下单',
    current_lrc_fee_ratio: '当前LRC Fee比率',
    current_lrc_fee: '当前LRC Fee',
    order_ttl_expire_in: '设置持续时间',
    order_ttl_from_to: '设置起止时间',
    not_supported_market:'暂未开放交易'
  },
  trades: {
    side: '方向',
    side_sell: '卖出',
    side_buy: '买入',
  },
  token: {
    convert_title: "转换",
    amount: "数量",
    amount_verification_message: "请输入合法的数量",
    convert_max: "最大数量",
    min_gas_remain_warn: "我们为您保留0.1 ETH作为油费以保证后续可以发送交易",
    no_eth_balance_warn: "您将没有足够的ETH作为油费发送交易",
    convert_confirm: "是的，马上转换！",
    send_title: "发送",
    result_failed: "您{do} {amount} {token} 失败, 原因:{reason}",
    completed: "成功",
    result_success: "您{do} {amount} {token} 成功",
    result_convert_success: "您转换 {amount} {token} 成功",
    result_transfer_success: "您转账 {amount} {token} 成功",
    view_transaction: '通过Etherscan查看交易',
    send_again: '继续转账',
    convert_again: '继续转换',
    ethereum_address: "我的以太坊地址",
    copy: "复制",
    copy_success: "复制成功",
    copy_failed: "复制失败",
    send: "发送",
    recipient: "接收者",
    eth_address_verification_message: "不合法的以太坊地址",
    send_max: "最大数量",
    transaction_fee: "油费",
    advanced: "高级",
    data: "数据",
    gas_limit: "Gas数量",
    gas_price: "Gas价格",
    continue: "继续",
    slow: "慢",
    fast: "快",
    transfer_preview_title: "您要发送",
    from: "发送方",
    to: "发送到",
    gas: "油费",
    transfer_cancel: "不，取消发送",
    transfer_send: "是的，马上发送",
    to_confirm_title: "等待您的确认",
    to_confirm_ledger_content: "请在您的Ledger设备上确认交易信息",
    select_token: "币种",
    token_selector_placeholder: '选择币种',
    token_select_verification_message: "请选择要发送的币种",
    transfer_result_title: "关心以太坊交易结果 ? ",
    transfer_result_etherscan: "在EtherScan查看结果",
    transfer_again_title: "想要继续操作 ? ",
    transfer_again_send: "继续发送",
    transfer_again_convert: "继续转换",
    add_custom_token_tip: "请输入合法的地址",
    send_failed: '发送失败！',
    convert_failed: '转换失败',
    recommended_value: "推荐值:",
    convert_succ_notification_title: '转换成功',
    transfer_succ_notification_title: '转账成功',
    custum_gas_title: '设置本次操作生效的油费',
    custum_gas_content: '我们推荐您设置{gas}',
    custum_gas_advance_content: '我们推荐您设置Gas数量{gasLimit}, Gas价格{gasPrice}',
    token_convert: '转换{from}成{to}',
    gas_fast_setting: '快速设置',
    gas_custom_setting: '自定义设置'
  },
  airdrop: {
    cost_eth_gas: "绑定地址需要支付ETH油费",
    goback: "返回",
    watch_only_not_allowed: "观察者模式无法绑定空投",
    eth_adress_null:'请解锁钱包后在重试',
    neo_address_null:'请输入您想绑定的合法的NEO地址'
  },
  mnemonic:{
    default_address:'当前默认地址',
    unlock_default_address:'解锁默认地址',
    choose_other_address:'选择其他地址',
  },
  wallet: {
    bind_tip: "绑定空投接收地址",
    cu_bind_address: "当前绑定的地址",
    airdrop: "空投",
    binding: "地址绑定成功",
    bind_type: "类型",
    address: "地址",
    type_tip: "请选择要绑定的类型",
    address_tip: "{project} 地址",
    get_address: "如何获取 {project} 账户",
    go_to: "访问 {project} 官方网站",
    bind_address: "绑定地址",
    bound_address: "已绑定的{token}地址",
    no_bound: "没有找到已绑定的地址",
    to_bind_address: "绑定",
    to_edit: "修改",
    bind_type_address: "绑定{type}地址",
    bind_address_confirm: "您确定绑定 {project} 地址: {address} 到您的钱包吗?",
    bind_success: "绑定成功",
    bind_failed: "绑定失败",
    loopring_on: "路印协议在{project}上的代币",
    neo: "NEO",
    qtum: "QTUM",
    unlock_tip: "您将怎么样解锁使用钱包",
    metamask: "MetaMask 钱包",
    trezor: "TREZOR 钱包",
    ledger: "Ledger 钱包",
    keystore: "Keystore 文件",
    privateKey: "私钥",
    mnemonic: "助记词",
    no_wallet: "暂时没有钱包，让我们来",
    generate_one: "创建一个",
    error_title: "错误信息",
    failed_connect_ledger_title: '连接Ledger失败',
    content_ledger_unlock_require_https: "解锁Ledger钱包只能在HTTPS网页上",
    content_ledger_connect_failed: "与您的Ledger设备连接失败, 您可以参照以下建议. 1、请确保您的设备与电脑连接并解锁. 2、在设备上将该选项设置为'yes': Settings->Browser support 3、在设备上选择'Ethereum app'并进入",
    content_leder_locked: "您的Ledger设备似乎被锁定了",
    recommended: "推荐",
    recommend_way: "这是推荐的解锁方式.",
    connect_to_ledger: "连接您的Ledger钱包",
    failed_connect_metamask_title: '连接MetaMask失败',
    content_metamask_mainnet: "在您使用MetaMask解锁时，我们只支持Ethereum mainnet，请在您的MetaMask切换",
    title_metamask_logout: "您已从MetaMask登出",
    content_metamask_logout: "我们检测到您已经从MetaMask登出, 为了您资金安全您的钱包重新锁定",
    content_metamask_unlock_again: "我们检测到您的网络环境或MetaMask network发生了变化，为了您的资产安全钱包已经被登出, 如要继续使用请确认MetaMask正在使用MainNetwork并再次解锁您的钱包",
    content_metamask_install: "您可能需要在浏览器安装MetaMask插件，安装完成后请刷新页面",
    content_metamask_locked: "与MetaMask连接失败, 请解锁后使用",
    content_metamask_install_title: '请先安装MetaMask',
    content_metamask_locked_title: '请先解锁您的MetaMask',
    get_metamask: "下载MetaMask {browser}插件",
    get_metamask_visit: '访问MetaMask官网',
    connect_to_metamask: "连接您的MetaMask钱包",
    connect_to_metamask_not_supported_browser: "您的浏览器不支持MetaMask解锁，推荐您使用Chrome",
    download_chrome: "下载Chrome浏览器",
    metamask_to_unlock: '解锁MetaMask',
    metamask_to_install: '安装MetaMask',
    metamask_unlock_steps_title: '你要做的步骤',
    metamask_unlock_refresh_button: '全做完了？刷新Loopr',
    metamask_unlock_cancel_button: '取消',
    metamask_unlock_step_install_title: '安装MetaMask',
    metamask_unlock_step_install_content: '为你的浏览器安装MetaMask插件',
    metamask_unlock_step_unlock_title: '解锁MetaMask',
    metamask_unlock_step_unlock_content: '在MetaMask上创建一个账号或解锁已有账号',
    metamask_unlock_step_refresh_title: '刷新Loopr',
    metamask_unlock_step_refresh_content: '刷新Loopr钱包使MetaMask生效',
    recommended_tip: "我们推荐您采用这种方式使用钱包。",
    not_recommended: "不推荐",
    not_recommended_tip: "我们不推荐您采用这种方式使用钱包。",
    select_keystore: "粘贴您的Keystore内容或者选择您的Keystore文件",
    select_json: "选择JSON文件",
    unlock: "解锁",
    password: "密码",
    password_tip:"请输入密码",
    password_strength: "密码强度",
    weak: "弱",
    average: "普通",
    strong: "强",
    connect_trezor: "连接您的Trezor钱包",
    paste_mnemonic: "请粘贴您的助记词",
    select_wallet: "请选择您的钱包类型",
    select_path:"选择路径",
    optional: "可选",
    mnemonic_tip: "请输入合法的助记词",
    paste_privatekey: "请粘贴您的私钥",
    invalid_privateKey: "无效的私钥",
    select_account: "请选择您的账号",
    custom_path: "您自定义的路径",
    select_address: "选择您要使用的地址",
    no_address: "没有符合条件的地址",
    pre_page: "前一页",
    next_page: "下一页",
    import: "导入",
    confirm: "确认",
    cancel: "取消",
    generate_wallet: "创建钱包",
    generate: "生成",
    have_one: "已经拥有一个钱包",
    to_unlock: "去解锁",
    set_password: "设置一个安全的密码",
    parse_failed: "解析Keystore文件失败",
    decrypt_failed: "解码Keystore失败",
    find_more_address:"{address},不是我的地址，去查找更多地址",
    confirm_address_unlock:"{address}是我的地址，解锁",
    compute_address:"计算的地址",
    compute_more_address:"计算更多地址",
    backup: {
      backup_wallet: "备份钱包",
      keystore: "Keystore",
      privatekey: "私钥",
      mnemonic: "助记词",
      not_lose: "不要丢失",
      not_share: "不要分享",
      not_recover: '一旦丢失将无法恢复',
      stolen: "不要在钓鱼网站使用该文件，否则您的数字资产存在巨大的被盗风险",
      backup: "请一定做好备份",
      backup_tip: '路印钱包不会保存用户的私钥、Keystore、助记词，强烈建议您在线下备份这些信息（不联网的USB硬盘或纸质存储）。一旦私钥、Keystore、助记词丢失将无法恢复!',
      secure: "一定刚好好保管好它们，说不定哪天就价值连城",
      download: "我已经明白，下载钱包文件",
      copy_mnemonic: "我已经我明白，复制助记词",
      copy_privatekey: "我已经明白，复制私钥",
      wrong_password: "密码错误",
      input_password: "请先输入密码",
      get_keystore: "获取Keystore",
      download_keystore: "下载Keystore文件",
      copy_keystore: "复制Keystore",
      enter_wallet_password: "请输入钱包密码",
      enter_password: "请输入一个密码来保护钱包",
      file_keystore: "文件",
      text_keystore: "文本",
      qr_keystore: "二维码",
      leave_backup_page: "进入我的钱包",
      confirm_to_leave_backup_page: "您确定要离开备份页面 ?",
    },
    token: "代币",
    title_metamask_account_change: "您切换了MetaMask账户",
    content_metamask_account_change: "我们检测到您刚刚在MetaMask切换了账户, 请注意您账户资产发生了改变",
    old_weth_detect: "检测到您的地址有WETH余额（旧版本WETH合约），建议您转换为ETH. ",
    to_convert: "开始转换",
    instruction_metamask: '这是推荐的解锁方式，可以放心使用。</br>MetaMask是一款在浏览器上运行的以太坊轻钱包，通过运行浏览器上的扩展插件即可轻松访问您的以太钱包。MetaMask提供管理用户资金的身份验证和访问接口，用户无需在任何网站上提供私钥，防止钓鱼网站和其他恶意网站的安全风险。',
    instruction_keystore: '我们不推荐您使用这种方式解锁钱包，可能存在安全隐患。</br>在网站上上传keystore文件非常危险，如果网站被黑客攻击或您不小心访问了钓鱼网站，您钱包内的资产将面临巨大的安全风险。建议您使用硬钱包或在上传keystore文件前仔细确认URL & SSL 证书正确无误。',
    instruction_ledger: '这是推荐的解锁方式，可以放心使用。</br>Ledger硬件钱包可以物理随机产生私钥、存储私钥、独立完成签名运算而不发送私钥到计算机，安全地存储用户的数字资产，杜绝数字资产存储和交易的各种安全风险。',
    instruction_mnemonic: '我们不推荐您使用这种方式解锁钱包，可能存在安全隐患。</br>在网站上上传助记词非常危险，如果网站被黑客攻击或您不小心访问了钓鱼网站，您钱包内的资产将面临巨大的安全风险。建议您使用硬钱包或在上传助记词前仔细确认URL & SSL 证书正确无误。',
    instruction_privatekey: '我们不推荐您使用这种方式解锁钱包，可能存在安全隐患。</br>在网站上上传私钥非常危险，如果网站被黑客攻击或您不小心访问了钓鱼网站，您钱包内的资产将面临巨大的安全风险。建议您使用硬钱包或在上传私钥前仔细确认URL & SSL 证书正确无误。',
    instruction_trezor: '这是推荐的解锁方式，可以放心使用。</br>Trezor硬件钱包可以物理随机产生私钥、存储私钥、独立完成签名运算而不发送私钥到计算机，安全地存储用户的数字资产，杜绝数字资产存储和交易的各种安全风险。',
    instruction_address: '这是推荐的解锁方式，可以放心使用。</br>在这种模式下您可以查看余额变动，但如果想转账或提交订单，请使用其他方式解锁',
    nonce: '随机数',
    watch_only: '观察模式',
    address_input_placeholder: '您的钱包地址',
    unlock_by_address: '用您的地址解锁',
    invalid_eth_address: '错误的以太坊地址',
    unlocked_notification_title: '您已成功解锁钱包',
    unlocked_notification_content: '开始您的路印之旅，希望你能喜欢',
    unlocked_by: '{type} 钱包',
    type_address: '观察模式',
    type_metamask: 'MetaMask钱包',
    type_trezor: 'Trezor钱包',
    type_ledger: 'Ledger钱包',
    type_keystore: 'KeyStore钱包',
    type_mnemonic: '助记词钱包',
    type_privatekey: '私钥钱包',
    type_demo: '演示钱包',
    type_lock: '未解锁',
    in_watch_only_mode_title:'已切换至观察模式',
    using_watch_only_mode_title:'您正在使用观察模式',
    unlock_by_cookie_address_notification:'Loopr切换您的账户至观察模式，您的私钥对当前网页已失效。当您执行一些操作时可能需要再次解锁钱包。',
    in_watch_only_mode_content: '您的账户正在使用观察模式。要执行这个操作，需要您再次解锁钱包。',
    in_demo_account_mode_content: '您正在使用演示钱包，要执行这个操作，需要您再次解锁钱包。',
    continue_watch:'继续使用观察模式',
    metamask_installed_locked_title: '尝试使用MetaMask解锁Loopr',
    metamask_installed_locked_content: '我们检测到您已安装MetaMask浏览器插件并尝试用MetaMask解锁Loopr，请先在您的MetaMask浏览器插件创建账户或解锁后再尝试用MetaMask解锁',
  },
  demo: {
    badge_title: '演示账号',
    badge_tip: '您正在使用演示钱包账号，只能查看信息，无法功能操作。',
    confirm_title: '使用演示账号体验 Loopr 钱包',
    confirm_instruction: '❗️演示账号：只是一个观察者模式钱包<br />❗️演示账号：不是你的钱包账号<br />🚫演示账号：不能绑定空投地址<br />🚫演示账号：不能转账收款<br />🚫演示账号：不能下单交易',
    confirm_btn: "确认",
    airdrop_not_allowed: "演示账号无法进行空投绑定",
  },
  tokens: {
    hide_small_balances: "隐藏小额资产",
    only_show_favorites: "只显示我的收藏",
    options: "操作",
    options_transfer: "转账",
    options_receive: "收款",
    options_convert: "转换",
    options_trade: "买卖",
    options_edit: "修改",
    add_token: "添加代币",
    token_address: "代币合约地址",
    token_name: "代币名称",
    token_symbol: "代币 Symbol",
    token_digits: "代币 Digits",
    confirm_save: "确认并保存",
    save_successfully: "保存成功",
    supportToken: "我们已经支持该币种 ",
    add_token_failed: "您提供的合约地址可能不是一个合法的ERC20地址，我们无法获取该合约的相关信息。"
  },
  portfolio: {
    total_value: "总市值",
    asset_currency_ratio: "资产比重"
  },
  ring: {
    ring_info: "撮合环路信息",
    ring_detail: "撮合环路详情",
    ring_hash: "环路哈希",
    ring_index:"环路",
    miner: "矿工",
    total_lrc_fee: "总共的LRC费用",
    total_split_fee: "总分的分润费用",
    time: '时间',
    trade_amount: "环路中订单个数",
    fee_recipient: "费用接收地址",
    ring_more_info: "更多信息，请访问RingInfo",
    no_ring: "没有找到符合条件的撮合环路"
  }
}

