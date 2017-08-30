/**
 * Created by mq on 17-8-28.
 * mm-make-license测试
 */
const debug = require('debug')('mm:makeLicense');
const spawn = require('child_process').spawn;

const mmMakeLicense = spawn('mm-make-license', []);

const reqLicense = 'MXP1vLPmIYW4FiLdMzlLT0ThT61LPnag0M38+qovVGFRfQFlnMLkOu4VSpM/Ew0sbXsUTARtJdhnjqlA7M9Ku3Edr+YPBumK/OdNfPcbMqau4J//MXU4hNCI5eeW8/mgwz7q4/uvie5tYyxSM0jif3pvFKCE1AKQp97YAayOYBr8hwm8fHx0O7lRcBTSAtXG89uG9wUGWh5N0vpo2PYjQk95DD/N1GNtxAJoprF/hGZxuWfSIy4v9eswxU97QTy9TZl0CMUeUmyBxntQUn0aPz1Wczh9ebGlWxnk8rAcwP7D++CI1WvkG8mb+Q125ZkqMjfSCLelN1Z3+ntqxtOxSE/TfDXOadz4Ip7rgyIpS86jtYhpUyz2BbFGqObyUk6ZkxIZtbVxPfE/DmCwnof/NMFAkAa2jGM4AKEC9l1ecio6g9aRMQiQHlgU8wXAytrVykWIX8gfwUf8WHlqKFuR5zi4lYuNlamP6g7SziG4dchdOWmY1dVOa7m/CheA0mN1IuIye2ZuD+I54DIPNnP0RqG6iRSCvysKEbsGPyxoc6xOCoxxqX9HDPOMxwqVM6sjWEOkjMtmkGnGDH6BtoELBma2eoP+l4tkg1yrOVw1iX1LeiVsDPkt60vAl/q6GbGuWhXDjscTCqdH4JqGYGMZ7y887cx7mPRSvfKQyTF6nq+hXROVsUppDzOwwb+IG3gEjdZpZR5nIHIwaA6974BJXPAHINIpjCDEiAxFiWXJh3HdKRMZPYPaxz+h8LTVyoGMYoT3kw/A/0+Gl89S21Fhw1tnuzYf2aOiT8X1TbuFfBiLuoInyQO5KxQjEgYHkb1pyATyex3q/P+5/Wj+M53yJSjw9UJJazuCfKKohENgoaD+Rt+ZDQK95LvdgtCBKEISOmNpgfFOWCEZSFjxjbma6x8BO1Hz9gQc3b65vwGb7q2BOtSg5Z4LqSzsxBI2HY1QXQU1x4q7/kwoa2/JQj3gmx9zdoPFNIpdAaPPbzdqLQi4AtA6IFMrLwV25Q59RsmJoBhlPiOxSg3F9ATATNoaVH3k2rLT4gsSbYgJW97AjU9GBiRrtsw5kGkrKEId5mxl9Lb4/0dYFtsS14dzx1dfatZyO72aCIvfrt1Ov8vmqIFpA6+LR6UiSh85lBg5p4Cm0jB84UpFqvGjwIGezoPwV/w7RwiGUxsYmlxVAylI+bgDbjoVS3xcBmZUxoR6kLBSB7VSEvvpcFnEa594BfqP73zNGcZokyfvykHhVX3ebz2Jx5gTrEKJ5NzJgodJmJ53AT4n5YDRRh37sHfXB+RmlnVm+vxTO/7GHdWowrSILgkbn+HrwkN8lkA4ocoMvr3K8qBXf5qj26J6NusfOx7xMJzHR/09Yy5SOdOQGYLTRUgKO0BjSImTp4vNAJXyO25HSWnJWGS3UDuzB0kokqavtY7jSme6SlAXykFh/27DVCq6cyTGZclNv74DCKj5zHcp3oUin8CoanGAc0hMxi3Ht4R5wB6MmT4QQIBwvMnl1Ank+fs4uFY6XBHQJfvVHLwykr+U2bBpzfQRBKxyo4c=';

// 解析请求码内容
mmMakeLicense.stdout.on('data', (data) => {
    // 先解析请求码信息//{ organize: '111', contact: '2222', tel: '3333', email: '4444' }
    const infoPos = data.indexOf('organize');
    if (infoPos >= 0) {
        const pos1 = data.indexOf('\n');
        const pos2 = data.lastIndexOf('\n');
        const str = data.toString().substring(pos1+1, pos2);
        // debug('Info:', JSON.parse(str));
        debug('Info:', str);
        mmMakeLicense.kill('SIGHUP');
    } else {
        const pos = data.indexOf('\n');
        const str = data.toString().substring(0, pos);
        debug(`stdout:${str}//${pos}`);

        if (str === 'please input license request data:') { // 请求码
            mmMakeLicense.stdin.write(reqLicense);
            mmMakeLicense.stdin.write('\n');
        }
    };
})
// 生成授权码
mmMakeLicense.stdout.on('data', (data) => {
    // 授权码
    const codePos = data.indexOf('LICENSE CODE');
    if (codePos >= 0) {
        const pos1 = data.indexOf('\n');
        const pos2 = data.lastIndexOf('\n');
        const str = data.toString().substring(pos1+1, pos2);
        debug('CODE:', str);
    } else {
        const pos = data.indexOf('\n');
        const str = data.toString().substring(0, pos);
        debug(`stdout:${str}//${pos}`);

        if (str === 'please input license request data:') { // 请求码
            mmMakeLicense.stdin.write(reqLicense);
            mmMakeLicense.stdin.write('\n');
        } else if (str === 'please input your name:') { // 授权人
            mmMakeLicense.stdin.write('mq');
            mmMakeLicense.stdin.write('\n');
        } else if (str === 'please input expirtDate year:') {   // 年
            mmMakeLicense.stdin.write('2017');
            mmMakeLicense.stdin.write('\n');
        } else if (str === 'please input expirtDate month (1-12):') { // 月
            mmMakeLicense.stdin.write('12');
            mmMakeLicense.stdin.write('\n');
        } else if (str === 'please input expirtDate day:') {    // 日
            mmMakeLicense.stdin.write('1');
            mmMakeLicense.stdin.write('\n');
        } else if (str === 'please input client limit:') {  // 终端数量
            mmMakeLicense.stdin.write('9');
            mmMakeLicense.stdin.write('\n');
        }
    }
})

mmMakeLicense.stderr.on('data', (data) => {
    debug(`stderr: ${data}`);
})

mmMakeLicense.on('close', (code) => {
    debug(`child process exited with code ${code}`);
})




