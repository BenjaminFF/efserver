module.exports = class extends think.Logic {
  addAction() {
    let rules = {
      name: {
        string: true,
        required: true,
        method: 'post',
        length:{min:2,max:30}
      },
      password: {
        string: true,
        required: true,
        method: 'post',
        length:{min:6,max:32}
      },
      email: {
        required: true,
        email: true,
        method: 'post',
        length:{max:64}
      }
    };
    console.log(this.validate(rules));
    return this.validate(rules);
    //return false;
  }

  loginAction(){
    let rules = {
      password: {
        string: true,
        required: true,
        method: 'post',
        length:{min:6,max:64}
      },
      email: {
        required: true,
        email: true,
        method: 'post',
        length:{max:64}
      }
    };
  }
};
//用户进入登陆界面，传输验证码图片数据
//输入email账号，password, 验证码。如果正确，就返回user_authenticity_token和用户


