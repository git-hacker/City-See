export const appAction = (appName)=>{

    return {
        action:(actionCreator,...args)=>{
            let a = actionCreator(...args);
            a.type = `${appName}/${a.type}`;
            return a;
        },
        getActionType: (actionType)=>{
            return `${appName}/${actionType}`;
        }
    }
 
}