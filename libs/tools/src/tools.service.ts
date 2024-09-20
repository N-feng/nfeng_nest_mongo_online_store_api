import { Injectable } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
import COS = require('cos-nodejs-sdk-v5');
import { format } from 'silly-datetime';

@Injectable()
export class ToolsService {
  getCosUploadFile(filename, folder?: string) {
    //1、获取当前日期 20210920
    const today = format(new Date(), 'YYYYMMDD');

    //2、生成文件名称  获取文件保存的目录   以前的文件 serverless_600x900.png    20210920.png
    // const d = this.getUnixTime();

    //  20210920/4124215212.png
    //20210412/1618196478.826.png
    // const saveDir = dir + '/' + d + path.extname(filename);
    const dir = folder ? `online_store/${folder}` : 'online_store';
    const saveDir = dir + '/' + today + '_' + filename;
    return saveDir;
  }

  async uploadCos(filename, body) {
    const cos = new COS({
      SecretId: process.env.SecretId,
      SecretKey: process.env.SecretKey,
    });

    return new Promise((reslove, reject) => {
      cos.putObject(
        {
          Bucket: 'nfeng-1257981287' /* 必须 */,
          Region: 'ap-guangzhou' /* 必须 */,
          Key: filename /* 必须 */,
          StorageClass: 'STANDARD',
          Body: body, // 上传文件对象
          onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
          },
          Headers: {
            'Content-Disposition': 'inline',
          },
          ACL: 'public-read',
        },
        function (err, data) {
          if (!err) {
            reslove(data);
          } else {
            reject(err);
          }
        },
      );
    });
  }
}
