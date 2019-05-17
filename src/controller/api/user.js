const uniqid = require('uniqid');
const model = think.model('ewordfun/user');
const svgCaptcha = require('svg-captcha');
const nodemailer = require('nodemailer');
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
      await this.cookie('uid', userInfo.uid, {maxAge: 24 * 3600 * 1000 * 20});
      await this.cache(userInfo.uid, JSON.stringify(userInfo), {
        type: 'redis',
        redis: {
          timeout: 24 * 3600 * 1000 * 20
        }
      });
      await this.session(userInfo.uid, JSON.stringify(userInfo), {maxAge: 24 * 3600 * 1000 * 20});
      this.body = {validated: true, name: data.name, email: data.email};
    }
  }

  async logoutAction() {
    let uid = await this.cookie('uid');
    await this.cache(uid, null, 'redis');
    await this.session(null);
    await this.cookie('uid', null);
    this.body = 'ok';
  }

  async validateAction() {
    let uid = this.ctx.cookie('uid');
    let userInfo = await this.cache(uid, undefined, 'redis');
    let session_userInfo = await this.session(uid);
    console.log('session_userInfo' + session_userInfo);
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

  //-1 用户未注册 -2 邮件发送失败 1 邮件发送成功
  async sendPWChangeMailAction() {          //需要做是否存在该用户验证
    let email = this.ctx.post('email');
    let user = await model.where({email: email}).find();
    if (think.isEmpty(user)) {
      this.body = {msg: '用户不存在，请注册', code: -1};
      return;
    }
    console.log(email);
    return;
    let uniqidmd5 = think.md5(uniqid.process());
    await this.cache(email, uniqidmd5, {type: 'redis', redis: {timeout: 24 * 3600 * 1000}});
    let mLink = '<a href="http://127.0.0.1:8360/api/user/resetPassword/' + uniqidmd5 + '">http://127.0.0.1:8360/api/user/resetPassword/' + uniqidmd5 + '</a>';
    this.assign({
      user: user.name,
      mLink: mLink
    });
    const reset_pw_email = await this.render('reset_pw_email');
    let transporter = nodemailer.createTransport({
      host: 'smtp.ewordfun.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: 'admin@ewordfun.com', // generated ethereal user
        pass: 'Iamaman.' // generated ethereal password
      },
      tls: {
        rejectUnauthorized: false
      }
    });
    let mailOptions = {
      from: 'ewordfun<admin@ewordfun.com>', // 如果不加<xxx@xxx.com> 会报语法错误
      to: '990460889@qq.com', // list of receivers
      subject: '重置你在ewordfun的密码', // Subject line
      html: reset_pw_email
    };
    let sendInfo = await transporter.sendMail(mailOptions);
    if (sendInfo.accepted.length != 0) {           //发送失败的还没有测试
      this.body = {msg: '邮件发送成功', code: 1};
    } else {
      this.body = {msg: '邮件发送失败', code: -2};
    }
  }

  async resetPasswordAction() {
    return this.display();
  }

  async updatePasswordAction() {
    console.log(this.ctx.post('uniqidmd5'));
  }
};
