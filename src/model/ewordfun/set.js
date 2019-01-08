module.exports = class extends think.Model {
  async create(set, vocabularies) {
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      await this.startTrans();
      await vocabularyDB.addMany(vocabularies);
      await this.add(set);
      await this.commit();
    } catch (e) {
      await this.rollback();
    }
  }

  async remove(sid){
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      await this.startTrans();
      await this.where({sid:sid}).delete();
      await vocabularyDB.where({sid:sid}).delete();
      await this.commit();
    }catch (e) {
      await this.rollback();
    }
  }

  async acquire(sid){
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      await this.startTrans();
      let set=await this.where({sid:sid}).select();
      let vocabularies=await vocabularyDB.where({sid:sid}).select();
      await this.commit();
      return {
        set:set,
        vocabularies:vocabularies
      }
    }catch (e) {
      await this.rollback();
    }
  }
  //updateSV include vocabularies
  async updateSV(set,vocabularies){
    try {
      let vocabularyDB = await this.model('vocabulary').db(this.db());
      vocabularyDB._pk='vid';
      await this.startTrans();
      //await this.where({sid:set.sid}).update(set);
      await vocabularyDB.updateMany(vocabularies);
      await this.commit();
    }catch (e) {
      await this.rollback();
      console.log(e);
    }
  }
};
