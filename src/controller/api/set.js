const uniqid = require('uniqid');
const model = think.model('ewordfun/set');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  async addAction() {
    await model.add({
      sid: uniqid.time(),
      name: this.ctx.post('name'),
      intro: this.ctx.post('intro'),
      authorid: this.ctx.post('authorid'),
      vcount:this.ctx.post('authorid'),
      createtime: Date.now()
    });
  }

}
