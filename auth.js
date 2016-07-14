import redisConn from './redisConn';
import config from './config';
import {isObjectEmpty} from 'general-js-utils';
import {getOneChannel} from './channel';
export async function auth(ctx,next){
  if(ctx.headers.authorization){
    console.log(ctx.headers.authorization);
    try{
    var userR = await redisConn.hmget(config.redisPrefix.hash.sessionByToken+ctx.headers.authorization,"id");
    }catch(e){
      console.log(e);
      ctx.status = 500;
      ctx.body = {
        ...config.errors.internal_server_error,
        errors:[
          e
        ]
      };
      return;
    }
    if(!userR[0]){
      ctx.status = 401;
      ctx.body = {
        ...config.errors.unauthorized,
        errors:[
          {"headers.Authorization":"token is not valid!"}
        ]
      }
    }else{
      ctx.userId = userR[0];
      ctx.token = ctx.headers.authorization;
      return next();
    }

  }else{
    if(ctx.headers.access_token){
      console.log(ctx.headers.access_token);
      try{
      var accessToken = await redisConn.hgetall(config.redisPrefix.hash.accessTokenByToken+ctx.headers.access_token);
      }catch(e){
        console.log(e);
        ctx.status = 500;
        ctx.body = {
          ...config.errors.internal_server_error,
          errors:[
            e
          ]
        };
        return;
      }
      if(isObjectEmpty(accessToken)){
        ctx.status = 401;
        ctx.body = {
          ...config.errors.unauthorized,
          errors:[
            {"headers.Authorization":"access_token is not valid!"}
          ]
        }
      }else{
        const pathSep = (ctx.path.match(/\//g) || []).length;
        let suffix = ctx.method==='get'?'_read':'_write'
        let scope = "";
        if(pathSep===0){
          ctx.status = 401;
          ctx.body = {
            ...config.errors.unauthorized,
            errors:[
              {"scope":"no scope!"}
            ]
          }
          return;
        }else if(pathSep===1){
          scope = ctx.path.substr(1)+suffix;
        }else{
          scope = ctx.path.substring(1,ctx.path.indexOf('/',1))+suffix;
        }
        let scopes = accessToken.scope.split(',');
        let flag = false;
        for(let i=0;i<scopes.length;i++){
          if(scopes[i]===scope){
            flag = true;
          }
        }
        if(flag){
          ctx.userId = accessToken.user_id;
          return next();
        }else{
          ctx.status = 401;
          ctx.body = {
            ...config.errors.unauthorized,
            errors:[
              {"scope":"there is no scope for the access_token!"}
            ]
          }
          return;
        }


      }

    }else{
      ctx.status = 401;
      ctx.body = {
        ...config.errors.unauthorized,
        errors:[
          {"headers.Authorization":"access_token or Authorization is required!"}
        ]
      }
    }
  }
};

export async function authScope(ctx,next){
  //todo 验证是否有权限读取
ctx.userId = ctx.params.id;
return next();
}

export async function authChannel(ctx,next){
  const channelId = ctx.request.body.channel_id;
  if(!channelId){
    ctx.status=422;
    ctx.body = {
      ...config.errors.invalid_params,
      errors:[
        {
          "channel_id":"params channel_id is required!"
        }
      ]
    };
    return;
  }

  const token = ctx.request.body.token;
  if(!token){
    ctx.status=422;
    ctx.body = {
      ...config.errors.invalid_params,
      errors:[
        {
          "channel_id":"params token is required!"
        }
      ]
    };
    return;
  }
  try{
  var channel = await getOneChannel(channelId);
  }catch(e){
    ctx.status = e.status;
    ctx.body = e.body;
    return;
  }
  try{
  var tokenOrigin =  await redisConn.hmget(config.redisPrefix.hash.channelAuthorizationById+channel.id,"token");
}catch(e){
  console.log(e);
  ctx.status = 500;
  ctx.body = {
    ...config.errors.internal_server_error,
    errors:[
      e
    ]
  };
  return;
}
if(!tokenOrigin[0]){
  ctx.status = 404;
  ctx.body = {
    ...config.errors.not_found,
    errors:[
      {"authorization":"can't found channel's authorization"}
    ]
  }
  return;
}
if(tokenOrigin[0] !== token){
  ctx.status = 401;
  ctx.body = {
    ...config.errors.unauthorized,
    errors:[
      {"token":"token is not valid!"}
    ]
  }
  return;
}
ctx.channel_id = channel.id;
  return next();
}

export async function authAccessToken(ctx,next){

}
