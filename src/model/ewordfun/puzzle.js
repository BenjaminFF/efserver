module.exports = class extends think.Model {
  async create(puzzle, authorid) {
    try {
      let puzzle_user = await this.model('puzzle_user').db(this.db());
      await this.startTrans();
      let pid = await this.add({
        name: puzzle.name,
        intro: puzzle.intro,
        sid: puzzle.sid,
        chvps: puzzle.chvps,
        authorid: authorid
      });
      await puzzle_user.add({
        pid: pid,
        uid: authorid,
        sid: puzzle.sid,
        puzzle_progress: puzzle.puzzle_progress
      });
      await this.commit();
    } catch (e) {
      await this.rollback();
      console.log(e);
    }
  }

  async listOfUser(uid) {
    let puzzle_user = await this.model('puzzle_user').db(this.db());
    let puzzles = await puzzle_user.join({
      table: 'puzzle',
      join: 'inner',
      on: ['pid', 'pid']
    }).where({uid: uid}).select();
    return puzzles;
  }

  async updateProgress(puzzleInfo) {
    let puzzle_user = await this.model('puzzle_user').db(this.db());
    await puzzle_user.where({uid: puzzleInfo.uid, pid: puzzleInfo.pid, sid: puzzleInfo.sid}).update(puzzleInfo);
  }
};
