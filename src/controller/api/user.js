const uniqid = require('uniqid');
const model = think.model('ewordfun/user');
const svgCaptcha = require('svg-captcha');
module.exports = class extends think.Controller {
  __before() {

  }

  async addAction() {
    await model.add({
      uid: uniqid.process(),
      name: this.ctx.post('name'),
      password: think.md5(this.ctx.post('password')),
      email: this.ctx.post('email'),
      createtime: Date.now()
    });
  }

  async getCaptchaAction() {
    let captcha = svgCaptcha.create({
      size: 6,
      fontSize: 32,
      color: true,
      width: 200
    });
    console.log(captcha.text);
    this.body = captcha.data;
  }

  async loginAction() {
    const email = this.ctx.post('email');
    const password = think.md5(this.ctx.post('password'));
    let data = await model.where({email: email, password: password}).find();
    if (think.isEmpty(data)) {
      this.body = {validated: false};
    } else {
      let userInfo = {
        uid: data.uid,
        loginTime: Date.now(),
        uip: this.ctx.header['x-real-ip']
      };
      await this.cookie('uid', userInfo.uid, {maxAge: 15 * 3600 * 1000 * 20});
      await this.cache(userInfo.uid, JSON.stringify(userInfo), 'redis');
      await this.session(userInfo.uid, JSON.stringify(userInfo));
      this.body = {validated: true,name:data.name,email:data.email};
    }
  }

  async logoutAction(){
    let uid=await this.cookie('uid');
    await this.cache(uid,null,'redis');
    await this.session(null);
    await this.cookie('uid',null);
    this.body='ok';
  }

  async validateAction() {
    let uid = this.ctx.cookie('uid');
    console.log(uid);
    let userInfo = await this.cache(uid, undefined, 'redis');
    let session_userInfo = await this.session(uid);
    if (userInfo == session_userInfo) {
      let parsedUserInfo = JSON.parse(userInfo);
      parsedUserInfo.loginTime = Date.now();
      //更新session和redis里面的userInfo
      await this.cache(uid, JSON.stringify(parsedUserInfo), 'redis');
      await this.session(uid, JSON.stringify(parsedUserInfo));
      this.body = {validated: true};
    } else {
      this.body = {validated: false};
    }
  }
};
