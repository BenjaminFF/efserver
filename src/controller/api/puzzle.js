const uniqid = require('uniqid');
const model = think.model('ewordfun/puzzle');

module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  createAction(){
    let puzzle=JSON.parse(this.ctx.post('puzzle'));
    model.create(puzzle);
  }

  async list_of_userAction(){
    let uid=this.get('uid');
    console.log(uid);
    this.body=await model.listOfUser(uid);
  }
}
