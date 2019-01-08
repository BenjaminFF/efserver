const uniqid = require('uniqid');
const model = think.model('ewordfun/set');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }
  //create set indicates that it's vocabulary will be created immediately
  createAction() {
    let authorid=this.ctx.post('authorid')
    let set=JSON.parse(this.ctx.post('set'));
    let vocabularies=JSON.parse(this.ctx.post('vocabularies'));
    let sid=uniqid.time();

    set.sid=sid;
    set.createtime=Date.now();
    set.authorid=authorid;
    set.vcount=vocabularies.length;
    vocabularies.forEach((vocabulary)=>{
      vocabulary.vid=uniqid.time();
      vocabulary.sid=sid;
    })
    this.body=JSON.stringify(vocabularies);
    model.create(set,vocabularies);
  }
  //remove set indicates that it's vocabularies will be removed too.
  removeAction(){
    model.remove(this.ctx.post('sid'));
  }

  async acquireAction(){
    this.body=await model.acquire(this.ctx.get('sid'));
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
}
