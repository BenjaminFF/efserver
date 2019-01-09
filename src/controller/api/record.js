const model = think.model('ewordfun/record');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  async updateAction(){
    let record=JSON.parse(this.ctx.post('record'));
    await model.where({rid:record.rid}).update(record);
  }

  async updateManyAction(){
    let records=JSON.parse(this.ctx.post('records'));
    model._pk='rid';
    await model.updateMany(records);
  }
}
