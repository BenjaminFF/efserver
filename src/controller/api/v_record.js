const model = think.model('ewordfun/v_record');
module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  async updateAction(){
    let record=JSON.parse(this.ctx.post('v_record'));
    await model.where({rid:record.rid}).update(record);
  }

  async updateManyAction(){
    let records=JSON.parse(this.ctx.post('v_records'));
    model._pk='rid';
    await model.updateMany(records);
  }
}
