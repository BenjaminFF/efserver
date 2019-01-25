const uniqid = require('uniqid');
const model = think.model('ewordfun/folder');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  async listAction() {
    let data = await model.where({authorid: this.ctx.get('authorid')}).select();
    this.body = data;
  }

  async addAction() {
    await model.add({
      name: this.ctx.post('name'),
      intro: this.ctx.post('intro'),
      authorid: this.ctx.post('authorid'),
      createtime: Date.now()
    });
  }

  async updateAction() {
    let folder = {
      name: this.ctx.post('name'),
      intro: this.ctx.post('intro')
    };
    await model.where({fid: this.ctx.post('fid')}).update(model.beforeUpdate(folder));
  }

  async addSetAction() {

  }

  async listSetAction(){

  }

  async deleteAction() {
    await model.where({fid: this.ctx.post('fid')}).delete();
  }
};
