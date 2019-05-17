const uniqid = require('uniqid');
const model = think.model('ewordfun/puzzle');

module.exports = class extends think.Controller {
  __before() {
    //添加权限
  }

  createAction() {
    console.log(this.ctx.post('puzzle'));
    let puzzle = JSON.parse(this.ctx.post('puzzle'));
    model.create(puzzle, this.cookie('uid'));
  }

  async list_of_userAction() {
    let uid = this.get('uid');
    this.body = await model.listOfUser(uid);
  }

  //update puzzle_progress and rpuzzle
  async updateProgressAction() {
    let puzzleInfo = JSON.parse(this.ctx.post('puzzleInfo'));
    await model.updateProgress(puzzleInfo);
  }
};
