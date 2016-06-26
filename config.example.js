module.exports = {
  defaultParams:{
    listLength:15,
    listMaxLength:50,
    allow_push:true,
    md5Salt:"secret"
  },
  bearychat:{
    appTestChannel:"监听者",
    incoming:{
      url:"https://hook.bearychat.com/=bw8fe/incoming/5d77df5d36adda917cf8d38b630a9c17"
    }
  },
  localApiUrl:"http://127.0.0.1:3000",
  remoteApiUrl:"http://api.jiantingzhe.com",
  mysqlConfig:{
    'host':"localhost",
    'user':"root",
    "port":3306,
    "password":"123456",
    "database":"secret"
  },
  redisPrefix:{
    common:{
      channel:"channel:",
      user:"user:",
      school:"school:",
      city:"city:",
      college:"college:",
      subscription:"subscription:"
    },
    string:{
      messageById:"message:id:",

      schoolByName:"school:name:",

      channelByAlias:"channel:alias:",

      userByAccount:"user:account:"
    },
    hash:{
      schoolById:"school:id:",

      channelById:"channel:id:",

      userById:"user:id:",

      sessionByToken:"session:token:",
    },
    set:{
      channelPushById:"push:channel:"
    },
    sortedSet:{

      userFollowingByUserId:"following:user:",
      channelFollowerByChannelId:"follower:channel:",
      userUnreadMessageByUserId:"message:unread:user:",
      userReadMessageByUserId:"message:read:user:",
      userUnsubscribedChannelById:"unsubscribed.channel:user:",
      userSubscribedChannelById:"subscribed.channel:user:",
    },
    list:{
      allChannel:"channel:all",
      commonChannel:"channel:common",
      cityChannelById:"channel:city:",
      schoolChannelById:"channel:school:",

      allUser:"user:all",
      cityUserById:"user:city:",
      schoolUserById:"user:school:",

      userMessagesById:"message:user:",
      channelMessagesById:"message:channel:",

      sessionByUserId:"session:user:"


    }
  },


  errors:{
    invalid_params:{
      id:'invalid_params',
      message:'参数验证不通过',
      url:""
    },
    internal_server_error:{
      id:'internal_server_error',
      message:"内部服务错误",
      url:""
    },
    conflict:{
      id: "conflict",
      message:"该资源已存在",
      url:""
    },
    not_found:{
      id:"not_found",
      message:"没有找到资源",
      url:""
    },
    unauthorized:{
      id:"unauthorized",
      message:"提供的token不正确",
      url:""
    }
  }
}
