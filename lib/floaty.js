importClass(android.graphics.drawable.GradientDrawable);

const resources = context.getResources();
// 密度比例
const scale = resources.getDisplayMetrics().density;
var dp2px = (dp) => {
    return Math.floor(dp * scale + 0.5);
};
var px2dp = (px) => {
    return Math.floor(px / scale + 0.5);
};

let deviceHeight = device.height,
    deviceWidth = device.width,
    floatyWidth = Math.floor(px2dp(deviceWidth * 0.96)),
    floatyHeight = 320,
    containWidth = Math.floor(floatyWidth * 0.88),
    containHeight = Math.floor(floatyHeight * 0.95);
var w = floaty.rawWindow(
    <card id="mainFloaty" w="0" h="0" gravity="center">
        <vertical w="*" h="*" bg="#f4f0ef" gravity="center">
            <vertical w="0" h="0" gravity="center" id="contain" layout_gravity="center">
                <text text="账单明细" layout_weight="1" gravity="left|center" />
                <horizontal w="*" h="30" layout_weight="1" gravity="left|center">
                    <card
                        h="*"
                        w="60"
                        gravity="center"
                        cardCornerRadius="20dp"
                        cardElevation="1dp"
                        margin="1"
                        cardBackgroundColor="#f4304f"
                        id="purchaseCard"
                    >
                        <text text="支出" id="purchase" gravity="center" textSize="16sp" textColor="#efefef" />
                    </card>
                    <card
                        h="*"
                        w="60"
                        gravity="center"
                        cardCornerRadius="20dp"
                        foreground="?selectableItemBackground"
                        cardElevation="0dp"
                        margin="1"
                        cardBackgroundColor="#f4f0ef"
                        id="incomeCard"
                    >
                        <text text="收入" id="income" gravity="center" textSize="16sp" />
                    </card>
                </horizontal>
                <horizontal w="*" h="30" layout_weight="1">
                    <horizontal layout_weight="4" w="*" h="*" gravity="left|center">
                        <text text="时间" textSize="16sp" />
                    </horizontal>
                    <horizontal layout_weight="1" w="*" h="*" gravity="right|center">
                        <text text="" id="time" textSize="16sp" />
                    </horizontal>
                </horizontal>
                <horizontal w="*" h="30" layout_weight="1">
                    <horizontal layout_weight="1" w="*" h="*" gravity="left|center">
                        <text text="金额" textSize="16sp" />
                    </horizontal>
                    <horizontal layout_weight="1" w="*" h="*" gravity="right|center">
                        <text text="" id="amount" textSize="16sp" />
                    </horizontal>
                </horizontal>
                <horizontal w="*" h="30" layout_weight="1">
                    <horizontal layout_weight="1" w="*" h="*" gravity="left|center">
                        <text text="账户" textSize="16sp" />
                    </horizontal>
                    <horizontal layout_weight="1" w="*" h="*" gravity="right|center">
                        <text text="" id="account" textSize="16sp" />
                    </horizontal>
                </horizontal>
                <horizontal w="*" h="30" layout_weight="1">
                    <horizontal layout_weight="1" w="*" h="*" gravity="left|center">
                        <text text="类目" textSize="16sp" />
                    </horizontal>
                    <horizontal layout_weight="1" w="*" h="*" gravity="right|center">
                        <text text="" id="cate" textSize="16sp" />
                    </horizontal>
                </horizontal>
                <horizontal w="*" h="30" layout_weight="1.5">
                    <horizontal layout_weight="4" w="*" h="*" gravity="left|center">
                        <text text="备注" textSize="16sp" />
                    </horizontal>
                    <horizontal layout_weight="1" w="*" h="*" gravity="right|center">
                        <input
                            hint="请输入备注……"
                            id="remark"
                            textSize="16sp"
                            focusable="true"
                            w="*"
                            h="*"
                            gravity="right"
                        />
                    </horizontal>
                </horizontal>
                <horizontal w="*" h="30" layout_weight="4" paddingBottom="10">
                    <horizontal layout_weight="1" w="*" h="*" gravity="left|bottom">
                        <card
                            h="35"
                            w="60"
                            gravity="center"
                            cardCornerRadius="20dp"
                            foreground="?selectableItemBackground"
                            cardElevation="1dp"
                            margin="1"
                            cardBackgroundColor="#f1544f"
                            id="cancel"
                        >
                            <text text="取消" textSize="16sp" color="#ffffff" gravity="center" />
                        </card>
                    </horizontal>
                    <horizontal layout_weight="1" w="*" h="*" gravity="right|bottom">
                        <card
                            h="35"
                            w="60"
                            gravity="center"
                            cardCornerRadius="20dp"
                            foreground="?selectableItemBackground"
                            cardElevation="1dp"
                            cardBackgroundColor="#007acc"
                            id="save"
                        >
                            <text text="保存" color="#ffffff" textSize="16sp" gravity="center" />
                        </card>
                    </horizontal>
                </horizontal>
            </vertical>
        </vertical>
    </card>
);

var timer = setInterval(() => {
}, 1000);

const floatySetting = {
    show: () => {
        ui.run(function() {
            w.setSize(dp2px(floatyWidth), dp2px(floatyHeight));
        });
    },
    hide: () => {
        ui.run(function() {
            w.setSize(1, 1);
        });
    },
    setAmount: (amount) => {
        ui.run(function() {
            w.amount.setText(amount);
        });
    },
    setTime: (time) => {
        ui.run(function() {
            w.time.setText(time);
        });
    },
    setAccount: (account) => {
        ui.run(function() {
            w.account.setText(account);
        });
    },
    setCate: (cate) => {
        ui.run(function() {
            w.cate.setText(cate + " >");
        });
    },
    init: () => {
        ui.run(function() {
            let g = new GradientDrawable();
            g.setCornerRadius(18);
            w.mainFloaty.setBackground(g);
            w.setPosition(
                Math.floor((deviceWidth - dp2px(floatyWidth)) / 2),
                Math.floor((deviceHeight - dp2px(floatyHeight)) / 2) - 300
            );
            w.mainFloaty.attr("w", floatyWidth);
            w.mainFloaty.attr("h", floatyHeight);
            w.contain.attr("w", containWidth);
            w.contain.attr("h", containHeight);
        });
    },
    switchPI: (type) => {
        if (type === 0) {
            w.purchaseCard.attr("cardBackgroundColor", "#f4304f");
            w.purchaseCard.attr("cardElevation", "1dp");
            w.purchase.setTextColor(colors.parseColor("#efefef"));
            w.incomeCard.attr("cardBackgroundColor", "#f4f0ef");
            w.incomeCard.attr("cardElevation", "0dp");
            w.income.setTextColor(colors.parseColor("#444444"));
        } else {
            w.incomeCard.attr("cardBackgroundColor", "#007acc");
            w.incomeCard.attr("cardElevation", "1dp");
            w.income.setTextColor(colors.parseColor("#efefef"));
            w.purchaseCard.attr("cardBackgroundColor", "#f4f0ef");
            w.purchaseCard.attr("cardElevation", "0dp");
            w.purchase.setTextColor(colors.parseColor("#444444"));
        }
    },
    switchCate: (billInfo) => {
        floatySetting.hide();
        chargeUpFunc.showCateOptionsPromise(billInfo.type === 1 ? "收款" : "支出", (cate) => {
            F.show();
            log(cate);
            F.setCate(cate);
            billInfo.catename = cate;
        });
    },
    setMessage: (billInfo, mutex, chargeUpFunc) => {
        floatySetting.init();
        floatySetting.switchPI(billInfo.type);
        floatySetting.setAmount(billInfo.money);
        floatySetting.setCate(billInfo.catename);
        floatySetting.setAccount(billInfo.accountname);
        floatySetting.setTime(billInfo.time);
        w.cate.click(function() {
            floatySetting.switchCate(billInfo);
        });
        /* w.account.click(function () {
            floatySetting.hide();
            alert(1).then(() => {
                floatySetting.show();
            });
        }); */
        w.save.click(function() {
            floatySetting.hide();
            mutex.setAndNotify(1);
            billInfo.remark = w.remark.getText();
        });
        w.cancel.click(function() {
            w.close();
            clearInterval(timer);
            mutex.setAndNotify(0);
            w.exitOnClose();
            floaty.closeAll();
            exit();
        });
        w.purchaseCard.click(function() {
            billInfo.type = 0;
            floatySetting.switchPI(0);
            let cate = chargeUpFunc.autoGetCate(billInfo.type);
            if (cate) {
                billInfo.catename = cate;
                floatySetting.setCate(billInfo.catename);
                floatySetting.show();
            } else {
                floatySetting.switchCate(billInfo);
            }
        });
        w.incomeCard.click(function() {
            billInfo.type = 1;
            floatySetting.switchPI(1);
            let cate = chargeUpFunc.autoGetCate(billInfo.type);
            if (cate) {
                billInfo.catename = cate;
                floatySetting.setCate(billInfo.catename);
                floatySetting.show();
            } else {
                floatySetting.switchCate(billInfo);
            }
        });
    },
    close: () => {
        w.close();
        clearInterval(timer);
        mutex.setAndNotify(0);
    },
};
w.remark.on("touch_up", function() {
    w.requestFocus();
    w.remark.requestFocus();
});
module.exports = floatySetting;
