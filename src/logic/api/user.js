module.exports = class extends think.Logic {
  addAction() {
    let rules = {
      name: {
        string: true,
        required: true,
        method: 'post'
      },
      password: {
        string: true,
        required: true,
        method: 'post'
      },
      email: {
        required: true,
        email: true,
        method: 'post'
      }
    };
    //return this.validate(rules);
    return false;
  }
};
