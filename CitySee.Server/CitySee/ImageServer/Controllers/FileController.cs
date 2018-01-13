using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using CitySee.Core;

namespace ImageServer
{
    [Route("[controller]/[action]")]
    public class FileController : Controller
    {
        private readonly ImageServerConfig _config = null;
        public FileController(ImageServerConfig config)
        {
            _config = config;
        }

        [HttpGet]
        public async Task<ResponseMessage> Test()
        {
            return new ResponseMessage();
        }


        [HttpPost("{objectId}")]
        public async Task<ResponseMessage<string>> Upload([FromRoute]string objectId)
        {
            ResponseMessage<string> response = new ResponseMessage<string>();
            var pathItem = _config.PathList.FirstOrDefault();
            if (pathItem == null)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = "无法上传";
                return response;
            }
            var files = Request.Form.Files;
            var file = files.FirstOrDefault();
            if (file == null)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = "没有文件";
                return response;
            }
            string fileGuid = Request.Form["fileGuid"];
            string name = Request.Form["name"];
            string ext = System.IO.Path.GetExtension(name);

            DateTime now = DateTime.Now;
            string targetPath = System.IO.Path.Combine(pathItem.LocalPath, now.Year.ToString(), now.Month.ToString(), objectId, fileGuid + ext);
            string dir = System.IO.Path.GetDirectoryName(targetPath);
            try
            {
                System.IO.Directory.CreateDirectory(dir);
            }
            catch (Exception e)
            {
                response.Code = ResponseCodeDefines.ServiceError;
                response.Message = "无法创建目录：" + e.Message;
                return response;
            }
            using (System.IO.FileStream fs = new System.IO.FileStream(targetPath, System.IO.FileMode.Create))
            {
                await file.OpenReadStream().CopyToAsync(fs);
            }
            response.Extension = targetPath;
            return response;
        }
    }
}
