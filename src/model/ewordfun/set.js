module.exports = class extends think.Model {
  async create(set, vocabularies,authorid) {
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      let recordDB=await this.model('v_record').db(this.db());
      await this.startTrans();
      let sid=await this.add(set);
      vocabularies.forEach((vocabulary)=>{
        vocabulary.sid=sid;
        vocabulary.authorid=authorid;
      })
      let vidArr=await vocabularyDB.addMany(vocabularies);
      let records=[];
      vidArr.forEach((vid)=>{
        records.push({
          sid:sid,
          vid:vid,
          uid:authorid,
          rflashcard:false,
          rmatrix:false,
          rwrite:false
        })
      })
      await recordDB.addMany(records);
      await this.commit();
    } catch (e) {
      await this.rollback();
      console.log(e);
    }
  }

  async remove(sid) {
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      let recordDB=await this.model('v_record').db(this.db());
      await this.startTrans();
      await this.where({sid: sid}).delete();
      await vocabularyDB.where({sid: sid}).delete();
      await recordDB.where({sid:sid}).delete();
      await this.commit();
    } catch (e) {
      await this.rollback();
    }
  }

  async acquire(sid,uid) {
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      let recordDB = await this.model('v_record').db(this.db());
      await this.startTrans();
      let set = await this.where({sid: sid}).select();
      let vocabularies = await vocabularyDB.where({sid: sid}).select();
      let records=await recordDB.where({sid:sid,uid:uid}).select();
      vocabularies.forEach((vocabulary)=>{
        records.forEach((record)=>{
          if(vocabulary.vid==record.vid){
            vocabulary.rmatrix=record.rmatrix;
            vocabulary.rflashcard=record.rflashcard;
            vocabulary.rwrite=record.rwrite;
            vocabulary.rid=record.rid;
          }
        });
      });
      await this.commit();
      return {
        set: set,
        vocabularies: vocabularies
      };
    } catch (e) {
      await this.rollback();
      console.log(e);
    }
  }

  //updateSV include vocabularies
  async updateSV(set, vocabularies) {
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      vocabularyDB._pk = 'vid';
      await this.startTrans();
      await this.where({sid:set.sid}).update(set);
      await vocabularyDB.updateMany(vocabularies);
      await this.commit();
    } catch (e) {
      await this.rollback();
      console.log(e);
    }
  }
};
