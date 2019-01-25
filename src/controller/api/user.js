const uniqid = require('uniqid');
const model = think.model('ewordfun/user');
const svgCaptcha=require('svg-captcha');
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

  async getCaptchaAction(){
    let captcha=svgCaptcha.create({
      size:6,
      fontSize:32,
      color:true,
      width:200
    })
    console.log(captcha.text);
    this.body=captcha.data;
  }

  async loginAction() {
    console.log(this.ctx);
  }
};
