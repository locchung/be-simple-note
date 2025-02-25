// const regexUsername = /[^\w_\-]/g;
// const allRegexUsername = [
//   /^_+/g,
//   /[^A-Z0-9a-z_]+/g
// ];
const regexNumber = /[^0-9]+/g;
// const regexEmail = /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regexUrl = /\W+/g;

const maxProgramName = 60;
// const maxUserName = 30;
const maxHandPhone = 14;

class RegexHelper {
  static regexEmail() {
    return /^(([^<>()[\]\\.,;:\s@\']+(\.[^<>()[\]\\.,;:\s@\']+)*)|(\'.+\'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }
  static toProgramName(input) {
    return (input ? input.replace(/^\s+/g, '').replace(/[^a-zA-Z0-9\s]]+/g, '').substr(0, maxProgramName) : '');
  }

  static toFullName(input) {
    return (input ? input.toString().replace(/^\s+/g, '').replace(/[^\w\s]/g, '') : '');
  }

  static toUserName(input) {
    return input;
    // return (input ? input.replace(regexUsername, '').substr(0, maxUserName) : '');
  }

  static toURL(input) {
    return input.replace(/^\s+/g, '').replace(regexUrl, '');
  }

  static toNumber(input) {
    return Number(input.toString().replace(/^\s+/g, '').replace(regexNumber, ''));
  }

  static toPhoneNumber(code, input) {
    if(input) {
      return input.replace(/null+/g, '').replace(/^\s+/g, '').replace(`/^\\${code}+/g`, '0').replace(/[^0-9]+/g, '').substr(0, maxHandPhone);
    } else {
      return '';
    }
  }

  static toPhoneNumberCode(input) {
    if(input) {
      return input.replace(/null+/g, '').replace(/^\s+/g, '').replace(/[^0-9+]+/g, '');
    } else {
      return '';
    }
  }

  static toWord(input) {
    return (input ? input.toString().replace(/^\s+/g, '').replace(/[^\w]/g, '') : '');
  }

  static async validateUserName(input) {
    return input;
    // input = input.toString().toLowerCase();
    // const data = await new Promise((resolve, reject) => {
    //   let result = true;
    //   for(let index = 0; index < allRegexUsername.length; index++) {
    //     result = !allRegexUsername[index].test(input);
    //     if(!result) {
    //       reject(false);
    //     } else if(result && (index + 1) >= allRegexUsername.length) {
    //       resolve(true);
    //     }
    //   }
    // });
    // return data;
  }
}

export default RegexHelper;
