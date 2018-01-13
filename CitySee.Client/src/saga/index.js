import auth from './auth'


export default function(sagaMiddleware){
    sagaMiddleware.run(auth);
}