import redisConn from './redisConn';
import config from './config';
import logger4 from 'koa-log4';
const logger = logger4.getLogger('UserLib');
import {isObjectEmpty} from 'general-js-utils';
  export function getOneUser (id) {
    return new Promise(async(s, f) => {

      try{
        var idR = await redisConn.hgetall(config.redisPrefix.hash.userById+id);
      }catch(e){
        logger.error(e);
        f(
          {
            status : 500,
            body :{
              ...config.errors.internal_server_error,
              errors:[
                e
              ]
            }
          }
        );
        return;
      }

      if(isObjectEmpty(idR)){
        try{
          var idFromAccount = await redisConn.get(config.redisPrefix.string.userByAccount+id);
        }catch(e){
          logger.error(e);
          f(
            {
              status : 500,
              body :{
                ...config.errors.internal_server_error,
                errors:[
                  e
                ]
              }
            }
          );
          return;

        }


        if(idFromAccount===null){
          f({
            status: 404,
            body: {
              ...config.errors.not_found,
              errors: [{
                "id": "没有找到该用户"
              }]
            }
          });
            return;

        }else{

          try{
            var accountR = await redisConn.hgetall(config.redisPrefix.hash.userById+idFromAccount);
          }catch(e){
            logger.error(e);
            f(
              {
                status : 500,
                body :{
                  ...config.errors.internal_server_error,
                  errors:[
                    e
                  ]
                }
              }
            );
            return;

          }
          s(accountR);
        }
      }else{
        s(idR);
      }
    });
  }

  export function verifyToken(token){
    return redisConn.hget(config.redisPrefix.hash.sessionByToken+token,"id");
  }
