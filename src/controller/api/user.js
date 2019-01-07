const uniqid = require('uniqid');
const model = think.model('ewordfun/user');
module.exports = class extends think.Controller {
  __before() {

  }

  async addAction() {

    await model.add({
      uid: uniqid.time(),
      name: this.ctx.post('name'),
      password: this.ctx.post('password'),
      email: this.ctx.post('email'),
      createtime: Date.now()
    });
  }

  async validateAction() {

  }
};
