export const getDicName = (dicList, group, value) => {
    let dicGroup = dicList.find(x => x.groupId === group);
    if (dicGroup && dicGroup.dictionaryDefines) {
        let dic = dicGroup.dictionaryDefines.find(x => x.value === value);
        if (dic) {
            return dic.key;
        }
    }

    return '';
}

export const getDicList = (dic, groupId)=>{
    let dicList = [];
    let dicGroup = dic.find(x=>x.groupId === groupId);
    if(dicGroup && dicGroup.dictionaryDefines){
        dicGroup.dictionaryDefines.sort((a,b)=>a.order-b.order).forEach(item=>{
            dicList.push({
                label: item.key,
                value: item.value,
                ...item
            })
        });
    }
 
    return dicList;
}

export const formatM = (p, unit = 'm') => {
    if (p) {
        return (p * 1).toFixed(1) + unit;
    }
    return '';
}

export const formatPrice = (p, c = 10000) => {
    return ((p * 1) / c).toFixed(0);
}


export function textWrap(text) {
	if (!text || text === '' || (typeof text !== 'string' && !(text instanceof String))) {
		return '';
	}
	return text.split("\n\n")
		.filter(x => x !== '')
        .map((par, i) =>
            {
                let lines = par.split("\n")
                .filter(x => x !== '')
                .map((line, i) =>
                {
                    return `${line}<br />`;
                }
                );
                return `<p>${lines.join('')}</p>`;
            }
		).join('');
}

export function trimEnd(str){   
    return str.replace(/([\s])+$/,'');   
}  

export function trimStart(str){   
    return str.replace(/^([\s])+/,'');   
}  


export function replaceOrPush(list, item, check){
    let newList = [];
    let has = false;
    list.forEach(t=>{
        if( check(t, item)){
            has =true;
            newList.push(item);
        }else{
            newList.push(t);
        }

    })
    if(!has){
        newList.push(item);
    }
    return newList;
}


export function sortBuildingNo(buildingNos){
    let r1 = /([^0-9]?)([0-9]+)/;
    let r2 = /([^A-Z]?)([A-Z]+)/;

    return buildingNos.sort((a,b)=>{
        let m1 = (a.storied || '').match(r1);
        let t1 = 0;
        if(!m1){
            m1 = (a.storied || '').match(r2);
            t1 = 1;
        }
        let m2 = (b.storied || '').match(r1);
        let t2 = 0;
        if(!m2){
            m2 = (b.storied || '').match(r2);
            t2 = 1;
        }

        if(t1 === t2 && m1 && m2){
            if(t1===0){
                return (m1[2]*1 - m2[2]*1);
            }else if(t1===1){
                return m1[2].localeCompare(m2[2]);
            }
        }
        
        return (a.storied || '').localeCompare((b.storied || ''));

    })
}


export function isEmptyObject(obj,def){
    if(!obj ){
        return true;
    }
    
    def = def || {}

    let keys = Object.keys(obj);
    for(let i = 0;i<keys.length;i++){
        let key = keys[i];
        let sv = obj[key];
        let dv = def[key];

        if( sv instanceof Array){
            if( sv.length >0 ){
                return false;
            }
        }

        if( sv instanceof Date){

        }else if(sv instanceof Object){
            return isEmptyObject(sv, dv);
        }


        if( typeof dv !== "undefined" ){
            if( dv !== sv ){
                return false;
            }else{
                continue;
            }
        }

        if( sv){
            return false;
        }

    }

    return true;
}

export function sortShops(shops){
    return  shops.sort((a,b)=>{
        let fna = a.floorNo*1;
        let fnb = a.floorNo * 1;

        let numa = a.number||'';
        let numb = a.number||'';

        let r1 = /([^0-9]?)([0-9]+)/;
        
        let m1 = numa.match(r1);
        let m2 = numb.match(r1);
       
        

        if(m1 && m2){
            return (fna*10000+ m1[2]*1 - fnb*10000+ m2[2]*1);
        }

        if(fna === fnb){
            return numa.localeCompare(numb);
        }

        return fna - fnb;

    })
}

export function groupShops(shopList){
    let buildings = [];
    let groupCount = [{key:"1",count:0},{key:"2",count:0},{key:"4",count:0},{key:"10",count:0},];
    

    if(!shopList || shopList.length===0)
    {
        return {buildings, groupCount};
    }

    shopList.forEach(shop=>{
        let bn = shop.buildingNo || '';
        bn = bn.toString();
        let old = buildings.find(x=>x.storied=== bn);
        if(!old){
            old={storied: bn, shops:[]}
            buildings.push(old)
        }

        old.shops.push(shop);

        let ss = shop.saleStatus;
        let g = groupCount.find(x=>x.key === ss);
        if(!g){
            g = {key: ss, count:0}
            groupCount.push(g);
        }
        g.count = g.count+1;

    })

  
    buildings = sortBuildingNo(buildings);

    buildings.forEach(b=>{
        b.shops = sortShops(b.shops);
    })

    return {buildings, groupCount};

}

export const getShopName = (shop)=>{
    let fn = shop.floorNo;
    if( (fn*1)<0){
        fn = '负' + Math.abs(fn*1);
    }
    return `${shop.buildingNo}-${fn}层-${shop.number}`;
}


export const amountTransform = (tranvalue) => {
    try {
        var i = 1;
        var dw2 = ["", "万", "亿"]; //大单位
        var dw1 = ["拾", "佰", "仟"]; //小单位
        var dw = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"]; //整数部分用
        //以下是小写转换成大写显示在合计大写的文本框中    
        //分离整数与小数
        var source = splits(tranvalue);
        var num = source[0];
        var dig = source[1];
        //转换整数部分
        var k1 = 0; //计小单位
        var k2 = 0; //计大单位
        var sum = 0;
        var str = "";
        var len = source[0].length; //整数的长度
        for (i = 1; i <= len; i++) {
            var n = source[0].charAt(len - i); //取得某个位数上的数字
            var bn = 0;
            if (len - i - 1 >= 0) {
                bn = source[0].charAt(len - i - 1); //取得某个位数前一位上的数字
            }
            sum = sum + Number(n);
            if (sum !== 0) {
                str = dw[Number(n)].concat(str); //取得该数字对应的大写数字，并插入到str字符串的前面
                if (n === '0') sum = 0;
            }
            if (len - i - 1 >= 0) { //在数字范围内
                if (k1 !== 3) { //加小单位
                    if (bn !== 0) {
                        str = dw1[k1].concat(str);
                    }
                    k1++;
                } else { //不加小单位，加大单位
                    k1 = 0;
                    var temp = str.charAt(0);
                    if (temp == "万" || temp == "亿") //若大单位前没有数字则舍去大单位
                        str = str.substr(1, str.length - 1);
                    str = dw2[k2].concat(str);
                    sum = 0;
                }
            }
            if (k1 == 3) //小单位到千则大单位进一
            {
                k2++;
            }
        }
        //转换小数部分
        var strdig = "";
        if (dig !== "") {
            var n = dig.charAt(0);
            if (n !== 0) {
                strdig += dw[Number(n)] + "角"; //加数字
            }
            var n = dig.charAt(1);
            if (n !== 0) {
                strdig += dw[Number(n)] + "分"; //加数字
            }
        }
        str += "元" + strdig;
    } catch (e) {
        return "0元";
    }
    return str;
}
//拆分整数与小数
function splits(tranvalue) {
    var value = ['', ''];
    let temp = tranvalue.split(".");
    for (var i = 0; i < temp.length; i++) {
        value[i] = temp[i];
    }
    return value;
}