import logger4 from 'koa-log4';
const logger = logger4.getLogger('ChannelLib');
import redisConn from './redisConn';
import config from './config';
import {isObjectEmpty} from 'general-js-utils'
export function getOneChannel(id,userId) {
    return new Promise(async(s, f) => {
      try {
        var idR = await redisConn.hgetall(config.redisPrefix.hash.channelById + id);
      } catch (e) {
        logger.error(e);
        f({
          status: 5000,
          body: {
            ...config.errors.internal_server_error,
            errors: [
              e
            ]
          }
        });
        return;
      }
      if (isObjectEmpty(idR)) {
        try {
          var idFromAlias = await redisConn.get(config.redisPrefix.string.channelByAlias + id);
        } catch (e) {
          logger.error(e);
          f({
            status: 5000,
            body: {
              ...config.errors.internal_server_error,
              errors: [
                e
              ]
            }
          });
          return;

        }
        if (idFromAlias === null) {
          f({
            status: 404,
            body: {
              ...config.errors.not_found,
              errors: [{
                "id": "没有找到该主题"
              }]
            }
          });
          return;
        } else {
          try {
            var aliasR = await redisConn.hgetall(config.redisPrefix.hash.channelById + idFromAlias);
          } catch (e) {
            logger.error(e);
            f({
              status: 5000,
              body: {
                ...config.errors.internal_server_error,
                errors: [
                  e
                ]
              }
            });
            return;

          }

          try{
            var followers_count = await redisConn.zcount(config.redisPrefix.sortedSet.channelFollowerByChannelId+aliasR.id,config.defaultParams.minTimestamp,config.defaultParams.maxTimestamp);
          }catch(e){
            logger.error(e);
            f({
              status: 5000,
              body: {
                ...config.errors.internal_server_error,
                errors: [
                  e
                ]
              }
            });
            return;
          }
          aliasR.followers_count = followers_count;
          if(userId){
            try{
              var allow_push = await redisConn.hget(config.redisPrefix.common.subscription+config.redisPrefix.common.channel+aliasR.id+":"+config.redisPrefix.common.user+userId,"allow_push");
            }catch(e){
              f({
                status: 5000,
                body: {
                  ...config.errors.internal_server_error,
                  errors: [
                    e
                  ]
                }
              });
              return;
            }
            if(allow_push!==null){
              aliasR.allow_push = (allow_push==="0"?false:true);
              aliasR.following= true;
            }else{
              aliasR.following = false;
            }
          }

          s(aliasR);
          return;
        }


      } else {
        try{
          var followers_count = await redisConn.zcount(config.redisPrefix.sortedSet.channelFollowerByChannelId+idR.id,config.defaultParams.minTimestamp,config.defaultParams.maxTimestamp);
        }catch(e){
          logger.error(e);
          f({
            status: 5000,
            body: {
              ...config.errors.internal_server_error,
              errors: [
                e
              ]
            }
          });
          return;
        }
        idR.followers_count = followers_count;
        if(userId){
          try{
            var allow_push = await redisConn.hget(config.redisPrefix.common.subscription+config.redisPrefix.common.channel+idR.id+":"+config.redisPrefix.common.user+userId,"allow_push");
          }catch(e){
            f({
              status: 5000,
              body: {
                ...config.errors.internal_server_error,
                errors: [
                  e
                ]
              }
            });
            return;
          }
          if(allow_push!==null){
            idR.allow_push = (allow_push==="0"?false:true);
            idR.following= true;
          }else{
            idR.following= false;
          }
        }
        s(idR);
        return;
      }
    });
  }
