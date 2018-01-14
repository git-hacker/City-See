const BaseApiUrl = "http://192.168.50.145:6008/";
const WebApiConfig = {
    search: {
        getCustomerByUserID: BaseApiUrl + 'customerInfo/salesmancustomer/',//根据用户ID获取客户列表
        getAuditHistory: BaseApiUrl + "examines/",//获取审核历史详细
    },
    login: BaseApiUrl + 'connect/token',
    refreshToken: BaseApiUrl + ''
}
export default WebApiConfig;