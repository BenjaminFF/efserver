module.exports = class extends think.Model {
  async addV(sid,uid,vocabulary){                          //item and record
    try {
      let recordDB=await this.model('v_record').db(this.db());
      await this.startTrans();
      let vid=await this.add(vocabulary);
      await recordDB.add({
        sid:sid,
        vid:vid,
        uid:uid,
        rflashcard:false,
        rmatrix:false,
        rwrite:false
      });
      await this.commit();
    }catch (e) {
      await this.rollback();
      console.log(e);
    }
  }
}
