const uniqid = require('uniqid');
const model = think.model('ewordfun/set');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }
  //create set indicates that it's vocabulary will be created, and record will be initialized.
  createAction() {
    let authorid=this.ctx.post('authorid')
    let set=JSON.parse(this.ctx.post('set'));
    let vocabularies=JSON.parse(this.ctx.post('vocabularies'));

    set.createtime=Date.now();
    set.authorid=authorid;
    set.vcount=vocabularies.length;

    model.create(set,vocabularies,authorid);
  }
  //remove set indicates that it's vocabularies will be removed too.
  removeAction(){
    model.remove(this.ctx.post('sid'));
  }

  async acquireAction(){
    console.log(uniqid.process());
    this.body=await model.acquire(this.ctx.get('sid'),this.ctx.get('uid'));
  }

  //update set and vocabularies both
  updateSVAction(){
    let set=JSON.parse(this.ctx.post('set'));
    let vocabularies=JSON.parse(this.ctx.post('vocabularies'));
    console.log(vocabularies);
    set.vcount=vocabularies.length;     //!important
    model.updateSV(set,vocabularies);
  }

  async updateAction(){
    let set=JSON.parse(this.ctx.post('set'));
    await model.where({sid:set.sid}).update(set);
  }

  async listAction(){
    let authorid=JSON.parse(this.ctx.get('uid'))
  }
}
