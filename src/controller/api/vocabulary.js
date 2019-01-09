const uniqid = require('uniqid');
const model = think.model('ewordfun/vocabulary');

module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  async addAction(){
    let vocabulary={
      vid:uniqid.time(),
      term:this.ctx.post('term'),
      definition:this.ctx.post('definition'),
      sid:this.ctx.post('sid')
    }
    await model.add(vocabulary);
  }

  async updateAction(){
    let updatedVocabulary={
      term:this.ctx.post('term'),
      definition:this.ctx.post('definition'),
    }
    await model.where({vid:this.ctx.post('vid')}).update(updatedVocabulary);
  }
}
