auto.waitFor();

let path = engines.myEngine().cwd();
let execName = String(engines.myEngine().getSource());
if (execName == "Tmp.js" || execName.indexOf("remote") != -1) {
    path += "/autoChargeUp/";
}
var CryptoJS = require(path + "lib/CryptoJs.js");
var gtoken = require(path + "lib/jwt.js");
var F = require(path + "lib/floaty.js");
var config = require(path + "config.js");
var w = floaty.rawWindow(
    <frame visibility="invisible">
        <input id="input" />
    </frame>
);

const chargeUpFunc = {
    purchaseItemSortList: [],
    incomeItemSortList: [],
    pcswItemSortList: [],
    init: function() {
        this.purchaseItemSortList = [];
        this.incomeItemSortList = [];
        this.pcswItemSortList = [];
        let purchaseItemData = storages.create("purchaseItemList");
        let incomeItemData = storages.create("incomeItemList");
        let pcswItemData = storages.create("pcswItemList");
        if (purchaseItemData.get(config.chargeUp.purchaseItem[0]) === undefined) {
            for (let i = 0; i < config.chargeUp.purchaseItem.length; i++) {
                purchaseItemData.put(config.chargeUp.purchaseItem[i], 0);
                if (i >= config.chargeUp.paymentSoftWare.length) continue;
                pcswItemData.put(config.chargeUp.paymentSoftWare[i], 0);
                if (i >= config.chargeUp.incomeItem.length) continue;
                incomeItemData.put(config.chargeUp.incomeItem[i], 0);
            }
        }
        let purchaseItemListNum = [],
            incomeItemListNum = [],
            pcswItemListNum = [];
        for (let i = 0; i < config.chargeUp.purchaseItem.length; i++) {
            purchaseItemListNum = this.sortItem(
                purchaseItemListNum,
                config.chargeUp.purchaseItem[i],
                purchaseItemData.get(config.chargeUp.purchaseItem[i])
            );
            if (i >= config.chargeUp.paymentSoftWare.length) continue;
            pcswItemListNum = this.sortItem(
                pcswItemListNum,
                config.chargeUp.paymentSoftWare[i],
                pcswItemData.get(config.chargeUp.paymentSoftWare[i])
            );
            if (i >= config.chargeUp.incomeItem.length) continue;
            incomeItemListNum = this.sortItem(
                incomeItemListNum,
                config.chargeUp.incomeItem[i],
                incomeItemData.get(config.chargeUp.incomeItem[i])
            );
        }
        for (let i = 0; i < config.chargeUp.purchaseItem.length; i++) {
            this.purchaseItemSortList.push(Object.keys(purchaseItemListNum[i])[0]);
            if (i >= config.chargeUp.paymentSoftWare.length) continue;
            this.pcswItemSortList.push(Object.keys(pcswItemListNum[i])[0]);
            if (i >= config.chargeUp.incomeItem.length) continue;
            this.incomeItemSortList.push(Object.keys(incomeItemListNum[i])[0]);
        }
    },
    sortItem: function(itemList, itemName, itemNum) {
        let tmpObj = {};
        tmpObj[itemName] = itemNum;
        if (itemNum === 0) {
            itemList.push(tmpObj);
            return itemList;
        }
        for (let i = 0; i < itemList.length; i++) {
            if (itemNum >= itemList[i][Object.keys(itemList[i])[0]]) {
                itemList.splice(i, 0, tmpObj);
                return itemList;
            }
        }
        itemList.push(tmpObj);
        return itemList;
    },
    showCateOptions: function(message) {
        let cateList =
            this.checkType(message) === 0 ? storages.create("purchaseItemList") : storages.create("incomeItemList");
        let cateOptions = this.checkType(message) === 0 ? this.purchaseItemSortList : this.incomeItemSortList;
        let cateOptionsSelected = dialogs.select("种类", cateOptions);
        cateList.put(cateOptions[cateOptionsSelected], cateList.get(cateOptions[cateOptionsSelected]) + 1);
        if (cateOptionsSelected < 0) {
            return false;
        }
        return cateOptions[cateOptionsSelected];
    },
    showCateOptionsPromise: function(message, func) {
        let cateList =
            this.checkType(message) === 0 ? storages.create("purchaseItemList") : storages.create("incomeItemList");
        let cateOptions = this.checkType(message) === 0 ? this.purchaseItemSortList : this.incomeItemSortList;
        dialogs.select("种类", cateOptions, (cateOptionsSelected) => {
            cateList.put(cateOptions[cateOptionsSelected], cateList.get(cateOptions[cateOptionsSelected]) + 1);
            func(cateOptions[cateOptionsSelected]);
        });
    },
    checkType: (message) => {
        if (/消费|扣款|支出/i.test(message)) {
            return 0;
        } else if (/入账|收款/i.test(message)) {
            return 1;
        } else if (/还款|账单/i.test(message)) {
            return 2;
        }
        return 3;
    },
    sendMessage: function(billInfo) {
        ui.run(function() {
            w.requestFocus();
            let url = `qianji://publicapi/addbill?type=${billInfo.type}&money=${billInfo.money}&time=${billInfo.time}&catename=${billInfo.catename}&accountname=${billInfo.accountname}`;
            if (billInfo.remark) {
                url += "&remark=" + billInfo.remark;
            }
            app.startActivity({
                action: "android.intent.action.VIEW",
                packageName: "com.mutangtech.qianji",
                data: url,
            });
            log("钱迹url：" + url);
        });
        exit();
    },
    autoGetCate: function(PI) {
        let allText = textMatches(/.+/).find();
        let textArr = [];
        let PItype = PI === 0 ? config.chargeUp.purchaseItem.join(",") : config.chargeUp.incomeItem.join(",");
        for (let i = 0; i < allText.length; i++) {
            let t = allText[i].text();
            if (
                !/开关|添加|\d{10,}|账单|AA收款|对此订单|查看往来|交易成功|支付时间|付款方式|商品说明|支付奖励|商家|商户|计入收支|清算机构|收单机构|订单号|flowCdp|标签和备注|申请电子回单|流水证明|当前状态|支付成功|支付方式|扫码退款|群收款|财付通提供|疑惑|单号/.test(
                    t
                )
            )
                textArr.push(t);
        }
        let postData = {
            model: config.model.model,
            messages: [
                {
                    role: "system",
                    content: config.prompt.replace("[[replace]]", PItype),
                },
                {
                    role: "user",
                    content: textArr.join("\n"),
                },
            ],
        };
        var res;
        var thread = threads.start(function() {
            res = http.postJson(config.model.url, postData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: config.model.authorization(),
                },
            });
        });
        thread.join(config.overtime);
        thread.interrupt();
        if (!res) toastLog("获取数据超时！");
        let data = res ? res.body.json() : "";
        if (!data) {
            return "";
        }
        let response = data["choices"][0]["message"]["content"];
        log(data, postData, data["choices"][0]);
        response = response.replace(/["“”]/g, "");
        let items = PI === 0 ? config.chargeUp.purchaseItem : config.chargeUp.incomeItem;
        for (let i in items) {
            if (items[i] === response) {
                return response;
            }
        }
        return "";
    },
    formatDateString: (dateString) => {
        // 检查字符串是否符合"yyyy-MM-dd HH:mm:ss"的格式
        var regexFull = /^\d+-\d+-\d+ \d+:\d+:\d+$/;
        var regexPartial = /^\d+-\d+-\d+ \d+:\d+$/;
        if (!regexFull.test(dateString)) {
            if (regexPartial.test(dateString)) {
                // 如果符合"yyyy-MM-dd HH:mm"的格式，添加":00"
                dateString += ":00";
            } else {
                // 如果都不符合，添加" 00:00:00"
                dateString += " 00:00:00";
            }
        }
        return dateString;
    },
    rectifyInfo: function(billInfo) {
        billInfo.time = this.formatDateString(billInfo.time);
    },
};

function showCheckDialog(billInfo) {
    var mutex = threads.disposable();
    var isCheck;
    var remark = "";
    F.setMessage(billInfo, mutex, chargeUpFunc);
    parseInt(mutex.blockedGet());
    F.hide();

    return isCheck;
}

function startChargeUp(packagename, compareTextReg, amountReg, timeReg, defaultCate) {
    if (!textMatches(compareTextReg).exists()) {
        toastLog("未在账单界面");
        exit();
    }
    textMatches(compareTextReg).waitFor();
    if (text("更多").exists()) {
        text("更多").findOne().click();
        sleep(500);
    }
    let amount = textMatches(amountReg).findOne().text().replace("支出", "-").replace("元", "");
    let timeGet = textMatches(timeReg)
        .findOne()
        .text()
        .replace(/[年月]/g, "-")
        .replace("日", "");
    let pcswReg = new RegExp(
        Object.keys(config.chargeUp.mappingPcsw)
            .join("|")
            .replace(/\(/g, "\\(")
            .replace(/\)/g, "\\)(\\s+)?")
            .replace(/\*/g, "\\*")
    );
    let accountGet =
        config.chargeUp.mappingPcsw[
            textMatches(pcswReg).exists() ? textMatches(pcswReg).findOne().text().replace(" ", "") : defaultCate
            ];
    log(textMatches(pcswReg).exists() ? textMatches(pcswReg).findOne().text().replace(" ", "") : defaultCate);
    chargeUpFunc.init();
    toastLog("获取类目中……");
    let purchaseOrIncome = amount[0] === "-" ? 0 : 1;
    let cateOption = chargeUpFunc.autoGetCate(purchaseOrIncome);
    if (!cateOption) cateOption = chargeUpFunc.showCateOptions(purchaseOrIncome === 1 ? "收款" : "支出");
    if (!cateOption) return;
    let billInfo = {
        type: purchaseOrIncome,
        money: amount.replace(/[+\-]/g, ""),
        time: chargeUpFunc.formatDateString(timeGet),
        catename: cateOption,
        accountname: accountGet,
        remark: "",
    };
    chargeUpFunc.rectifyInfo(billInfo);
    if (showCheckDialog(billInfo) !== 0) {
        chargeUpFunc.sendMessage(billInfo);
    }
}

var checkReapet = storages.create("emitmmess");

function initialization() {
    for (let i = 0; i < config.chargeUp.platform.length; i++) {
        checkReapet.put(config.chargeUp.platform[i]["id"], 0);
        let packageName = config.chargeUp.platform[i].packageName,
            compareTextReg = config.chargeUp.platform[i].compareTextReg,
            amountReg = config.chargeUp.platform[i].amountReg,
            timeReg = config.chargeUp.platform[i].timeReg,
            defaultCate = config.chargeUp.platform[i].defaultCate;
        if (currentPackage() === packageName) {
            startChargeUp(packageName, compareTextReg, amountReg, timeReg, defaultCate);
            break;
        } else if (i === config.chargeUp.platform.length - 1) {
            toastLog("未在支付软件界面");
            exit();
        }
    }
}

initialization();
