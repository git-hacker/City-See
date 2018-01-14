
export default function getApiResult(apiResult, defaultResult = { isOk: false, msg: 'api接口调用失败!' }) {

    if (apiResult) {
        defaultResult.code = apiResult.data.code;
        if (apiResult.data.code == '0') {
            defaultResult.isOk = true;
            if (apiResult.data.pageIndex != undefined) {
                defaultResult.pageIndex = (apiResult.data.pageIndex + 1);
                defaultResult.pageSize = apiResult.data.pageSize;
                defaultResult.totalCount = apiResult.data.totalCount;
            }
            if (apiResult.data.extension) {
                defaultResult.extension = apiResult.data.extension;
            }
        } else {
            defaultResult.msg = apiResult.data.message || defaultResult.msg;
        }
    }
}