module.exports = class extends think.Model {
  list() {
    return this.field('name').select();
  }
}
