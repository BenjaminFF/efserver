module.exports = options => {
  return async(ctx, next) => {
    let validUrls=['/api/user/login','/api/user/add'];
    if (!validUrls.includes(ctx.url)) {
      let sessionValidated=await validateSession(ctx);                 //以后再加个ip验证和登陆次数限制
      if(sessionValidated){
        return next();
      }else {
        ctx.body={validated:false};
        return;
      }
    } else {
      return next();
    }
  };
};

async function validateSession(ctx) {
  let uid = await ctx.cookie('uid');
  console.log(uid);
  if(typeof uid!='string'||uid.length==0){
    return false;
  }
  let session_userInfo = await ctx.session(uid);
  let userInfo = await ctx.cache(uid, undefined, 'redis');

  if (userInfo == session_userInfo) {
    return true;
  } else {
    return false;
  }
}
