module.exports = class extends think.Model {
  async create(puzzle) {
    try {
      let puzzle_user = await this.model('puzzle_user').db(this.db());
      await this.startTrans();
      let pid=await this.add(puzzle);
      await puzzle_user.add({
        pid:pid,
        uid:puzzle.authorid,
        sid:puzzle.sid,
        rpuzzle:0
      });
      await this.commit();
    } catch (e) {
      await this.rollback();
      console.log(e);
    }
  }

  async listOfUser(uid){
    let puzzle_user = await this.model('puzzle_user').db(this.db());
    let puzzles=await puzzle_user.join({
      table:'puzzle',
      join:'inner',
      on:['pid','pid']
    }).where({uid:uid}).select();
    return puzzles;
  }
}
