const uniqid = require('uniqid');
const model = think.model('ewordfun/vocabulary');

module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  addAction(){
    let vocabulary={
      term:this.ctx.post('term'),
      definition:this.ctx.post('definition'),
      sid:this.ctx.post('sid'),
      authorid:this.ctx.post('authorid')
    }
    model.addV(this.ctx.post('sid'),this.ctx.post('authorid'),vocabulary);
  }

  async updateAction(){
    let updatedVocabulary={
      term:this.ctx.post('term'),
      definition:this.ctx.post('definition'),
    }
    await model.where({vid:this.ctx.post('vid')}).update(updatedVocabulary);
  }

  async deleteAction(){
    await model.where({vid:this.ctx.post('vid')}).delete();
  }
}
