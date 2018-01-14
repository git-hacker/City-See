const BaseApiUrl = "http://192.168.50.145:6008/";
const WebApiConfig = {
    search: {
        getNearByComment: BaseApiUrl + '',//获取附近评论列表
        addComment: BaseApiUrl + 'comments'//新增评论
    },
    login: BaseApiUrl + 'connect/token',
    refreshToken: BaseApiUrl + ''
}
export default WebApiConfig;